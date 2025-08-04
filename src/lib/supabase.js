import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const db = {
  // Fetch all countries with their details
  getCountries: async () => {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .eq('status', true)
      .order('name', { ascending: true });
    if (error) throw error;
    return data;
  },

  // Get country by slug
  getCountryBySlug: async (slug) => {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  // Get consultant's assigned clients
  getConsultantClients: async (consultantId) => {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        client:users!applications_client_id_fkey(
          id, first_name, last_name, email, language, company_name, business_type,
          client_country:countries!users_country_id_fkey(name, flag_emoji)
        )
      `)
      .eq('consultant_id', consultantId)
      .not('client_id', 'is', null);

    if (error) throw error;
    
    // Get unique clients
    const uniqueClients = data?.reduce((acc, app) => {
      if (app.client && !acc.find(c => c.id === app.client.id)) {
        acc.push(app.client);
      }
      return acc;
    }, []) || [];

    return uniqueClients;
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