import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database helper functions
export const db = {
  // Countries
  getCountries: async () => {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .eq('status', true)
      .order('name');
    
    if (error) throw error;
    return data;
  },

  getCountryBySlug: async (slug: string) => {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .eq('slug', slug)
      .eq('status', true)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Legacy Order Integration
  createLegacyIntegration: async (integrationData: any) => {
    const { data, error } = await supabase
      .from('legacy_order_integrations')
      .insert(integrationData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  getLegacyIntegrations: async (consultantId?: string) => {
    let query = supabase
      .from('legacy_order_integrations')
      .select('*');
    
    if (consultantId) {
      query = query.eq('assigned_consultant_id', consultantId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Consultant Custom Services
  createCustomService: async (serviceData: any) => {
    const { data, error } = await supabase
      .from('consultant_custom_services')
      .insert(serviceData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  getConsultantServices: async (consultantId: string) => {
    const { data, error } = await supabase
      .from('consultant_custom_services')
      .select('*')
      .eq('consultant_id', consultantId)
      .eq('active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Service Payment Requests
  createPaymentRequest: async (requestData: any) => {
    const { data, error } = await supabase
      .from('service_payment_requests')
      .insert(requestData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  getPaymentRequests: async (consultantId: string) => {
    const { data, error } = await supabase
      .from('service_payment_requests')
      .select('*')
      .eq('consultant_id', consultantId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // AI Interactions
  createAIInteraction: async (interactionData: any) => {
    const { data, error } = await supabase
      .from('ai_interactions')
      .insert(interactionData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  getAIInteractions: async (userId?: string, consultantId?: string) => {
    let query = supabase
      .from('ai_interactions')
      .select('*');
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    if (consultantId) {
      query = query.eq('consultant_id', consultantId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Applications
  createApplication: async (applicationData: any) => {
    const { data, error } = await supabase
      .from('applications')
      .insert(applicationData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  getApplications: async (clientId?: string, consultantId?: string) => {
    let query = supabase
      .from('applications')
      .select('*');
    
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    
    if (consultantId) {
      query = query.eq('consultant_id', consultantId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Commission Tracking
  createCommissionEntry: async (commissionData: any) => {
    const { data, error } = await supabase
      .from('consultant_commission_ledger')
      .insert(commissionData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  getConsultantCommissions: async (consultantId: string) => {
    const { data, error } = await supabase
      .from('consultant_commission_ledger')
      .select('*')
      .eq('consultant_id', consultantId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Blog Posts
  getBlogPosts: async (limit?: number, featured?: boolean) => {
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        author:users!blog_posts_author_id_fkey(
          first_name,
          last_name,
          country_id,
          countries!users_country_id_fkey(name, flag_emoji)
        )
      `)
      .eq('published', true)
      .order('published_at', { ascending: false });
    
    if (featured !== undefined) {
      query = query.eq('featured', featured);
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  getBlogPostBySlug: async (slug: string) => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author:users!blog_posts_author_id_fkey(
          first_name,
          last_name,
          country_id,
          countries!users_country_id_fkey(name, flag_emoji)
        )
      `)
      .eq('slug', slug)
      .eq('published', true)
      .single();
    
    if (error) throw error;
    return data;
  },

  createBlogPost: async (postData: any) => {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(postData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update blog post views
  incrementBlogViews: async (slug: string) => {
    const { error } = await supabase
      .rpc('increment_blog_views', { post_slug: slug });
    
    if (error) throw error;
  },

  // Consultant Dashboard Functions
  getConsultantProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .eq('role', 'consultant')
      .single();
    
    if (error) throw error;
    return data;
  },

  getLegacyOrders: async (consultantId: string) => {
    const { data, error } = await supabase
      .from('legacy_order_integrations')
      .select('*')
      .eq('consultant_id', consultantId)
      .order('assignment_date', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  getConsultantServices: async (consultantId: string) => {
    const { data, error } = await supabase
      .from('consultant_custom_services')
      .select('*')
      .eq('consultant_id', consultantId)
      .eq('active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  getPaymentRequests: async (consultantId: string) => {
    const { data, error } = await supabase
      .from('service_payment_requests')
      .select(`
        *,
        consultant_custom_services(service_name, service_category)
      `)
      .eq('consultant_id', consultantId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  getCommissions: async (consultantId: string, fromDate?: string) => {
    let query = supabase
      .from('consultant_commission_ledger')
      .select('*')
      .eq('consultant_id', consultantId);
    
    if (fromDate) {
      query = query.gte('created_at', fromDate);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  createCustomService: async (serviceData: any) => {
    const { data, error } = await supabase
      .from('consultant_custom_services')
      .insert([serviceData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  createPaymentRequest: async (requestData: any) => {
    const { data, error } = await supabase
      .from('service_payment_requests')
      .insert([requestData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get blog posts by category
  getBlogPostsByCategory: async (category: string, limit?: number) => {
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        author:users!blog_posts_author_id_fkey(
          first_name,
          last_name,
          country_id,
          countries!users_country_id_fkey(name, flag_emoji)
        )
      `)
      .eq('published', true)
      .eq('category', category)
      .order('published_at', { ascending: false });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  // Get blog categories
  getBlogCategories: async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('category')
      .eq('published', true);
    
    if (error) throw error;
    
    const categories = [...new Set(data?.map(post => post.category))];
    return categories;
  },

  // Client Dashboard Functions
  getClientApplications: async (clientId: string) => {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        countries(name, flag_emoji),
        consultant:users!applications_consultant_id_fkey(first_name, last_name)
      `)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  getClientNotifications: async (clientId: string) => {
    const { data, error } = await supabase
      .from('client_notifications')
      .select('*')
      .eq('client_id', clientId)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) throw error;
    return data;
  },

  markNotificationAsRead: async (notificationId: string) => {
    const { error } = await supabase
      .from('client_notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    
    if (error) throw error;
  },

  getClientDocuments: async (clientId: string) => {
    const { data, error } = await supabase
      .from('client_documents')
      .select(`
        *,
        applications(service_type, countries(name))
      `)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  createClientDocument: async (documentData: any) => {
    const { data, error } = await supabase
      .from('client_documents')
      .insert(documentData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  getServiceReviews: async (clientId?: string, consultantId?: string) => {
    let query = supabase
      .from('service_reviews')
      .select(`
        *,
        client:users!service_reviews_client_id_fkey(first_name, last_name),
        consultant:users!service_reviews_consultant_id_fkey(first_name, last_name)
      `);
    
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    
    if (consultantId) {
      query = query.eq('consultant_id', consultantId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Admin Dashboard Functions
  getAdminOverview: async () => {
    const { data, error } = await supabase
      .from('admin_overview')
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  },

  getConsultantPerformanceAnalytics: async () => {
    const { data, error } = await supabase
      .from('consultant_performance_analytics')
      .select('*')
      .order('total_earnings', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  getRevenueAnalytics: async (limit?: number) => {
    let query = supabase
      .from('revenue_analytics')
      .select('*')
      .order('month', { ascending: false });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  getAISafetyAnalytics: async () => {
    const { data, error } = await supabase
      .from('ai_safety_analytics')
      .select('*')
      .order('date', { ascending: false })
      .limit(30);
    
    if (error) throw error;
    return data;
  },

  getActiveAlerts: async () => {
    const { data, error } = await supabase
      .from('ai_monitoring_alerts')
      .select('*')
      .is('acknowledged_at', null)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  acknowledgeAlert: async (alertId: string, adminId: string) => {
    const { error } = await supabase
      .from('ai_monitoring_alerts')
      .update({ 
        acknowledged_at: new Date().toISOString(),
        acknowledged_by: adminId
      })
      .eq('id', alertId);
    
    if (error) throw error;
  },

  createEmergencyStop: async (adminId: string, reason: string) => {
    const { data, error } = await supabase
      .from('ai_emergency_stops')
      .insert([{
        admin_id: adminId,
        reason: reason,
        system_status: 'stopped'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};