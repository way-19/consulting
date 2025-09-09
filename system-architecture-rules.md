# Consulting19 System Architecture Rules
## Comprehensive Document & Notification Management

### 📋 **DOCUMENT FLOW ARCHITECTURE**

#### **1. CLIENT SIDE - Document Types:**
```
📁 Documents (/documents)
  └── Company Documents (from consultant)
      ├── Formation certificates
      ├── Legal documents  
      ├── Tax registrations
      ├── Banking documents
      └── Official correspondence

💰 Accounting (/accounting)  
  └── Monthly Submissions (to consultant)
      ├── Invoices/Receipts
      ├── Bank statements
      ├── Expense reports
      └── Financial documents

🗂️ File Manager (/file-manager)
  └── Personal Storage (paid feature)
      ├── Contracts
      ├── Internal documents
      ├── Drafts
      └── Archives

📮 Mailbox (/mailbox)
  └── Physical Mail Forwarding
      ├── Scanned mail from virtual address
      ├── Forwarding requests ($15/item)
      └── Delivery tracking
```

#### **2. CONSULTANT SIDE - Document Management:**
```
📄 Documents (/documents)
  ├── Review Client Uploads (existing)
  ├── Send Documents to Clients (NEW - company formation docs)
  └── Document Requests Management (NEW)

💰 Financial (/financial) - NEW MODULE
  ├── Commission Tracking
  ├── Revenue Analytics  
  ├── Service Performance
  └── Payment History

📊 Client Accounting Review (NEW TAB in Documents)
  ├── Monthly submissions from clients
  ├── Financial document approval
  ├── Accounting workflow
  └── Tax preparation support
```

### 🔔 **NOTIFICATION SYSTEM RULES**

#### **Consultant Notifications:**
```typescript
// High Priority (Red badge)
- 'payment_received': New payment from client
- 'mail_forwarding_paid': Physical mail forwarding payment
- 'urgent_task_assigned': Urgent client request

// Medium Priority (Orange badge)  
- 'document_uploaded': Client uploaded document
- 'accounting_document_uploaded': Monthly accounting docs
- 'service_ordered': Client ordered service
- 'message_received': New client message

// Low Priority (Blue badge)
- 'task_completed': Client completed task
- 'meeting_scheduled': Client scheduled meeting
- 'profile_updated': Client updated profile
```

#### **Client Notifications:**
```typescript
- 'task_assigned': New task from consultant
- 'document_requested': Consultant requested document  
- 'document_sent': Consultant sent company document
- 'invoice_created': New invoice generated
- 'payment_confirmed': Payment processed successfully
- 'meeting_confirmed': Meeting confirmed by consultant
```

### 💼 **CONSULTANT PANEL SCALABILITY (1000+ CLIENTS)**

#### **Advanced Client Management:**
```typescript
// Pagination & Performance
- Virtual scrolling for client lists
- Server-side pagination (50 clients per page)
- Advanced search with debouncing
- Bulk actions for multiple clients

// Smart Filtering & Prioritization  
- Priority clients (high-value/urgent)
- Activity-based sorting (last interaction)
- Status-based views (active/pending/overdue)
- Country/service-based segmentation

// Dashboard KPIs
- Revenue per client
- Task completion rates
- Response time metrics
- Client satisfaction scores
```

#### **Intelligent Workflows:**
```typescript
// Automated Prioritization
- Overdue payments → Top priority
- Urgent document requests → High priority  
- New client assignments → Medium priority
- Routine updates → Low priority

// Bulk Operations
- Mass document requests
- Bulk task assignments
- Group communications
- Batch status updates
```

### 🎯 **IMPLEMENTATION PRIORITY ORDER**

**Phase 1: Core Fixes (Immediate)**
1. ✅ Add NotificationBell to consultant panel
2. ✅ Add ConsultantFinancialDashboard  
3. ✅ Fix mail forwarding notifications
4. ✅ Remove ClientDocuments.tsx duplicate
5. ✅ Clarify document routing

**Phase 2: System Consistency (Week 1)**
6. Enhanced ConsultantDocuments (send to client)
7. Service order management for consultants
8. Advanced client filtering/pagination  
9. Commission tracking integration

**Phase 3: Scalability (Week 2)**
10. Bulk client operations
11. Intelligent prioritization  
12. Performance optimizations
13. Advanced reporting

### 🔒 **BUSINESS RULES**

#### **Document Retention:**
- Company documents: Permanent storage
- Accounting documents: 6 months auto-delete
- File manager: Based on storage tier
- Mailbox: 12 months auto-delete

#### **Commission Structure:**
- Consultant: 65% (configurable)
- System: 35%
- Cross-referral bonus: 5%
- Payment processing: Stripe fees

#### **Access Controls:**
- File Manager: Active clients only
- Mailbox: All clients
- Accounting: Active consulting service required  
- Documents: Based on consultant assignment

This architecture ensures:
✅ **Zero confusion** for 1000+ clients
✅ **Clear document flows** 
✅ **Scalable performance**
✅ **Consistent UX** across both panels
✅ **Professional SaaS standards**