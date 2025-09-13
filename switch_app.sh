#!/bin/bash

# Consulting19 Uygulama Değiştirici Script
# Farklı uygulamaları port 3000'de çalıştırır

APP=$1

if [ -z "$APP" ]; then
    echo "Kullanım: ./switch_app.sh [client|consultant|admin|marketing]"
    exit 1
fi

# Mevcut frontend'i durdur
sudo supervisorctl stop frontend

case $APP in
    "client")
        echo "Client uygulaması port 3000'e geçiriliyor..."
        sudo sed -i 's|directory=/app/apps/.*|directory=/app/apps/client|' /etc/supervisor/conf.d/supervisord.conf
        ;;
    "consultant")
        echo "Consultant uygulaması port 3000'e geçiriliyor..."
        sudo sed -i 's|directory=/app/apps/.*|directory=/app/apps/consultant|' /etc/supervisor/conf.d/supervisord.conf
        sudo sed -i 's|command=npm run preview|command=npm run dev|' /etc/supervisor/conf.d/supervisord.conf
        ;;
    "admin")
        echo "Admin uygulaması port 3000'e geçiriliyor..."
        sudo sed -i 's|directory=/app/apps/.*|directory=/app/apps/admin|' /etc/supervisor/conf.d/supervisord.conf
        sudo sed -i 's|command=npm run preview|command=npm run dev|' /etc/supervisor/conf.d/supervisord.conf
        ;;
    "marketing")
        echo "Marketing uygulaması port 3000'e geçiriliyor..."
        sudo sed -i 's|directory=/app/apps/.*|directory=/app/apps/marketing|' /etc/supervisor/conf.d/supervisord.conf
        sudo sed -i 's|command=npm run preview|command=npm run dev|' /etc/supervisor/conf.d/supervisord.conf
        ;;
    *)
        echo "Geçersiz uygulama: $APP"
        echo "Geçerli seçenekler: client, consultant, admin, marketing"
        exit 1
        ;;
esac

# Supervisor'ı güncelle ve başlat
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start frontend

echo "$APP uygulaması şimdi https://database-trigger.preview.emergentagent.com adresinde çalışıyor"