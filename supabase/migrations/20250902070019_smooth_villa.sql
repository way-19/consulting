@@ .. @@
   -- Insert admin user
   INSERT INTO auth.users (
     id,
-    'u1111111-1111-1111-1111-111111111111',
+    '11111111-1111-1111-1111-111111111111',
     instance_id,
     aud,
     role,
@@ .. @@
   -- Insert consultant user  
   INSERT INTO auth.users (
     id,
-    'u2222222-2222-2222-2222-222222222222',
+    '22222222-2222-2222-2222-222222222222',
     instance_id,
     aud,
     role,
@@ .. @@
   -- Insert client user
   INSERT INTO auth.users (
     id,
-    'u3333333-3333-3333-3333-333333333333',
+    '33333333-3333-3333-3333-333333333333',
     instance_id,
     aud,
     role,
@@ .. @@
   -- Create user profiles
   INSERT INTO public.user_profiles (id, email, full_name, role, country_id, is_active, preferred_language, timezone) VALUES
-  ('u1111111-1111-1111-1111-111111111111', 'admin@consulting19.com', 'Admin User', 'admin', georgia_country_id, TRUE, 'en', 'UTC'),
-  ('u2222222-2222-2222-2222-222222222222', 'giorgi.meskhi@consulting19.com', 'Giorgi Meskhi', 'consultant', georgia_country_id, TRUE, 'en', 'Asia/Tbilisi'),
-  ('u3333333-3333-3333-3333-333333333333', 'client@consulting19.com', 'Test Client', 'client', georgia_country_id, TRUE, 'en', 'UTC');
+  ('11111111-1111-1111-1111-111111111111', 'admin@consulting19.com', 'Admin User', 'admin', georgia_country_id, TRUE, 'en', 'UTC'),
+  ('22222222-2222-2222-2222-222222222222', 'giorgi.meskhi@consulting19.com', 'Giorgi Meskhi', 'consultant', georgia_country_id, TRUE, 'en', 'Asia/Tbilisi'),
+  ('33333333-3333-3333-3333-333333333333', 'client@consulting19.com', 'Test Client', 'client', georgia_country_id, TRUE, 'en', 'UTC');
 
   -- Create client record for the test client
   INSERT INTO public.clients (profile_id, assigned_consultant_id, status, priority) VALUES
-  ('u3333333-3333-3333-3333-333333333333', 'u2222222-2222-2222-2222-222222222222', 'active', 'medium');
+  ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'active', 'medium');
 
   -- Create consultant country assignment
   INSERT INTO public.consultant_country_assignments (consultant_id, country_id, is_active) VALUES
-  ('u2222222-2222-2222-2222-222222222222', georgia_country_id, TRUE);
+  ('22222222-2222-2222-2222-222222222222', georgia_country_id, TRUE);