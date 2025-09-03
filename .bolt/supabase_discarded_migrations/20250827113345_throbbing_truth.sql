@@ .. @@
 -- Update Georgia country to assign consultant
 UPDATE countries 
 SET consultant_id = '226c80f3-e1c3-416b-8289-e2929942b2e1',
-    featured = true,
-    updated_at = now()
+    featured = true
 WHERE code = 'GE';