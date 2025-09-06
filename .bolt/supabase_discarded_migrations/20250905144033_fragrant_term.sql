-- 🔍 DATABASE INSPECTION QUERIES
-- Her tabloyu kontrol etmek için bu SQL komutlarını kullan

-- 1. User Management Tables
SELECT 'USER PROFILES:' as table_name;
SELECT id, email, full_name, role, is_active, created_at FROM user_profiles ORDER BY created_at DESC LIMIT 10;

SELECT 'CLIENTS:' as table_name;
SELECT id, profile_id, assigned_consultant_id, company_name, status, created_at FROM clients ORDER BY created_at DESC LIMIT 10;

SELECT 'COUNTRIES:' as table_name;
SELECT id, name, code, flag_emoji, is_active FROM countries WHERE is_active = true ORDER BY name LIMIT 10;

-- 2. Business Logic Tables
SELECT 'PROJECTS:' as table_name;
SELECT id, client_id, consultant_id, title, status, progress, created_at FROM projects ORDER BY created_at DESC LIMIT 10;

SELECT 'TASKS:' as table_name;
SELECT id, client_id, title, status, priority, is_client_visible, created_at FROM tasks ORDER BY created_at DESC LIMIT 10;

SELECT 'CUSTOM SERVICES:' as table_name;
SELECT id, consultant_id, title_i18n->>'en' as title, price, currency, is_active FROM custom_services WHERE is_active = true LIMIT 10;

SELECT 'SERVICE ORDERS:' as table_name;
SELECT id, client_id, title, total_amount, currency, status, created_at FROM service_orders ORDER BY created_at DESC LIMIT 10;

-- 3. Communication Tables
SELECT 'MESSAGES:' as table_name;
SELECT id, sender_id, receiver_id, content, is_read, created_at FROM messages ORDER BY created_at DESC LIMIT 10;

SELECT 'NOTIFICATIONS:' as table_name;
SELECT id, recipient_profile_id, type, read_at, created_at FROM notifications ORDER BY created_at DESC LIMIT 10;

SELECT 'MEETINGS:' as table_name;
SELECT id, client_id, consultant_id, title, start_time, status FROM meetings ORDER BY start_time DESC LIMIT 10;

-- 4. Document & File Management
SELECT 'DOCUMENTS:' as table_name;
SELECT id, client_id, name, type, status, file_size, uploaded_at FROM documents ORDER BY uploaded_at DESC LIMIT 10;

SELECT 'FILE MANAGER:' as table_name;
SELECT id, client_id, name, type, folder_path, file_size, created_at FROM file_manager ORDER BY created_at DESC LIMIT 10;

SELECT 'MAIL FORWARDING:' as table_name;
SELECT id, client_id, forwarding_address, status, payment_amount, created_at FROM mail_forwarding_requests ORDER BY created_at DESC LIMIT 10;

-- 5. Financial Tables
SELECT 'INVOICES:' as table_name;
SELECT id, client_id, amount_due, currency, status, paid_at FROM invoices ORDER BY created_at DESC LIMIT 10;

-- 6. System Tables
SELECT 'SUPPORT TICKETS:' as table_name;
SELECT id, client_id, subject, ticket_type, status, priority, created_at FROM support_tickets ORDER BY created_at DESC LIMIT 10;

SELECT 'AUDIT LOGS:' as table_name;
SELECT id, user_id, action_type, description, created_at FROM audit_logs ORDER BY created_at DESC LIMIT 10;

SELECT 'BLOG POSTS:' as table_name;
SELECT id, title_i18n->>'en' as title, is_published, view_count, created_at FROM blog_posts ORDER BY created_at DESC LIMIT 10;

-- 7. Quick Stats
SELECT 
  'DATABASE STATISTICS:' as info,
  (SELECT COUNT(*) FROM user_profiles) as total_users,
  (SELECT COUNT(*) FROM clients) as total_clients,  
  (SELECT COUNT(*) FROM projects) as total_projects,
  (SELECT COUNT(*) FROM tasks) as total_tasks,
  (SELECT COUNT(*) FROM messages) as total_messages,
  (SELECT COUNT(*) FROM documents) as total_documents;

-- 8. Client-Consultant Relationships
SELECT 'CLIENT-CONSULTANT ASSIGNMENTS:' as table_name;
SELECT 
  c.id,
  up.full_name as client_name,
  up.email as client_email,
  c.company_name,
  c.status,
  cons.full_name as consultant_name
FROM clients c
JOIN user_profiles up ON c.profile_id = up.id
LEFT JOIN user_profiles cons ON c.assigned_consultant_id = cons.id
ORDER BY c.created_at DESC;