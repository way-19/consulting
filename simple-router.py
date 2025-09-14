#!/usr/bin/env python3
"""
Simple HTTP Router for Consulting19
Routes different paths to different content
"""
import http.server
import socketserver
import urllib.parse
import os
import sys

class RouterHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        print(f"Request path: {path}")
        
        # Route different paths
        if path == "/" or path == "":
            # Panel selector
            self.serve_file("/app/panel-selector/index.html")
        elif path.startswith("/client"):
            # Client panel content
            self.serve_file("/app/client-app/index.html")
        elif path.startswith("/consultant"):
            # Consultant panel content  
            self.serve_file("/app/consultant-app/index.html")
        elif path.startswith("/assets/"):
            # Static assets - try both client and consultant directories
            asset_path = path[1:]  # Remove leading /
            client_asset = f"/app/client-app/{asset_path}"
            consultant_asset = f"/app/consultant-app/{asset_path}"
            
            if os.path.exists(client_asset):
                self.serve_file(client_asset)
            elif os.path.exists(consultant_asset):
                self.serve_file(consultant_asset)
            else:
                self.send_error(404)
        else:
            # Default to panel selector
            self.serve_file("/app/panel-selector/index.html")
    
    def serve_file(self, file_path):
        try:
            with open(file_path, 'rb') as f:
                content = f.read()
            
            # Determine content type
            if file_path.endswith('.html'):
                content_type = 'text/html'
            elif file_path.endswith('.css'):
                content_type = 'text/css'
            elif file_path.endswith('.js'):
                content_type = 'text/javascript'
            else:
                content_type = 'application/octet-stream'
            
            self.send_response(200)
            self.send_header('Content-type', content_type)
            self.send_header('Content-length', len(content))
            self.end_headers()
            self.wfile.write(content)
            
        except FileNotFoundError:
            self.send_error(404)
        except Exception as e:
            print(f"Error serving {file_path}: {e}")
            self.send_error(500)

if __name__ == "__main__":
    PORT = 3000
    with socketserver.TCPServer(("0.0.0.0", PORT), RouterHandler) as httpd:
        print(f"Router server running on port {PORT}")
        httpd.serve_forever()