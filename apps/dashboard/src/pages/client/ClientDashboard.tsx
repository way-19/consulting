import React from 'react';
import { FileText, MessageCircle, CreditCard, Clock, CheckCircle } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import ClientLayout from '../../components/layouts/ClientLayout';

const ClientDashboard = () => {
  const projects = [
    {
      id: '1',
      title: 'BAE Şirket Kuruluşu',
      consultant: 'Ahmed Al-Rashid',
      status: 'devam_ediyor',
      progress: 75,
      country: 'BAE 🇦🇪',
    },
    {
      id: '2',
      title: 'Estonya e-Residency',
      consultant: 'Maria Kask',
      status: 'tamamlandi',
      progress: 100,
      country: 'Estonya 🇪🇪',
    },
  ];

  return (
    <ClientLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hoş Geldiniz!</h1>
        <p className="text-gray-600">Uluslararası iş genişleme projelerinizi takip edin</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{projects.length}</div>
            <div className="text-sm text-gray-600">Aktif Proje</div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {projects.filter(p => p.status === 'tamamlandi').length}
            </div>
            <div className="text-sm text-gray-600">Tamamlanan</div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">24</div>
            <div className="text-sm text-gray-600">Belge</div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">18</div>
            <div className="text-sm text-gray-600">Mesaj</div>
          </Card.Body>
        </Card>
      </div>

      {/* Projects */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-900">Projeleriniz</h2>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{project.title}</h3>
                    <p className="text-sm text-gray-600">Danışman: {project.consultant}</p>
                    <p className="text-sm text-gray-500">{project.country}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'tamamlandi' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {project.status === 'tamamlandi' ? 'Tamamlandı' : 'Devam Ediyor'}
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>İlerleme</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" icon={MessageCircle}>
                    Mesaj Gönder
                  </Button>
                  <Button variant="outline" size="sm" icon={FileText}>
                    Belgeler
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    </ClientLayout>
  );
};

export default ClientDashboard;