@@ .. @@
        INSERT INTO public.user_profiles (
            id, email, full_name, role, country_id, 
            is_active, preferred_language, timezone, company
        ) VALUES (
            consultant_user_id,
            'giorgi.meskhi@consulting19.com',
            'Giorgi Meskhi',
            'consultant',
            georgia_country_id,
            TRUE,
            'en',
-            'Asia/Tbilisi'
+            'Asia/Tbilisi',
+            'Meskhi & Associates'
        ) ON CONFLICT (id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            role = EXCLUDED.role,
            country_id = EXCLUDED.country_id,
            is_active = EXCLUDED.is_active,
            preferred_language = EXCLUDED.preferred_language,
            timezone = EXCLUDED.timezone,
            company = EXCLUDED.company;

@@ .. @@
        INSERT INTO public.user_profiles (
            id, email, full_name, role, country_id, 
            is_active, preferred_language, timezone, company
        ) VALUES (
            client_user_id,
            'client@consulting19.com',
            'Test Client',
            'client',
            georgia_country_id,
            TRUE,
            'en',
-            'Asia/Tbilisi'
+            'Asia/Tbilisi',
+            'Client Company Ltd'
        ) ON CONFLICT (id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            role = EXCLUDED.role,
            country_id = EXCLUDED.country_id,
            is_active = EXCLUDED.is_active,
            preferred_language = EXCLUDED.preferred_language,
            timezone = EXCLUDED.timezone,
            company = EXCLUDED.company;