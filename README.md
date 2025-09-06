# Consulting19 - Consultant-Client Platform

## 🌟 **Project Overview**

Consulting19 is a synchronized consultant-client platform for international business expansion services. The system enables real-time communication, project management, and commission tracking between consultants and their clients.

## 🏗️ **Current Structure**

```
consulting19/
├── apps/
│   ├── client/        # Client dashboard (Port 5176)
│   ├── consultant/    # Consultant dashboard (Port 5175)
│   └── admin/         # Admin panel (Port 5174)
├── packages/shared/   # Shared components & auth
├── supabase/         # Database & Edge Functions
└── netlify.toml      # Deployment configuration
```

## 🚀 **Development Commands**

```bash
# Start client dashboard (Port 5176)
npm run dev:client

# Start consultant dashboard (Port 5175)  
npm run dev:consultant

# Start admin panel (Port 5174)
npm run dev:admin

# Build client for production
npm run build:client
```

## 🔗 **System Synchronization**

### **Consultant ↔ Client Sync**
- Real-time messaging
- Project updates
- Document sharing
- Payment notifications
- Task assignments

### **Admin ↔ Consultant Sync**
- Sales notifications
- Commission management
- Performance tracking
- Message oversight

## 🔐 **Test Accounts**

```
Admin:      admin@consulting19.com / Admin123!
Consultant: giorgi.meskhi@consulting19.com / Consultant123!
Client:     client@consulting19.com / Client123!
```

## 🎯 **Key Features**

### **Client Dashboard:**
- Project tracking
- Task management
- Document upload
- Real-time messaging
- Payment processing
- File manager
- Calendar booking

### **Consultant Dashboard:**
- Client management
- Service creation
- Invoice generation
- Availability management
- Document review
- Commission tracking

### **Admin Panel:**
- Sales monitoring
- Commission rate management
- Platform oversight
- Consultant performance

## 🛠️ **Tech Stack**

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Lucide React
- **Database**: Supabase (PostgreSQL + RLS)
- **Real-time**: Supabase Realtime
- **Payments**: Stripe integration
- **Deployment**: Netlify

## 📊 **Database Schema**

- `user_profiles` - User management
- `clients` - Client records
- `service_orders` - Business transactions
- `messages` - Real-time communication
- `projects` - Project management
- `tasks` - Task tracking
- `documents` - File management
- `notifications` - System notifications

---

**Status**: Optimized for consultant-client synchronization
**Ready for**: Production deployment