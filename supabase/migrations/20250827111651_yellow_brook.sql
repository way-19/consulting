/*
  # Add missing foreign key relationships

  1. Foreign Key Relationships
    - Add foreign key from projects.client_id to user_profiles.id
    - Add foreign key from projects.consultant_id to user_profiles.id
    - These relationships are needed for Supabase joins to work

  2. Notes
    - These foreign keys enable proper JOIN operations in Supabase queries
    - Required for the consultant dashboard to fetch client information
*/

-- Add foreign key constraints for projects table
ALTER TABLE projects 
ADD CONSTRAINT projects_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES user_profiles(id) ON DELETE RESTRICT;

ALTER TABLE projects 
ADD CONSTRAINT projects_consultant_id_fkey 
FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE RESTRICT;