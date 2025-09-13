import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function PanelApp() {
  const [currentPanel, setCurrentPanel] = useState('client');
  const [isLoading, setIsLoading] = useState(false);

  // URL parametrelerini kontrol et
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const panelParam = urlParams.get('panel');
    if (panelParam && panelParam !== currentPanel) {
      setCurrentPanel(panelParam);
    }
  }, []);

  const switchPanel = (panel: string) => {
    if (panel === currentPanel) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setCurrentPanel(panel);
      setIsLoading(false);
      
      // URL'yi güncelle
      const newUrl = panel === 'client' ? 
        window.location.pathname : 
        `${window.location.pathname}?panel=${panel}`;
      window.history.replaceState({}, '', newUrl);
    }, 1000);
  };

  const LoadingScreen = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontSize: '1.2em',
      zIndex: 1000
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid rgba(255,255,255,0.3)',
          borderTop: '4px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        {currentPanel === 'client' ? 'Consultant' : 'Client'} Panel yükleniyor...
      </div>
    </div>
  );

  const ClientPanel = () => (
    <div style={{
      textAlign: 'center',
      padding: '40px',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '20px',
      backdropFilter: 'blur(10px)',
      maxWidth: '800px'
    }}>
      <h1 style={{ fontSize: '2.5em', marginBottom: '20px' }}>
        🏠 CLIENT PANEL
      </h1>
      <div style={{
        background: '#4CAF50',
        padding: '15px 30px',
        borderRadius: '10px',
        margin: '20px 0',
        fontSize: '1.2em'
      }}>
        ✅ Client Dashboard Aktif!
      </div>
      <p style={{ fontSize: '1.1em', opacity: 0.9 }}>
        Consulting19 Client Dashboard - Müşteri Yönetim Paneli
      </p>
      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '10px'
      }}>
        <h3>Client Panel Özellikleri:</h3>
        <ul style={{ textAlign: 'left', margin: '20px 0' }}>
          <li>📋 Proje yönetimi</li>
          <li>📊 İlerleme takibi</li>
          <li>💬 Mesajlaşma</li>
          <li>📄 Belge paylaşımı</li>
          <li>💰 Fatura görüntüleme</li>
        </ul>
        <p><strong>Zaman:</strong> {new Date().toLocaleString('tr-TR')}</p>
        <p><strong>Rol:</strong> Müşteri</p>
      </div>
    </div>
  );

  const ConsultantPanel = () => (
    <div style={{
      textAlign: 'center',
      padding: '40px',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '20px',
      backdropFilter: 'blur(10px)',
      maxWidth: '800px'
    }}>
      <h1 style={{ fontSize: '2.5em', marginBottom: '20px' }}>
        👨‍💼 CONSULTANT PANEL
      </h1>
      <div style={{
        background: '#FF9800',
        padding: '15px 30px',
        borderRadius: '10px',
        margin: '20px 0',
        fontSize: '1.2em'
      }}>
        ✅ Consultant Dashboard Aktif!
      </div>
      <p style={{ fontSize: '1.1em', opacity: 0.9 }}>
        Consulting19 Consultant Dashboard - Danışman Yönetim Paneli
      </p>
      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '10px'
      }}>
        <h3>Consultant Panel Özellikleri:</h3>
        <ul style={{ textAlign: 'left', margin: '20px 0' }}>
          <li>👥 Müşteri yönetimi</li>
          <li>📈 Finansal raporlar</li>
          <li>⏰ Zaman takibi</li>
          <li>📋 Proje analizi</li>
          <li>💼 İş akışı yönetimi</li>
        </ul>
        <p><strong>Zaman:</strong> {new Date().toLocaleString('tr-TR')}</p>
        <p><strong>Rol:</strong> Danışman</p>
      </div>
    </div>
  );

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'Inter, sans-serif',
      position: 'relative'
    }}>
      {/* Panel Control Bar */}
      <div style={{
        background: 'rgba(0,0,0,0.2)',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backdropFilter: 'blur(10px)',
        flexWrap: 'wrap'
      }}>
        <div style={{ fontSize: '1.5em', fontWeight: '700' }}>
          🏢 CONSULTING19
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => switchPanel('client')}
            disabled={isLoading}
            style={{
              background: currentPanel === 'client' ? 
                'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
              color: currentPanel === 'client' ? '#667eea' : 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              transition: 'all 0.3s'
            }}
          >
            🏠 Client Panel
          </button>
          <button
            onClick={() => switchPanel('consultant')}
            disabled={isLoading}
            style={{
              background: currentPanel === 'consultant' ? 
                'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
              color: currentPanel === 'consultant' ? '#667eea' : 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              transition: 'all 0.3s'
            }}
          >
            👨‍💼 Consultant Panel
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 80px)',
        padding: '20px'
      }}>
        {currentPanel === 'client' ? <ClientPanel /> : <ConsultantPanel />}
      </div>

      {/* Loading Screen */}
      {isLoading && <LoadingScreen />}

      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<PanelApp />);