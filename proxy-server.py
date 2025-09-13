#!/usr/bin/env python3
import http.server
import socketserver
import os
from urllib.parse import urlparse

class ProxyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        original_path = self.path
        
        # Handle assets requests by proxying to correct location
        if self.path.startswith('/assets/'):
            # Try client first, then consultant
            client_path = '/apps/client/dist' + self.path
            consultant_path = '/apps/consultant/dist' + self.path
            
            if os.path.exists('/app' + client_path):
                self.path = client_path
            elif os.path.exists('/app' + consultant_path):
                self.path = consultant_path
            else:
                # Keep original path
                pass
        
        # Handle manifest.json
        elif self.path == '/manifest.json':
            if os.path.exists('/app/apps/client/dist/manifest.json'):
                self.path = '/apps/client/dist/manifest.json'
            elif os.path.exists('/app/apps/consultant/dist/manifest.json'):
                self.path = '/apps/consultant/dist/manifest.json'
        
        print(f"Request: {original_path} -> {self.path}")
        
        # Default handler
        super().do_GET()

if __name__ == "__main__":
    os.chdir('/app')
    with socketserver.TCPServer(('0.0.0.0', 3000), ProxyHandler) as httpd:
        print("Serving with asset proxy on port 3000...")
        httpd.serve_forever()