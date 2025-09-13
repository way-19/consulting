#!/usr/bin/env python3
import http.server
import socketserver
import os

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/' or self.path == '/index.html':
            # Serve panel selector for root
            with open('/app/panel-selector.html', 'rb') as f:
                content = f.read()
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(content)))
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
            self.end_headers()
            self.wfile.write(content)
        elif self.path.startswith('/client.html'):
            # Serve client panel wrapper
            with open('/app/client.html', 'rb') as f:
                content = f.read()
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(content)))
            self.end_headers()
            self.wfile.write(content)
        elif self.path.startswith('/consultant.html'):
            # Serve consultant panel wrapper
            with open('/app/consultant.html', 'rb') as f:
                content = f.read()
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(content)))
            self.end_headers()
            self.wfile.write(content)
        else:
            # Default handler for other files
            super().do_GET()

if __name__ == "__main__":
    os.chdir('/app')
    with socketserver.TCPServer(('0.0.0.0', 3005), CustomHandler) as httpd:
        print("Serving on port 3000...")
        httpd.serve_forever()