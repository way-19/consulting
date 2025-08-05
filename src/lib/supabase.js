import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const db = {
  // Get consultant's assigned clients
  getConsultantClients: async (consultantId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/consultant-clients`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consultantId,
          countryId: 1
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching consultant clients:', error);
      return [];
    }
  },

  // Get consultant assigned to specific country
  getCountryConsultant: async (countryId) => {
    const { data, error } = await supabase
      .from('consultant_country_assignments')
      .select(`
        consultant:users!consultant_country_assignments_consultant_id_fkey(
          id, first_name, last_name, email, language
        )
      `)
      .eq('country_id', countryId)
      .eq('status', true)
      .maybeSingle();

    if (error) throw error;
    return data?.consultant || null;
  },

  // Assign consultant to new application
  assignConsultantToApplication: async (applicationId, consultantId) => {
    const { data, error } = await supabase
      .from('applications')
      .update({ consultant_id: consultantId })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
  // Get messages between consultant and client
  getMessages: async (consultantId, clientId = null) => {
    if (!consultantId) {
      console.error('❌ consultantId is required for getMessages');
      return [];
    }
    
    let query = supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(first_name, last_name, role, language)
      `);

    if (clientId) {
      query = query.or(`and(sender_id.eq.${consultantId},recipient_id.eq.${clientId}),and(sender_id.eq.${clientId},recipient_id.eq.${consultantId})`);
    } else {
      query = query.or(`sender_id.eq.${consultantId},recipient_id.eq.${consultantId}`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Send message
  sendMessage: async (senderId, recipientId, message, messageType = 'general') => {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        recipient_id: recipientId,
        message: message,
        message_type: messageType,
        original_language: 'tr', // Default to Turkish
        needs_translation: false, // Same language for Georgia
        is_read: false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get client documents
  getClientDocuments: async (clientId) => {
    if (!clientId) {
      console.error('❌ clientId is required for getClientDocuments');
      return [];
    }
    
    const { data, error } = await supabase
      .from('client_documents')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Update document status
  updateDocumentStatus: async (documentId, status, notes = null) => {
    if (!documentId) {
      console.error('❌ documentId is required for updateDocumentStatus');
      throw new Error('Document ID is required');
    }
    
    const { data, error } = await supabase
      .from('client_documents')
      .update({
        status: status,
        consultant_notes: notes
      })
      .eq('id', documentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export default supabase