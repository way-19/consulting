@@ .. @@
 ALTER TABLE mail_forwarding_requests ENABLE ROW LEVEL SECURITY;
 
-CREATE TRIGGER update_mail_forwarding_requests_updated_at
-  BEFORE UPDATE ON mail_forwarding_requests
-  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM information_schema.triggers
+    WHERE trigger_name = 'update_mail_forwarding_requests_updated_at'
+    AND event_object_table = 'mail_forwarding_requests'
+  ) THEN
+    CREATE TRIGGER update_mail_forwarding_requests_updated_at
+      BEFORE UPDATE ON mail_forwarding_requests
+      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
+  END IF;
+END $$;
 
 -- RLS Policies