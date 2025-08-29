import React from 'react';
import { CheckCircle, AlertCircle, Clock, Activity } from 'lucide-react';
import { useLanguage } from '@consulting19/shared';
import { Card } from '@consulting19/ui';

const StatusPage = () => {
  const { t } = useLanguage();

  const services = [
    {
      name: t('statusAPITitle'),
      status: 'operational',
      uptime: '99.9%',
      responseTime: '120ms',
    },
    {
      name: t('statusWebsiteTitle'),
      status: 'operational',
      uptime: '99.8%',
      responseTime: '450ms',
    },
    {
      name: t('statusDatabaseTitle'),
      status: 'operational',
      uptime: '99.9%',
      responseTime: '25ms',
    },
    {
      name: t('statusPaymentsTitle'),
      status: 'operational',
      uptime: '99.7%',
      responseTime: '200ms',
    },
  ];

  const incidents = [
    {
      date: '2025-01-20',
      title: t('statusIncident1Title'),
      description: t('statusIncident1Desc'),
      status: 'resolved',
      duration: '15 minutes',
    },
    {
      date: '2025-01-15',
      title: t('statusIncident2Title'),
      description: t('statusIncident2Desc'),
      status: 'resolved',
      duration: '5 minutes',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'degraded': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'down': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-100';
      case 'degraded': return 'text-yellow-600 bg-yellow-100';
      case 'down': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('statusHeroTitle')}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {t('statusHeroDescription')}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Overall Status */}
        <Card className="mb-12">
          <Card.Body>
            <div className="flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">{t('statusAllSystemsOperational')}</h2>
            </div>
            <p className="text-center text-gray-600">
              {t('statusLastUpdated')}: {new Date().toLocaleString()}
            </p>
          </Card.Body>
        </Card>

        {/* Service Status */}
        <Card className="mb-12">
          <Card.Header>
            <h3 className="text-xl font-semibold text-gray-900">{t('statusServicesTitle')}</h3>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              {services.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <h4 className="font-medium text-gray-900">{service.name}</h4>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                        {t(`status${service.status.charAt(0).toUpperCase() + service.status.slice(1)}`)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-gray-500">
                    <div>{t('statusUptime')}: {service.uptime}</div>
                    <div>{t('statusResponseTime')}: {service.responseTime}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Recent Incidents */}
        <Card>
          <Card.Header>
            <h3 className="text-xl font-semibold text-gray-900">{t('statusIncidentsTitle')}</h3>
          </Card.Header>
          <Card.Body>
            {incidents.length > 0 ? (
              <div className="space-y-4">
                {incidents.map((incident, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{incident.title}</h4>
                      <span className="text-xs text-gray-500">{incident.date}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{incident.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span className="text-green-600 font-medium">{t('statusResolved')}</span>
                      <span>{t('statusDuration')}: {incident.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">{t('statusNoIncidents')}</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default StatusPage;