@@ .. @@
 /*
   # Georgia Test System - Complete Setup
   
   1. Test Data Creation
     - Georgia country and consultant
     - 3 test clients with applications
     - Messages, documents, and payment schedules
   
   2. Consultant-Client Assignments
     - Proper foreign key relationships
     - Real test scenarios
   
   3. Complete System Test
     - All modules and workflows
 */

-@@ .. @@
 -- 1. Ensure Georgia country exists
 INSERT INTO countries (id, name, slug, flag_emoji, description, primary_language, status) 
 VALUES (1, 'Georgia', 'georgia', '🇬🇪', 'Strategic location between Europe and Asia with favorable tax system', 'en', true)
 ON CONFLICT (id) DO UPDATE SET