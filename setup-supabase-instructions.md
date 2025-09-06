# 🗄️ **Supabase Database Setup - Consulting19**

## 🔧 **Adım 1: Supabase Bağlantısı**

**ÖNEMLİ:** Önce sağ üst köşedeki **"Connect to Supabase"** butonuna tıklayın!

Bu buton:
- Yeni Supabase projesi oluşturur
- Environment variables'ları otomatik ayarlar  
- Database URL'leri configure eder
- API key'leri güvenli şekilde saklar

## 🏗️ **Adım 2: Database Schema**

Supabase bağlantısı kurulduktan sonra, aşağıdaki migration dosyaları otomatik olarak çalıştırılacak:

### **📋 Kurulacak Tablolar:**

1. **👤 User Management**
   - `user_profiles` - Kullanıcı profilleri  
   - `clients` - Client kayıtları
   - `countries` - Desteklenen ülkeler

2. **💼 Business Logic**
   - `projects` - Client projeleri
   - `tasks` - Görev yönetimi
   - `documents` - Belge sistemi
   - `file_manager` - Dosya yönetimi

3. **💬 Communication**
   - `messages` - Real-time mesajlaşma
   - `notifications` - Bildirim sistemi
   - `meetings` - Takvim entegrasyonu

4. **💰 Financial**
   - `service_orders` - Hizmet siparişleri
   - `invoices` - Fatura sistemi
   - `mail_forwarding_requests` - Posta iletme

5. **⚙️ System Tables**
   - `custom_services` - Danışman hizmetleri
   - `packages` - Hizmet paketleri
   - `audit_logs` - Sistem logları

### **🔐 Security (RLS)**
- Her tablo için Row Level Security
- Role-based access policies
- Admin/Consultant/Client permissions

### **📈 Advanced Features**
- Multi-language content (i18n JSON)
- Real-time subscriptions
- Edge function integrations
- Automated triggers

## 🎯 **Sonraki Adımlar**

1. ✅ **"Connect to Supabase"** butonuna tıklayın
2. ⏳ Migration dosyaları otomatik çalışacak
3. 🎊 Client panel tamamen functional olacak!

---

**Ready to connect? Click the button!** 🚀