@@ .. @@
   END;
   $$ LANGUAGE plpgsql;
   
   -- Function to check overdue documents
-  CREATE OR REPLACE FUNCTION check_overoverdue_documents()
+  CREATE OR REPLACE FUNCTION check_overdue_documents()
   RETURNS TABLE(
     id uuid,
     client_id uuid,