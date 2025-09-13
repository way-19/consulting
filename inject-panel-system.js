// Framer sayfasına panel sistemi injection
(function() {
    'use strict';
    
    // Panel control bar oluştur
    function createPanelBar() {
        const panelBar = document.createElement('div');
        panelBar.id = 'consulting19-panel-bar';
        panelBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 99999;
            font-family: 'Inter', Arial, sans-serif;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        
        panelBar.innerHTML = `
            <div style="font-size: 1.5em; font-weight: 700;">
                🏢 CONSULTING19 PANEL CONTROL
            </div>
            <div style="display: flex; gap: 10px;">
                <button id="client-btn" onclick="switchToClientPanel()" style="
                    background: rgba(255,255,255,0.2);
                    border: 1px solid rgba(255,255,255,0.3);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.3s;
                ">🏠 Client Panel</button>
                
                <button id="consultant-btn" onclick="switchToConsultantPanel()" style="
                    background: rgba(255,255,255,0.2);
                    border: 1px solid rgba(255,255,255,0.3);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.3s;
                ">👨‍💼 Consultant Panel</button>
                
                <button onclick="hideFramerContent()" style="
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                ">🔧 Fix Display</button>
            </div>
        `;
        
        document.body.insertBefore(panelBar, document.body.firstChild);
        
        // Body'ye margin ekle
        document.body.style.marginTop = '70px';
    }
    
    // Panel iframe container oluştur
    function createPanelContainer() {
        const container = document.createElement('div');
        container.id = 'panel-container';
        container.style.cssText = `
            position: fixed;
            top: 70px;
            left: 0;
            width: 100%;
            height: calc(100vh - 70px);
            background: white;
            z-index: 99998;
            display: none;
        `;
        
        container.innerHTML = `
            <iframe id="panel-frame" src="" style="
                width: 100%;
                height: 100%;
                border: none;
                background: white;
            "></iframe>
        `;
        
        document.body.appendChild(container);
    }
    
    // Client panel göster
    window.switchToClientPanel = function() {
        const container = document.getElementById('panel-container');
        const frame = document.getElementById('panel-frame');
        
        container.style.display = 'block';
        frame.src = 'http://localhost:3000';
        
        // Aktif buton göstergesi
        document.getElementById('client-btn').style.background = 'rgba(255,255,255,0.9)';
        document.getElementById('client-btn').style.color = '#667eea';
        document.getElementById('consultant-btn').style.background = 'rgba(255,255,255,0.2)';
        document.getElementById('consultant-btn').style.color = 'white';
    };
    
    // Consultant panel göster
    window.switchToConsultantPanel = function() {
        const container = document.getElementById('panel-container');
        const frame = document.getElementById('panel-frame');
        
        container.style.display = 'block';
        frame.src = 'http://localhost:8001';
        
        // Aktif buton göstergesi
        document.getElementById('consultant-btn').style.background = 'rgba(255,255,255,0.9)';
        document.getElementById('consultant-btn').style.color = '#667eea';
        document.getElementById('client-btn').style.background = 'rgba(255,255,255,0.2)';
        document.getElementById('client-btn').style.color = 'white';
    };
    
    // Framer içeriğini gizle
    window.hideFramerContent = function() {
        const framerElements = document.querySelectorAll('[data-framer-name], [class*="framer"]');
        framerElements.forEach(el => {
            if (el.id !== 'consulting19-panel-bar' && el.id !== 'panel-container') {
                el.style.display = 'none';
            }
        });
        
        // Body background'unu değiştir
        document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    };
    
    // Sayfa yüklendiğinde sistemi başlat
    function initPanelSystem() {
        createPanelBar();
        createPanelContainer();
        
        console.log('✅ Consulting19 Panel System Loaded');
        console.log('🏠 Client Panel: Click Client Panel button');
        console.log('👨‍💼 Consultant Panel: Click Consultant Panel button');
    }
    
    // DOM hazır olduğunda başlat
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPanelSystem);
    } else {
        initPanelSystem();
    }
    
})();