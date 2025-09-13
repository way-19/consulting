import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function SimpleApp() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '40px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)'
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
          ✅ React Uygulaması Çalışıyor!
        </div>
        <p style={{ fontSize: '1.1em', opacity: 0.9 }}>
          Consulting19 Client Dashboard
        </p>
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '10px'
        }}>
          <p><strong>Zaman:</strong> {new Date().toLocaleString('tr-TR')}</p>
          <p><strong>Durum:</strong> Aktif ve Çalışır</p>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<SimpleApp />);