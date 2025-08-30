@@ .. @@
   content_en,
   content_tr,
   content_pt,
-  is_active
+  created_at,
+  updated_at
 ) VALUES (
   'about_page',
   'About Consulting19 - AI-Powered Global Business Consulting',
@@ .. @@
   }',
   '{}',
   '{}',
-  true
+  now(),
+  now()
 ) ON CONFLICT (page_key) DO NOTHING;