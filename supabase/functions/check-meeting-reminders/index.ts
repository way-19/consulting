import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("🔔 Meeting reminders check started...");

    // Initialize Supabase with service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const next15Minutes = new Date(now.getTime() + 15 * 60 * 1000);

    console.log(`Checking meetings between ${now.toISOString()} and ${next24Hours.toISOString()}`);

    // Find upcoming meetings in the next 24 hours
    const { data: meetings, error: meetingsError } = await supabase
      .from('meetings')
      .select(`
        id,
        title,
        start_time,
        client_id,
        consultant_id,
        meeting_url,
        clients:client_id (
          profile_id,
          profile:user_profiles!clients_profile_id_fkey(
            id,
            full_name,
            email
          )
        )
      `)
      .eq('status', 'scheduled')
      .gte('start_time', now.toISOString())
      .lte('start_time', next24Hours.toISOString());

    if (meetingsError) {
      console.error("❌ Error fetching meetings:", meetingsError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch meetings" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📅 Found ${meetings?.length || 0} upcoming meetings`);

    let remindersSent = 0;
    let errors = 0;

    // Process each meeting
    for (const meeting of meetings || []) {
      try {
        const meetingDate = new Date(meeting.start_time);
        const timeUntilMeeting = meetingDate.getTime() - now.getTime();
        const hoursUntilMeeting = timeUntilMeeting / (1000 * 60 * 60);

        console.log(`📝 Processing meeting "${meeting.title}" - ${hoursUntilMeeting.toFixed(1)}h away`);

        // Get user preferences for the client
        const { data: preferences, error: preferencesError } = await supabase
          .from('user_preferences')
          .select('setting_key, setting_value')
          .eq('user_id', meeting.clients?.profile_id);

        if (preferencesError) {
          console.error(`❌ Error fetching preferences for client ${meeting.clients?.profile_id}:`, preferencesError);
          errors++;
          continue;
        }

        // Convert preferences array to object
        const userPrefs: any = {};
        (preferences || []).forEach(pref => {
          userPrefs[pref.setting_key] = pref.setting_value;
        });

        const emailRemindersEnabled = userPrefs.enable_email_reminders || false;
        const defaultReminderTime = userPrefs.default_reminder_time || 15; // minutes
        const reminderThreshold = defaultReminderTime / 60; // convert to hours

        console.log(`👤 Client preferences:`, {
          email_reminders: emailRemindersEnabled,
          reminder_time: defaultReminderTime,
          threshold_hours: reminderThreshold
        });

        // Check if we should send reminder based on user preferences
        const shouldSendReminder = emailRemindersEnabled && 
                                   hoursUntilMeeting <= reminderThreshold && 
                                   hoursUntilMeeting > 0;

        if (shouldSendReminder) {
          console.log(`📧 Sending reminder for meeting: ${meeting.title}`);

          // Check if reminder already sent (to avoid duplicates)
          const { data: existingReminder } = await supabase
            .from('notifications')
            .select('id')
            .eq('recipient_profile_id', meeting.clients?.profile_id)
            .eq('type', 'meeting_reminder')
            .eq('payload->meeting_id', meeting.id)
            .gte('created_at', new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()) // Last 24h
            .limit(1);

          if (existingReminder && existingReminder.length > 0) {
            console.log(`⚠️ Reminder already sent for meeting ${meeting.id}`);
            continue;
          }

          // Send notification via our notify function
          const notifyResponse = await supabase.functions.invoke('notify', {
            body: {
              recipient_id: meeting.clients?.profile_id,
              type: 'meeting_reminder',
              payload: {
                meeting_id: meeting.id,
                meeting_title: meeting.title,
                meeting_time: meeting.start_time,
                meeting_url: meeting.meeting_url,
                time_until_meeting: `${Math.round(hoursUntilMeeting * 60)} minutes`,
                reminder_type: hoursUntilMeeting <= 0.25 ? 'final' : 'advance'
              },
              email_notification: true
            }
          });

          if (notifyResponse.error) {
            console.error(`❌ Failed to send notification for meeting ${meeting.id}:`, notifyResponse.error);
            errors++;
          } else {
            console.log(`✅ Reminder sent for meeting: ${meeting.title}`);
            remindersSent++;
          }

          // Create audit log
          await supabase
            .from('audit_logs')
            .insert({
              user_id: 'system',
              action_type: 'meeting_reminder_sent',
              description: `Meeting reminder sent for: ${meeting.title}`,
              payload: {
                meeting_id: meeting.id,
                recipient_id: meeting.clients?.profile_id,
                hours_before: hoursUntilMeeting.toFixed(2),
                reminder_preference: defaultReminderTime
              }
            });

        } else {
          console.log(`⏭️ No reminder needed for meeting ${meeting.id} (${hoursUntilMeeting.toFixed(1)}h away, reminders: ${emailRemindersEnabled})`);
        }

      } catch (meetingError) {
        console.error(`❌ Error processing meeting ${meeting.id}:`, meetingError);
        errors++;
      }
    }

    // Also check for overdue meeting follow-ups
    const { data: overdueMeetings } = await supabase
      .from('meetings')
      .select(`
        id,
        title,
        start_time,
        client_id,
        clients:client_id (
          profile_id,
          profile:user_profiles!clients_profile_id_fkey(id, full_name, email)
        )
      `)
      .eq('status', 'scheduled')
      .lt('start_time', now.toISOString())
      .gte('start_time', new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()); // Last 2 hours

    // Send follow-up for missed meetings
    for (const meeting of overdueMeetings || []) {
      try {
        await supabase.functions.invoke('notify', {
          body: {
            recipient_id: meeting.clients?.profile_id,
            type: 'meeting_missed',
            payload: {
              meeting_id: meeting.id,
              meeting_title: meeting.title,
              scheduled_time: meeting.start_time
            },
            email_notification: true
          }
        });

        // Update meeting status to missed
        await supabase
          .from('meetings')
          .update({ status: 'cancelled' })
          .eq('id', meeting.id);

        console.log(`📭 Sent missed meeting notification for: ${meeting.title}`);
        
      } catch (err) {
        console.error(`❌ Error sending missed meeting notification:`, err);
        errors++;
      }
    }

    console.log(`✅ Meeting reminders check completed: ${remindersSent} reminders sent, ${errors} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        reminders_sent: remindersSent,
        errors: errors,
        meetings_checked: meetings?.length || 0,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("❌ Meeting reminders function error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Meeting reminders check failed", 
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});