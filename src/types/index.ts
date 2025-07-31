// Core Types for CONSULTING19 Platform
export interface Country {
  id: number;
  name: string;
  slug: string;
  flag_emoji: string;
  description: string;
  advantages: string[];
  primary_language: string;
  supported_languages: string[];
  auto_language_detection: boolean;
  legacy_form_integration: boolean;
  consultant_auto_assignment: boolean;
  status: boolean;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'consultant' | 'client' | 'legal_reviewer';
  first_name?: string;
  last_name?: string;
  country_id?: number;
  language: string;
  auto_language_detection: boolean;
  country_language_preferences: Record<string, any>;
  consultant_specialties: string[];
  commission_rate: number;
  legacy_customer_access: boolean;
  custom_service_creation_enabled: boolean;
  performance_rating: number;
  total_clients_served: number;
  status: boolean;
  created_at: string;
}

export interface LegacyOrderIntegration {
  id: string;
  legacy_payment_id: number;
  consulting19_application_id?: string;
  source_country_slug?: string;
  assigned_consultant_id?: string;
  assignment_date?: string;
  commission_calculated: boolean;
  platform_commission?: number;
  consultant_commission?: number;
  integration_status: 'pending' | 'assigned' | 'completed';
  customer_data: Record<string, any>;
  created_at: string;
}

export interface ConsultantCustomService {
  id: string;
  consultant_id: string;
  service_name: string;
  service_description?: string;
  service_category: string;
  price: number;
  currency: string;
  requires_approval: boolean;
  approved_by?: string;
  approval_date?: string;
  active: boolean;
  legacy_customer_eligible: boolean;
  recurring_service: boolean;
  recurring_interval?: string;
  created_at: string;
}

export interface ServicePaymentRequest {
  id: string;
  consultant_id: string;
  client_id?: string;
  service_id?: string;
  legacy_client_reference?: number;
  amount: number;
  currency: string;
  description?: string;
  invoice_number?: string;
  due_date?: string;
  status: 'pending' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  stripe_payment_intent_id?: string;
  commission_status: 'pending' | 'calculated' | 'paid';
  platform_commission?: number;
  consultant_commission?: number;
  payment_date?: string;
  created_at: string;
}

export interface AIInteraction {
  id: string;
  session_id?: string;
  user_id?: string;
  consultant_id?: string;
  ai_query: string;
  ai_response?: string;
  interaction_language: string;
  translated_response?: Record<string, any>;
  confidence_score?: number;
  risk_level?: 'low' | 'medium' | 'high' | 'critical';
  human_review_required: boolean;
  human_reviewed: boolean;
  legal_review_required: boolean;
  legal_reviewed: boolean;
  legal_reviewer_id?: string;
  consultant_approval?: boolean;
  consultant_notes?: string;
  legal_notes?: string;
  client_satisfaction?: number;
  emergency_stopped: boolean;
  legacy_customer_context?: Record<string, any>;
  created_at: string;
}

export interface Application {
  id: string;
  client_id: string;
  consultant_id?: string;
  service_type: string;
  status: 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled';
  total_amount: number;
  currency: string;
  client_preferred_language: string;
  application_data?: Record<string, any>;
  source_type: 'platform' | 'legacy' | 'referral';
  ai_success_prediction?: number;
  legacy_payment_reference?: number;
  source_country_page?: string;
  created_at: string;
}

export interface GlobalStats {
  activeConsultations: number;
  countriesServed: number;
  successRate: number;
  yearsExperience: number;
}

export interface LanguageDetection {
  suggestedLanguage: string;
  confidence: number;
  alternativeLanguages: string[];
  autoSwitch: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author_id: string;
  category: string;
  tags: string[];
  featured_image?: string;
  published: boolean;
  featured: boolean;
  published_at?: string;
  read_time: number;
  views?: number;
  created_at: string;
  updated_at?: string;
  author?: {
    first_name: string;
    last_name: string;
    country_id?: number;
    countries?: {
      name: string;
      flag_emoji: string;
    };
  };
}

export interface ClientDocument {
  id: string;
  client_id: string;
  application_id?: string;
  legacy_payment_id?: number;
  document_name: string;
  document_type: string;
  file_url: string;
  file_size?: number;
  mime_type?: string;
  upload_source: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'expired';
  consultant_notes?: string;
  expiration_date?: string;
  is_required: boolean;
  created_at: string;
}

export interface ClientNotification {
  id: string;
  client_id: string;
  consultant_id?: string;
  notification_type: string;
  title: string;
  message: string;
  action_url?: string;
  is_read: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  created_at: string;
}

export interface ServiceReview {
  id: string;
  client_id: string;
  consultant_id: string;
  application_id?: string;
  service_payment_request_id?: string;
  rating: number;
  review_text?: string;
  service_category?: string;
  would_recommend: boolean;
  is_featured: boolean;
  consultant_response?: string;
  created_at: string;
  client?: {
    first_name: string;
    last_name: string;
  };
  consultant?: {
    first_name: string;
    last_name: string;
  };
}