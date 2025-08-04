--- a/src/components/consultant/ConsultantDashboardLayout.tsx
+++ b/src/components/consultant/ConsultantDashboardLayout.tsx
@@ -1,6 +1,7 @@
 import React from 'react';
 import { Link, useNavigate } from 'react-router-dom';
 import { 
+  Menu,
   Users, 
   LogOut, 
   Settings, 
@@ -10,6 +11,7 @@
   FileText,
   DollarSign,
   Globe
+
 } from 'lucide-react';
 
 interface ConsultantDashboardLayoutProps {
@@ -59,8 +61,11 @@
       </header>
 
       {/* Main Content */}
-      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
-        {children}
+      <div className="flex">
+        {/* Sidebar will be rendered by the parent ConsultantDashboard */}
+        <div className="flex-1 ml-64 p-8"> {/* Adjust ml-64 to match sidebar width */}
+          {children}
+        </div>
       </div>
     </div>
   );