import React from 'react';
import { FileText, Upload, Download, Eye } from 'lucide-react';
import { Card, Button } from '../../../packages/ui/src';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Documents = () => {
  const documents = [
    {
      id: '1',
      name: 'Passport Copy.pdf',
      type: 'Identity Document',
      size: '2.4 MB',
      uploaded: '2025-01-15',
      project: 'UAE Company Formation'
    },
    {
      id: '2',
      name: 'Bank Statement.pdf',
      type: 'Financial Document',
      size: '1.8 MB',
      uploaded: '2025-01-16',
      project: 'UAE Company Formation'
    },
    {
      id: '3',
      name: 'Business Plan.docx',
      type: 'Business Document',
      size: '3.2 MB',
      uploaded: '2025-01-18',
      project: 'UAE Company Formation'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Documents</h1>
                <p className="text-gray-600">Manage your project documents and uploads</p>
              </div>
              <Button icon={Upload} iconPosition="left">
                Upload Document
              </Button>
            </div>
          </div>

          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Your Documents</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div>
                        <h3 className="font-medium text-gray-900">{doc.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>{doc.type}</span>
                          <span>•</span>
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>Uploaded {doc.uploaded}</span>
                        </div>
                        <p className="text-xs text-blue-600">{doc.project}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" icon={Eye}>
                        View
                      </Button>
                      <Button variant="ghost" size="sm" icon={Download}>
                        Download
                      </Button>
                    </div>
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

export default Documents;