#!/bin/bash

# Consulting19 Panel Switching Script
# Usage: ./switch_panel.sh [client|consultant|admin|marketing]

PANEL=$1

if [ -z "$PANEL" ]; then
    echo "Mevcut panel durumu:"
    sudo supervisorctl status | grep frontend
    echo ""
    echo "Kullanım: ./switch_panel.sh [client|consultant|admin|marketing]"
    exit 1
fi

case $PANEL in
    "client")
        echo "🏠 Client paneline geçiş yapılıyor..."
        sudo supervisorctl stop frontend
        # Update supervisor to point frontend to client app
        sudo sed -i 's|command=python3 -m http.server 3000 --directory.*|command=python3 -m http.server 3000 --directory /app/apps/client/public|' /etc/supervisor/conf.d/supervisord.conf
        sudo sed -i 's|directory=.*|directory=/app/apps/client/public|' /etc/supervisor/conf.d/supervisord.conf
        sudo supervisorctl reread && sudo supervisorctl update
        sudo supervisorctl start frontend
        echo "✅ Client panel aktif: https://consulting19-hub.preview.emergentagent.com"
        ;;
    "consultant")
        echo "👨‍💼 Consultant paneline geçiş yapılıyor..."
        sudo supervisorctl stop frontend
        # Update supervisor to point frontend to consultant app  
        sudo sed -i 's|command=python3 -m http.server 3000 --directory.*|command=python3 -m http.server 3000 --directory /app/apps/consultant/dist|' /etc/supervisor/conf.d/supervisord.conf
        sudo sed -i 's|directory=.*|directory=/app/apps/consultant/dist|' /etc/supervisor/conf.d/supervisord.conf
        sudo supervisorctl reread && sudo supervisorctl update
        sudo supervisorctl start frontend
        echo "✅ Consultant panel aktif: https://consulting19-hub.preview.emergentagent.com"
        ;;
    "admin")
        echo "🛡️ Admin paneline geçiş yapılıyor..."
        sudo supervisorctl stop frontend
        # Update supervisor to point frontend to admin app
        sudo sed -i 's|command=python3 -m http.server 3000 --directory.*|command=python3 -m http.server 3000 --directory /app/apps/admin/dist|' /etc/supervisor/conf.d/supervisord.conf
        sudo sed -i 's|directory=.*|directory=/app/apps/admin/dist|' /etc/supervisor/conf.d/supervisord.conf
        sudo supervisorctl reread && sudo supervisorctl update
        sudo supervisorctl start frontend
        echo "✅ Admin panel aktif: https://consulting19-hub.preview.emergentagent.com"
        ;;
    "marketing")
        echo "🌐 Marketing paneline geçiş yapılıyor..."
        sudo supervisorctl stop frontend
        # Update supervisor to point frontend to marketing app
        sudo sed -i 's|command=python3 -m http.server 3000 --directory.*|command=python3 -m http.server 3000 --directory /app/apps/marketing/dist|' /etc/supervisor/conf.d/supervisord.conf
        sudo sed -i 's|directory=.*|directory=/app/apps/marketing/dist|' /etc/supervisor/conf.d/supervisord.conf
        sudo supervisorctl reread && sudo supervisorctl update
        sudo supervisorctl start frontend
        echo "✅ Marketing panel aktif: https://consulting19-hub.preview.emergentagent.com"
        ;;
    *)
        echo "❌ Geçersiz panel adı. Kullanabilirsiniz: client, consultant, admin, marketing"
        exit 1
        ;;
esac

echo ""
echo "🔄 Panel değişimi tamamlandı!"
echo "📋 Diğer panellere geçmek için:"
echo "   ./switch_panel.sh client"
echo "   ./switch_panel.sh consultant" 
echo "   ./switch_panel.sh admin"
echo "   ./switch_panel.sh marketing"