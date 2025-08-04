@@ .. @@
 /*
   # Georgia Test System Setup
 
   1. Test Users
     - Georgia consultant: Nino Kvaratskhelia
     - 3 Georgia clients: Ahmet, Maria, David
   2. Applications with consultant assignments
   3. Test messages, documents, and payments
   4. Complete consultant-client relationship setup
 */
 
-@@ .. @@
-
 -- Insert Georgia country if not exists
 INSERT INTO countries (id, name, slug, flag_emoji, description, primary_language, status) 
 VALUES (1, 'Georgia', 'georgia', '🇬🇪', 'Strategic location between Europe and Asia with favorable tax system', 'en', true)
 ON CONFLICT (id) DO NOTHING;