@@ .. @@
 CREATE TABLE IF NOT EXISTS mail_forwarding_requests (
   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
   client_id uuid NOT NULL,
   consultant_id uuid,
+  document_id uuid,
   document_name text NOT NULL,
   forwarding_address text NOT NULL,
   payment_amount numeric(10,2) DEFAULT 15.00,