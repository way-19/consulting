import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, FileText, Clock, CheckCircle } from 'lucide-react';
import { Card, Button } from '../../../packages/ui/src';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const ProjectDetails = () => {
  const { id } = useParams();

  // Mock project data
  const project = {
    id: '1',
    title: 'UAE Company Formation',
    consultant: 'Ahmed Al-Rashid',
    status: 'in_progress',
    progress: 75,
    country: 'UAE 🇦🇪',
    created_at: '2025-01-15',
    description: 'Complete business setup in Dubai International Financial Centre (DIFC) free zone.',
    timeline: [
      { step: 'Initial Consultation', status: 'completed', date: '2025-01-15' },
      { step: 'Document Collection', status: 'completed', date: '2025-01-18' },
      { step: 'Company Registration', status: 'completed', date: '2025-01-22' },
      { step: 'Bank Account Opening', status: 'in_progress', date: '2025-01-25' },
      { step: 'Final Documentation', status: 'pending', date: 'TBD' },
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6">
          {/* Back Button */}
          <div className="mb-6">
            <Link to="/">
              <Button variant="ghost" icon={ArrowLeft} iconPosition="left">
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Project Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {project.title}
                </h1>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Consultant: {project.consultant}</span>
                  <span>•</span>
                  <span>Started: {project.created_at}</span>
                  <span>•</span>
                  <span>{project.country}</span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button icon={MessageCircle} iconPosition="left">
                  Message Consultant
                </Button>
                <Button variant="outline" icon={FileText} iconPosition="left">
                  View Documents
                </Button>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <Card className="mb-8">
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Project Progress</h2>
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Overall Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-green-900">3</div>
                  <div className="text-sm text-green-700">Completed Steps</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-blue-900">1</div>
                  <div className="text-sm text-blue-700">In Progress</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-gray-900">1</div>
                  <div className="text-sm text-gray-700">Pending</div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Timeline */}
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Project Timeline</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-6">
                {project.timeline.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.status === 'completed' ? 'bg-green-100 text-green-600' :
                      item.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {item.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`font-medium ${
                        item.status === 'completed' ? 'text-gray-900' :
                        item.status === 'in_progress' ? 'text-blue-900' :
                        'text-gray-500'
                      }`}>
                        {item.step}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.status === 'completed' ? `Completed on ${item.date}` :
                         item.status === 'in_progress' ? `Started on ${item.date}` :
                         'Pending'}
                      </p>
                    </div>
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'completed' ? 'bg-green-100 text-green-800' :
                      item.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default ProjectDetails;