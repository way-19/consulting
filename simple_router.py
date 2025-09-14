#!/usr/bin/env python3
"""
Simple production router for Consulting19 application
Routes requests to appropriate React applications based on URL path
"""

import os
import http.server
import socketserver
from urllib.parse import urlparse
import mimetypes

class ProductionRouter(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        print(f"📍 Request: {path}")
        
        # Root path - serve panel selector
        if path == '/' or path == '':
            self.serve_file('/app/production_index.html', 'text/html')
            return
            
        # Client app routes
        if path.startswith('/client'):
            if path == '/client' or path == '/client/':
                self.serve_file('/app/apps/client/dist/client-app/index.html', 'text/html')
                return
            elif path.startswith('/client/'):
                # Serve client app assets
                asset_path = path.replace('/client/', '')
                full_path = f'/app/apps/client/dist/client-app/{asset_path}'
                self.serve_asset(full_path)
                return
                
        # Consultant app routes  
        if path.startswith('/consultant'):
            if path == '/consultant' or path == '/consultant/':
                self.serve_file('/app/consultant-app/index.html', 'text/html')
                return
            elif path.startswith('/consultant/'):
                # Serve consultant app assets
                asset_path = path.replace('/consultant/', '')
                full_path = f'/app/consultant-app/{asset_path}'
                self.serve_asset(full_path)
                return
        
        # Default 404
        self.send_error(404, f"Path not found: {path}")
        
    def serve_file(self, file_path, content_type):
        """Serve a specific file with content type"""
        try:
            if os.path.exists(file_path):
                with open(file_path, 'rb') as f:
                    content = f.read()
                    
                self.send_response(200)
                self.send_header('Content-Type', content_type)
                self.send_header('Content-Length', str(len(content)))
                self.end_headers()
                self.wfile.write(content)
                print(f"✅ Served: {file_path}")
            else:
                self.send_error(404, f"File not found: {file_path}")
                print(f"❌ Not found: {file_path}")
        except Exception as e:
            self.send_error(500, f"Server error: {str(e)}")
            print(f"💥 Error serving {file_path}: {e}")
            
    def serve_asset(self, file_path):
        """Serve asset files with proper MIME type"""
        try:
            if os.path.exists(file_path):
                mime_type, _ = mimetypes.guess_type(file_path)
                if not mime_type:
                    if file_path.endswith('.js'):
                        mime_type = 'application/javascript'
                    elif file_path.endswith('.css'):
                        mime_type = 'text/css'
                    else:
                        mime_type = 'application/octet-stream'
                        
                with open(file_path, 'rb') as f:
                    content = f.read()
                    
                self.send_response(200)
                self.send_header('Content-Type', mime_type)
                self.send_header('Content-Length', str(len(content)))
                self.send_header('Cache-Control', 'public, max-age=3600')
                self.end_headers()
                self.wfile.write(content)
                print(f"✅ Asset served: {file_path} ({mime_type})")
            else:
                self.send_error(404, f"Asset not found: {file_path}")
                print(f"❌ Asset not found: {file_path}")
        except Exception as e:
            self.send_error(500, f"Asset error: {str(e)}")
            print(f"💥 Asset error {file_path}: {e}")

if __name__ == "__main__":
    PORT = 3000
    print(f"🚀 Starting Consulting19 Production Router on port {PORT}")
    print(f"📍 Routes:")
    print(f"   / -> Panel Selector")
    print(f"   /client/ -> Client React App")  
    print(f"   /consultant/ -> Consultant React App")
    
    with socketserver.TCPServer(("0.0.0.0", PORT), ProductionRouter) as httpd:
        print(f"✅ Server running at http://0.0.0.0:{PORT}")
        httpd.serve_forever()