#!/usr/bin/env python3
import http.server
import socketserver
import os
from urllib.parse import urlparse

class ProxyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Handle assets requests by proxying to correct location
        if self.path.startswith('/assets/'):
            # Check which panel is requesting assets
            if 'client' in str(self.headers.get('Referer', '')):
                # Proxy to client assets
                self.path = '/apps/client/dist' + self.path
            elif 'consultant' in str(self.headers.get('Referer', '')):
                # Proxy to consultant assets  
                self.path = '/apps/consultant/dist' + self.path
            else:
                # Default to client assets
                self.path = '/apps/client/dist' + self.path
        
        # Handle manifest.json
        elif self.path == '/manifest.json':
            if 'client' in str(self.headers.get('Referer', '')):
                self.path = '/apps/client/dist/manifest.json'
            else:
                self.path = '/apps/consultant/dist/manifest.json'
        
        # Default handler
        super().do_GET()

if __name__ == "__main__":
    os.chdir('/app')
    with socketserver.TCPServer(('0.0.0.0', 3000), ProxyHandler) as httpd:
        print("Serving with asset proxy on port 3000...")
        httpd.serve_forever()