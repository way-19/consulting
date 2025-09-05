import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { supabase } from '@consulting19/shared/lib/supabase';
import {
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  Users,
  Briefcase,
  CheckSquare,
  CheckCircle,
  AlertTriangle,
  Plus,
  ChevronLeft,
  ChevronRight,
  Settings,
  Save,
  User,
  Building,
  MessageSquare,
  Zap,
  Star,
  X,
  PlayCircle, // Added for live meeting indicator
  Circle, // Added for live meeting indicator
  Edit, // Added for edit button
  Bell // Added for notification icon
} from 'lucide-react';

// --- Type Definitions ---
interface Department {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

interface Consultant {
  id: string;
  full_name: string;
  email: string;
  timezone: string;
  price_per_hour: number;
  currency: string;
}

interface AvailabilitySlot {
  id: string;
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  day_of_week: string; // 'monday', 'tuesday', etc.
  price_per_hour: number;
  currency: string;
}

interface BlockedTime {
  id: string;
  start_datetime: string; // ISO string
  end_datetime: string; // ISO string
}

interface Meeting {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  meeting_type: string;
  status: string;
  price_paid: number;
  currency: string;
  client_id: string;
  consultant_id: string;
  department_id: string;
  meeting_url?: string; // Added meeting_url
  consultant?: { // Added consultant details for display
    full_name: string;
  };
  department?: { // Added department details for display
    name: string;
    color: string;
    icon: string;
  };
}

interface UserPreference {
  id: string;
  setting_key: string;
  setting_value: any;
}

// --- Helper Functions ---
const getDepartmentIcon = (iconName: string) => {
  switch (iconName) {
    case 'Building': return <Building className="w-5 h-5" />;
    case 'Briefcase': return <Briefcase className="w-5 h-5" />;
    case 'DollarSign': return <DollarSign className="w-5 h-5" />;
    case 'Shield': return <Zap className="w-5 h-5" />; // Assuming Shield for Legal
    case 'Users': return <Users className="w-5 h-5" />; // Assuming Users for HR
    default: return <Briefcase className="w-5 h-5" />;
  }
};

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
};

const getDayName = (date: Date) => {
  return date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
};

const getStartOfWeek = (date: Date) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
  const startOfWeek = new Date(date.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
};

const getEndOfWeek = (date: Date) => {
  const endOfWeek = new Date(date);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  return endOfWeek;
};

const generateTimeSlots = (
  date: Date,
  availability: AvailabilitySlot[],
  blockedTimes: BlockedTime[],
  slotDuration: number, // in minutes
  consultantPricePerHour: number,
  consultantCurrency: string
) => {
  const slots = [];
  const dayName = getDayName(date);
  const availableDaySlots = availability.filter(s => s.day_of_week === dayName);

  availableDaySlots.forEach(avail => {
    const [startHour, startMinute] = avail.start_time.split(':').map(Number);
    const [endHour, endMinute] = avail.end_time.split(':').map(Number);

    let currentSlotStart = new Date(date);
    currentSlotStart.setHours(startHour, startMinute, 0, 0);

    let currentSlotEnd = new Date(date);
    currentSlotEnd.setHours(endHour, endMinute, 0, 0);

    while (currentSlotStart.getTime() + slotDuration * 60 * 1000 <= currentSlotEnd.getTime()) {
      const slotEnd = new Date(currentSlotStart.getTime() + slotDuration * 60 * 1000);
      const isBlocked = blockedTimes.some(block => {
        const blockStart = new Date(block.start_datetime);
        const blockEnd = new Date(block.end_datetime);
        return (currentSlotStart < blockEnd && slotEnd > blockStart);
      });

      if (!isBlocked) {
        const price = (consultantPricePerHour / 60) * slotDuration;
        slots.push({
          start: new Date(currentSlotStart),
          end: slotEnd,
          price: price,
          currency: consultantCurrency,
          isPremium: price >= 100 // Example: premium if price is $100 or more
        });
      }
      currentSlotStart = slotEnd;
    }
  });
  return slots;
};

const ClientCalendar = () => {
  const { user, profile } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedConsultant, setSelectedConsultant] = useState<string | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date; price: number; currency: string; isPremium: boolean } | null>(null);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDescription, setMeetingDescription] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [userPreferences, setUserPreferences] = useState<any>({});
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [tempPreferences, setTempPreferences] = useState<any>({});

  const slotDurationOptions = [30, 60, 90, 120]; // in minutes
  const defaultSlotDuration = userPreferences.default_slot_duration || 60;

  // --- Fetch Data ---
  const fetchDepartments = useCallback(async () => {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error) console.error('Error fetching departments:', error);
    else setDepartments(data || []);
  }, []);

  const fetchConsultants = useCallback(async () => {
    let query = supabase
      .from('user_profiles')
      .select('id, full_name, email, timezone, consultant_availability(price_per_hour, currency)')
      .eq('role', 'consultant')
      .eq('is_active', true);

    if (selectedDepartment) {
      // This is a simplified join. In a real app, you'd need a linking table
      // or a more complex query if consultants are linked to departments.
      // For now, we'll just fetch all consultants and filter by department later if needed.
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching consultants:', error);
    } else {
      const mappedConsultants = (data || []).map((c: any) => ({
        id: c.id,
        full_name: c.full_name,
        email: c.email,
        timezone: c.timezone,
        price_per_hour: c.consultant_availability?.[0]?.price_per_hour || 0,
        currency: c.consultant_availability?.[0]?.currency || 'USD',
      }));
      setConsultants(mappedConsultants);
    }
  }, [selectedDepartment]);

  const fetchConsultantAvailability = useCallback(async () => {
    if (!selectedConsultant) return;
    const { data: availabilityData, error: availError } = await supabase
      .from('consultant_availability')
      .select('*')
      .eq('consultant_id', selectedConsultant)
      .eq('is_active', true);

    const { data: blockedData, error: blockedError } = await supabase
      .from('consultant_blocked_times')
      .select('*')
      .eq('consultant_id', selectedConsultant)
      .eq('is_active', true)
      .gte('start_datetime', currentWeekStart.toISOString())
      .lte('end_datetime', getEndOfWeek(new Date(currentWeekStart)).toISOString());

    if (availError) console.error('Error fetching availability:', availError);
    else setAvailabilitySlots(availabilityData || []);
    if (blockedError) console.error('Error fetching blocked times:', blockedError);
    else setBlockedTimes(blockedData || []);
  }, [selectedConsultant, currentWeekStart]);

  const fetchMeetings = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      // Get client ID first
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (!clientData) return;

      const { data, error } = await supabase
        .from('meetings')
        .select(`
          *,
          consultant:user_profiles(full_name),
          department:departments(name, color, icon)
        `)
        .eq('client_id', clientData.id)
        .gte('start_time', currentWeekStart.toISOString())
        .lte('end_time', getEndOfWeek(new Date(currentWeekStart)).toISOString())
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching meetings:', error);
        return;
      }
      
      setMeetings(data || []);
    } catch (err) {
      console.error('Unexpected error fetching meetings:', err);
    }
  }, [user?.id, currentWeekStart]);

  const fetchUserPreferences = useCallback(async () => {
    if (!user?.id) return;
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching user preferences:', error);
    } else {
      const prefs: any = {};
      (data || []).forEach(p => {
        prefs[p.setting_key] = p.setting_value;
      });
      setUserPreferences(prefs);
      setTempPreferences(prefs); // Initialize temp preferences for modal
      if (prefs.preferred_consultant_id) {
        setSelectedConsultant(prefs.preferred_consultant_id);
      }
    }
  }, [user?.id]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchDepartments(),
      fetchConsultants(),
      fetchUserPreferences(),
    ]).then(() => setLoading(false));
  }, [fetchDepartments, fetchConsultants, fetchUserPreferences]);

  useEffect(() => {
    fetchConsultantAvailability();
    fetchMeetings();
  }, [selectedConsultant, currentWeekStart, fetchConsultantAvailability, fetchMeetings]);

  // --- Handlers ---
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(e.target.value === '' ? null : e.target.value);
    setSelectedConsultant(null); // Reset consultant when department changes
  };

  const handleConsultantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedConsultant(e.target.value === '' ? null : e.target.value);
  };

  const handleWeekChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(getStartOfWeek(newDate));
  };

  const handleSlotClick = (slot: any) => {
    setSelectedSlot(slot);
    setMeetingTitle('');
    setMeetingDescription('');
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async () => {
    if (!selectedSlot || !selectedConsultant || !user?.id || !profile?.client_id) {
      alert('Missing booking details.');
      return;
    }

    setBookingLoading(true);

    try {
      const consultantInfo = consultants.find(c => c.id === selectedConsultant);
      if (!consultantInfo) throw new Error('Consultant not found.');

      const meetingDurationMinutes = (selectedSlot.end.getTime() - selectedSlot.start.getTime()) / (1000 * 60);
      const calculatedPrice = (consultantInfo.price_per_hour / 60) * meetingDurationMinutes;

      let newMeetingId: string | null = null;

      // Create meeting record first (status: pending)
      const { data: newMeeting, error: meetingError } = await supabase
        .from('meetings')
        .insert({
          client_id: profile.client_id,
          consultant_id: selectedConsultant,
          department_id: selectedDepartment,
          title: meetingTitle,
          description: meetingDescription,
          start_time: selectedSlot.start.toISOString(),
          end_time: selectedSlot.end.toISOString(),
          meeting_type: 'video', // Default to video
          status: 'pending',
          price_paid: calculatedPrice,
          currency: consultantInfo.currency,
          meeting_url: 'https://meet.google.com/abc-xyz-123' // Mock meeting URL for now
        })
        .select()
        .single();

      if (meetingError) throw meetingError;
      newMeetingId = newMeeting.id;

      if (calculatedPrice > 0) {
        // Initiate Stripe Checkout
        const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
          'create-stripe-checkout',
          {
            body: {
              meeting_id: newMeeting.id,
              amount: Math.round(calculatedPrice * 100), // Amount in cents
              currency: consultantInfo.currency.toLowerCase(),
              title: meetingTitle || 'Consultation Meeting',
              description: meetingDescription || 'Online consultation with consultant',
              success_url: `${window.location.origin}/calendar?payment=success&meetingId=${newMeeting.id}`,
              cancel_url: `${window.location.origin}/calendar?payment=cancelled&meetingId=${newMeeting.id}`
            }
          }
        );

        if (checkoutError) throw checkoutError;

        // Redirect to Stripe Checkout
        if (checkoutData?.url) {
          window.location.href = checkoutData.url;
        }
      } else {
        // Free meeting, update status directly
        const { error: updateError } = await supabase
          .from('meetings')
          .update({ status: 'confirmed' })
          .eq('id', newMeetingId);

        if (updateError) throw updateError;
        alert('Meeting booked successfully!');
        setShowBookingModal(false);
        fetchMeetings(); // Refresh meetings
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      alert(`Failed to book meeting: ${error.message || 'Unknown error'}`);
      // If meeting was created but payment failed, mark it as failed/cancelled
      if (newMeetingId) {
        await supabase.from('meetings').update({ status: 'failed' }).eq('id', newMeetingId);
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setBookingLoading(true); // Re-using loading state
    try {
      const updates = Object.keys(tempPreferences).map(key => ({
        user_id: user?.id,
        setting_key: key,
        setting_value: tempPreferences[key],
      }));

      const { error } = await supabase
        .from('user_preferences')
        .upsert(updates, { onConflict: 'user_id,setting_key' });

      if (error) throw error;

      setUserPreferences(tempPreferences);
      alert('Preferences saved successfully!');
      setShowPreferencesModal(false);
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      alert(`Failed to save preferences: ${error.message || 'Unknown error'}`);
    } finally {
      setBookingLoading(false);
    }
  };

  // --- Render Logic ---
  const daysOfWeek = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(currentWeekStart);
    date.setDate(currentWeekStart.getDate() + i);
    return date;
  });

  const allAvailableSlots = daysOfWeek.flatMap(date => {
    const consultantInfo = consultants.find(c => c.id === selectedConsultant);
    if (!consultantInfo) return [];
    return generateTimeSlots(
      date,
      availabilitySlots,
      blockedTimes,
      userPreferences.default_slot_duration || defaultSlotDuration,
      consultantInfo.price_per_hour,
      consultantInfo.currency
    );
  });

  const getMeetingStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      case 'rescheduled': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const todayMeetings = meetings.filter(meeting => {
    const meetingDate = new Date(meeting.start_time);
    const today = new Date();
    return meetingDate.toDateString() === today.toDateString();
  });

  const upcomingMeetings = meetings.filter(meeting => {
    const meetingDate = new Date(meeting.start_time);
    const now = new Date();
    return meetingDate > now; // Only show meetings in the future
  });

  const totalMeetings = meetings.length;

  const yourConsultant = consultants.find(c => c.id === selectedConsultant);

  // Function to check if meeting is within 24 hours
  const isMeetingWithin24Hours = (meetingStartTime: string) => {
    const now = new Date();
    const startTime = new Date(meetingStartTime);
    const diffHours = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours > 0 && diffHours <= 24;
  };


  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Calendar & Meetings - Client Portal</title>
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendar & Meetings</h1>
            <p className="text-gray-600">Schedule and manage your consultations</p>
          </div>
          <button
            onClick={() => setShowPreferencesModal(true)}
            className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <Settings className="w-4 h-4 mr-2" />
            Preferences
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Meetings</p>
                <p className="text-3xl font-bold text-gray-900">{upcomingMeetings.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Meetings</p>
                <p className="text-3xl font-bold text-gray-900">{totalMeetings}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Your Consultant</p>
                <p className="text-xl font-bold text-gray-900">{yourConsultant ? yourConsultant.full_name : 'Not Selected'}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row gap-4">
          <select
            value={selectedDepartment || ''}
            onChange={handleDepartmentChange}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Department (Optional)</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
          <select
            value={selectedConsultant || ''}
            onChange={handleConsultantChange}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Consultant</option>
            {consultants.map(cons => (
              <option key={cons.id} value={cons.id}>{cons.full_name}</option>
            ))}
          </select>
          <select
            value={userPreferences.default_slot_duration || defaultSlotDuration}
            onChange={(e) => setTempPreferences(prev => ({ ...prev, default_slot_duration: Number(e.target.value) }))}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {slotDurationOptions.map(duration => (
              <option key={duration} value={duration}>{duration} minutes</option>
            ))}
          </select>
        </div>

        {/* This Week's Overview Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">This Week's Overview</h2>
          <p className="text-gray-600 mb-4">
            Consultant timezone: {yourConsultant?.timezone || 'N/A'} • Your timezone: {profile?.timezone || 'N/A'}
          </p>
          <div className="grid grid-cols-7 gap-4">
            {daysOfWeek.map(date => (
              <div key={date.toISOString()} className="flex flex-col items-center">
                <div className="text-sm font-medium text-gray-600">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {date.getDate()}
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  {date.toLocaleDateString('en-US', { month: 'short' })}
                </div>

                <div className="w-full space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                  {allAvailableSlots
                    .filter(slot => slot.start.toDateString() === date.toDateString())
                    .map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => handleSlotClick(slot)}
                        className={`w-full p-2 rounded-lg text-sm font-medium text-center transition-colors
                          ${slot.isPremium ? 'bg-purple-100 text-purple-800 border border-purple-300' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}
                          ${new Date() > slot.start ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        disabled={new Date() > slot.start}
                      >
                        {formatTime(slot.start.toTimeString().substring(0, 5))} - {formatTime(slot.end.toTimeString().substring(0, 5))}
                        {slot.price > 0 && (
                          <span className="block text-xs mt-1">
                            {slot.price === 0 ? 'Free' : `$${slot.price.toFixed(2)}`}
                            {slot.isPremium && <Star className="w-3 h-3 inline-block ml-1 fill-current text-purple-500" />}
                          </span>
                        )}
                      </button>
                    ))}
                  {allAvailableSlots.filter(slot => slot.start.toDateString() === date.toDateString()).length === 0 && (
                    <div className="text-xs text-gray-500 text-center p-4">No slots</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Upcoming Meetings ({upcomingMeetings.length})</h2>
          {meetings.length > 0 ? (
            <div className="space-y-4">
              {meetings.map(meeting => {
                const now = new Date();
                const startTime = new Date(meeting.start_time);
                const endTime = new Date(meeting.end_time);
                const isJoinable = meeting.status === 'confirmed' && meeting.meeting_url &&
                                   (now >= new Date(startTime.getTime() - 15 * 60 * 1000) && now < endTime); // Joinable 15 mins before start
                const isLive = meeting.status === 'confirmed' && now >= startTime && now < endTime;

                return (
                  <div key={meeting.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getMeetingStatusColor(meeting.status)}`}></div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                        <div className="text-sm text-gray-600">
                          {new Date(meeting.start_time).toLocaleString()} with {meeting.consultant?.full_name}
                        </div>
                        {meeting.department && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                            {getDepartmentIcon(meeting.department.icon)}
                            <span>{meeting.department.name}</span>
                          </div>
                        )}
                        {isMeetingWithin24Hours(meeting.start_time) && (
                          <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full flex items-center">
                            <Bell className="w-3 h-3 mr-1" /> In 24h
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getMeetingStatusColor(meeting.status)}`}>
                        {meeting.status}
                      </div>
                      {meeting.price_paid > 0 && (
                        <div className="text-sm font-bold text-green-600 mt-1">
                          ${meeting.price_paid.toFixed(2)}
                        </div>
                      )}
                      {isJoinable ? (
                        <a
                          href={meeting.meeting_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`mt-2 inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors ${isLive ? 'animate-pulse' : ''}`}
                        >
                          {isLive && <Circle className="w-2 h-2 mr-1 fill-current text-red-400 animate-ping" />}
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {isLive ? 'Join Live Meeting' : 'Join Meeting'}
                        </a>
                      ) : meeting.status === 'confirmed' && now < startTime ? (
                        <p className="text-xs text-gray-500 mt-2">
                          Joinable soon
                        </p>
                      ) : null}
                      <button
                        onClick={() => alert('Edit Meeting functionality coming soon!')}
                        className="ml-2 mt-2 inline-flex items-center px-3 py-1 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No upcoming meetings. Book one now!</p>
            </div>
          )}
        </div>

        {/* Calendar Integration Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Calendar Integration</h2>
          <p className="text-gray-600 mb-4">Sync your meetings with Google Calendar, Outlook, or Apple Calendar for seamless scheduling.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => alert('Google Calendar integration coming soon!')}
              className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <img src="https://www.google.com/calendar/images/favicon_2020q4_32dp.png" alt="Google Calendar" className="w-5 h-5 mr-2" />
              Google Calendar
            </button>
            <button
              onClick={() => alert('Outlook integration coming soon!')}
              className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <img src="https://static-assets-web.microsoft.com/images/logos/outlook-icon-48x48.png" alt="Outlook" className="w-5 h-5 mr-2" />
              Outlook
            </button>
            <button
              onClick={() => alert('Apple Calendar integration coming soon!')}
              className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <img src="https://developer.apple.com/design/human-interface-guidelines/images/icons/calendar-app-icon.png" alt="Apple Calendar" className="w-5 h-5 mr-2" />
              Apple Calendar
            </button>
          </div>
        </div>

      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Book Meeting</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date & Time
                </label>
                <p className="p-3 bg-gray-100 rounded-lg text-gray-800">
                  {selectedSlot.start.toLocaleString()} - {selectedSlot.end.toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Title *
                </label>
                <input
                  type="text"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Initial Consultation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={meetingDescription}
                  onChange={(e) => setMeetingDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Briefly describe meeting agenda"
                />
              </div>
              {selectedSlot.price > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-800">
                    Price: <span className="font-bold">${selectedSlot.price.toFixed(2)} {selectedSlot.currency}</span>
                    {selectedSlot.isPremium && <span className="ml-2 text-purple-600">(Premium Slot)</span>}
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBookingSubmit}
                disabled={bookingLoading || !meetingTitle.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {bookingLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  selectedSlot.price > 0 ? `Pay & Book ($${selectedSlot.price.toFixed(2)})` : 'Book Free Meeting'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showPreferencesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Calendar Preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Meeting Duration
                </label>
                <select
                  value={tempPreferences.default_slot_duration || defaultSlotDuration}
                  onChange={(e) => setTempPreferences(prev => ({ ...prev, default_slot_duration: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {slotDurationOptions.map(duration => (
                    <option key={duration} value={duration}>{duration} minutes</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Consultant
                </label>
                <select
                  value={tempPreferences.preferred_consultant_id || ''}
                  onChange={(e) => setTempPreferences(prev => ({ ...prev, preferred_consultant_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">None</option>
                  {consultants.map(cons => (
                    <option key={cons.id} value={cons.id}>{cons.full_name}</option>
                  ))}
                </select>
              </div>
              {/* Add more preferences here */}
            </div>
            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={() => setShowPreferencesModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePreferences}
                disabled={bookingLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {bookingLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClientCalendar;
