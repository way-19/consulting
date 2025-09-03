export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  display_name?: string;
  role: 'admin' | 'consultant' | 'client';
  country_id?: string;
  phone?: string;
  company?: string;
  avatar_url?: string;
  preferred_language?: string; // Add this line
  timezone?: string; // Add this line
  is_active: boolean;
  metadata?: Record<string, any>; // Add this line
  created_at: string;
  updated_at: string;
}
