@@ .. @@
 /*
   # Overdue Alerts System
 
   1. Functions
     - `check_overdue_payments()` - Checks for overdue invoices and creates alerts
     - `check_overdue_documents()` - Checks for overdue expected documents and creates alerts
     - `trigger_overdue_alerts_now()` - Manual trigger for testing
   2. Scheduled Jobs
     - Daily cron job at 09:00 to check for overdue items
   3. Security
     - Functions use SECURITY DEFINER for system-level access
     - Proper error handling and logging
 */

+-- Drop existing functions if they exist
+DROP FUNCTION IF EXISTS check_overdue_payments();
+DROP FUNCTION IF EXISTS check_overdue_documents();
+DROP FUNCTION IF EXISTS trigger_overdue_alerts_now();
+DROP FUNCTION IF EXISTS create_test_overdue_data();
+
 -- Function to check overdue payments and create alerts
 CREATE OR REPLACE FUNCTION check_overdue_payments()
 RETURNS TABLE(
   alerts_created INTEGER,
   invoices_checked INTEGER
 )
 LANGUAGE plpgsql
 SECURITY DEFINER
 AS $$