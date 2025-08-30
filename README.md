# Consulting19 Monorepo

## 🏗️ **Monorepo Yapısı**

```
consulting19-monorepo/
├── apps/
│   ├── marketing/     # Ana pazarlama sitesi (consulting19.com)
│   └── dashboard/     # Birleşik dashboard (admin/consultant/client)
├── packages/
│   ├── shared/        # Auth, Language contexts
│   ├── ui/           # Button, Card components
│   └── supabase-client/
└── supabase/         # Database & Edge Functions
```

## 🔌 **Port Konfigürasyonu**

### **Marketing App** (`apps/marketing/`)
- **Port**: `5173` (Vite default)
- **URL**: `http://localhost:5173`
- **Komut**: `npm run dev:marketing`
- **Amaç**: Consulting19.com ana sitesi

### **Dashboard App** (`apps/dashboard/`)
Her rol için ayrı port konfigürasyonu:

#### **Client Dashboard**
- **Port**: `5174`
- **URL**: `http://localhost:5174/client`
- **Komut**: `npm run dev:client`
- **Amaç**: Müşteri paneli

#### **Consultant Dashboard**
- **Port**: `5175`
- **URL**: `http://localhost:5175/consultant`
- **Komut**: `npm run dev:consultant`
- **Amaç**: Danışman paneli

#### **Admin Dashboard**
- **Port**: `5176`
- **URL**: `http://localhost:5176/admin`
- **Komut**: `npm run dev:admin`
- **Amaç**: Admin paneli

## 🚀 **Geliştirme Komutları**

```bash
# Ana pazarlama sitesi (Port 5173)
npm run dev:marketing

# Müşteri paneli (Port 5174)
npm run dev:client

# Danışman paneli (Port 5175)
npm run dev:consultant

# Admin paneli (Port 5176)
npm run dev:admin

# Varsayılan (marketing sitesi)
npm run dev
```

## 🔐 **Test Hesapları**

```
Admin:     admin@consulting19.com / Admin123!
Danışman:  giorgi.meskhi@consulting19.com / Consultant123!
Müşteri:   client@consulting19.com / Client123!
```

## 🌍 **i18n Desteği**

- **Diller**: EN (İngilizce), TR (Türkçe), PT (Portekizce)
- **Kütüphane**: react-i18next
- **Çeviri Dosyaları**: `apps/dashboard/src/i18n/locales/`
- **Otomatik Çeviri**: DeepL Edge Function entegrasyonu

## 🗄️ **Database Schema**

### **Ana Tablolar**
- `user_profiles` - Kullanıcı profilleri (admin/consultant/client)
- `clients` - Müşteri kayıtları
- `projects` - Projeler (i18n JSONB desteği)
- `tasks` - Görevler (i18n JSONB desteği)
- `documents` - Belgeler ve istekler
- `service_orders` - Hizmet siparişleri
- `custom_services` - Danışman özel hizmetleri
- `notifications` - Sistem bildirimleri
- `client_onboarding_progress` - Müşteri onboarding takibi

### **RLS Güvenlik**
- **Client**: Sadece kendi verilerine erişim
- **Consultant**: Atanmış müşterilerinin verilerine erişim
- **Admin**: Sistem yönetimi erişimi

## 🔔 **Realtime & Notifications**

- **Supabase Realtime** entegrasyonu
- **NotificationBell** komponenti
- **Edge Function**: `/notify` (email desteği)
- **ICS Calendar**: `/ics/:consultant_id`

## 📁 **Storage**

- **Bucket**: `client-docs` (private)
- **Yapı**: `client_id/filename`
- **Güvenlik**: Signed URLs only
- **Dosya Limitleri**: 10MB, PDF/DOC/DOCX/JPG/PNG

## 🎨 **UI Components**

- **@consulting19/ui**: Button, Card
- **@consulting19/shared**: Auth, Language contexts
- **Lucide React**: İkonlar
- **Tailwind CSS**: Styling