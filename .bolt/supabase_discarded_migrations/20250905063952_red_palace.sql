/*
  # Fix RLS policies for client dashboard access

  1. Security Updates
    - Add missing RLS policies for client data access
    - Enable proper client-to-data relationships
    - Allow clients to access their own data across all tables
  
  2. Tables Updated
    - All tables with client-related data
    - Proper conditions based on auth.uid() and client relationships
*/

-- Ensure RLS is enabled on all tables
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;  
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE mail_forwarding_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Drop existing conflicting policies if they exist
DO $$ 
BEGIN
  -- Notifications policies
  DROP POLICY IF EXISTS "Users can read own notifications" ON notifications;
  DROP POLICY IF EXISTS "Clients can read own notifications" ON notifications;
  
  -- Service orders policies  
  DROP POLICY IF EXISTS "Clients can read own orders" ON service_orders;
  DROP POLICY IF EXISTS "Clients can read own service orders" ON service_orders;
  
  -- Messages policies
  DROP POLICY IF EXISTS "Users can read own messages" ON messages;
  DROP POLICY IF EXISTS "Users can send messages" ON messages;
  DROP POLICY IF EXISTS "Clients can access own messages" ON messages;
  
  -- Audit logs policies
  DROP POLICY IF EXISTS "Users can read own audit logs" ON audit_logs;
  DROP POLICY IF EXISTS "Clients can read own audit logs" ON audit_logs;
  
  -- Tasks policies
  DROP POLICY IF EXISTS "Clients can read visible tasks" ON tasks;
  DROP POLICY IF EXISTS "Clients can read own tasks" ON tasks;
  
  -- Documents policies
  DROP POLICY IF EXISTS "Clients can manage own documents" ON documents;
  DROP POLICY IF EXISTS "Clients can read own documents" ON documents;
  
  -- Custom services policies
  DROP POLICY IF EXISTS "Anyone can read active custom services" ON custom_services;
  DROP POLICY IF EXISTS "Clients can read consultant services" ON custom_services;
  
  -- Projects policies
  DROP POLICY IF EXISTS "Clients can read own projects" ON projects;
  DROP POLICY IF EXISTS "Clients can read assigned projects" ON projects;
  
EXCEPTION
  WHEN OTHERS THEN
    NULL; -- Ignore errors if policies don't exist
END $$;

-- Create comprehensive policies for client access

-- 1. Notifications - clients can read their own notifications
CREATE POLICY "Clients can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (recipient_profile_id = auth.uid());

-- 2. Service orders - clients can read their own orders through clients table
CREATE POLICY "Clients can read own service orders"
  ON service_orders
  FOR SELECT
  TO authenticated
  USING (client_id IN (
    SELECT clients.id 
    FROM clients 
    WHERE clients.profile_id = auth.uid()
  ));

-- 3. Messages - users can read messages where they are sender or receiver
CREATE POLICY "Users can access own messages"
  ON messages
  FOR ALL
  TO authenticated
  USING ((sender_id = auth.uid()) OR (receiver_id = auth.uid()))
  WITH CHECK ((sender_id = auth.uid()) OR (receiver_id = auth.uid()));

-- 4. Audit logs - users can read their own audit logs
CREATE POLICY "Users can read own audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 5. Tasks - clients can read their visible tasks
CREATE POLICY "Clients can read own tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT clients.id 
      FROM clients 
      WHERE clients.profile_id = auth.uid()
    ) AND is_client_visible = true
  );

-- 6. Documents - clients can manage their own documents
CREATE POLICY "Clients can access own documents"
  ON documents
  FOR ALL
  TO authenticated
  USING (client_id IN (
    SELECT clients.id 
    FROM clients 
    WHERE clients.profile_id = auth.uid()
  ))
  WITH CHECK (client_id IN (
    SELECT clients.id 
    FROM clients 
    WHERE clients.profile_id = auth.uid()
  ));

-- 7. Mail forwarding requests - clients can manage their own requests
CREATE POLICY "Clients can access own mail forwarding"
  ON mail_forwarding_requests
  FOR ALL
  TO authenticated
  USING (client_id IN (
    SELECT clients.id 
    FROM clients 
    WHERE clients.profile_id = auth.uid()
  ))
  WITH CHECK (client_id IN (
    SELECT clients.id 
    FROM clients 
    WHERE clients.profile_id = auth.uid()
  ));

-- 8. Custom services - clients can read services from their consultant
CREATE POLICY "Clients can read consultant services"
  ON custom_services
  FOR SELECT
  TO authenticated
  USING (
    is_active = true AND
    consultant_id IN (
      SELECT clients.assigned_consultant_id 
      FROM clients 
      WHERE clients.profile_id = auth.uid()
      AND clients.assigned_consultant_id IS NOT NULL
    )
  );

-- 9. Projects - clients can read their own projects
CREATE POLICY "Clients can read own projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (client_id IN (
    SELECT clients.id 
    FROM clients 
    WHERE clients.profile_id = auth.uid()
  ));

-- 10. Support tickets - clients can manage their own tickets
CREATE POLICY "Clients can access own support tickets"
  ON support_tickets
  FOR ALL
  TO authenticated
  USING (client_id IN (
    SELECT clients.id 
    FROM clients 
    WHERE clients.profile_id = auth.uid()
  ))
  WITH CHECK (client_id IN (
    SELECT clients.id 
    FROM clients 
    WHERE clients.profile_id = auth.uid()
  ));

-- Add admin policies for all tables (admins can access everything)
DO $$
BEGIN
  -- Admin policies for all tables
  CREATE POLICY "Admins can manage everything" ON notifications FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
    
  CREATE POLICY "Admins can manage everything" ON service_orders FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
    
  CREATE POLICY "Admins can manage everything" ON messages FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
    
  CREATE POLICY "Admins can manage everything" ON audit_logs FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
    
  CREATE POLICY "Admins can manage everything" ON tasks FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
    
  CREATE POLICY "Admins can manage everything" ON documents FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
    
  CREATE POLICY "Admins can manage everything" ON mail_forwarding_requests FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
    
  CREATE POLICY "Admins can manage everything" ON custom_services FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
    
  CREATE POLICY "Admins can manage everything" ON projects FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
    
  CREATE POLICY "Admins can manage everything" ON support_tickets FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

EXCEPTION
  WHEN duplicate_object THEN
    NULL; -- Ignore if policies already exist
END $$;