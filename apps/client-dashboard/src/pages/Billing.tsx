import React from 'react';
import { CreditCard, Download, Calendar } from 'lucide-react';
import { Card, Button } from '../../../packages/ui/src';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Billing = () => {
  const invoices = [
    {
      id: 'INV-001',
      service: 'UAE Company Formation',
      amount: '$2,500',
      status: 'paid',
      date: '2025-01-15',
      consultant: 'Ahmed Al-Rashid'
    },
    {
      id: 'INV-002',
      service: 'Banking Assistance',
      amount: '$800',
      status: 'pending',
      date: '2025-01-20',
      consultant: 'Ahmed Al-Rashid'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Payments</h1>
            <p className="text-gray-600">View your invoices and payment history</p>
          </div>

          {/* Payment Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <Card.Body className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">$2,500</div>
                <div className="text-sm text-gray-600">Total Paid</div>
              </Card.Body>
            </Card>
            
            <Card>
              <Card.Body className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">$800</div>
                <div className="text-sm text-gray-600">Pending</div>
              </Card.Body>
            </Card>
            
            <Card>
              <Card.Body className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">$3,300</div>
                <div className="text-sm text-gray-600">Total</div>
              </Card.Body>
            </Card>
          </div>

          {/* Invoices */}
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Recent Invoices</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <CreditCard className="w-8 h-8 text-blue-600" />
                      <div>
                        <h3 className="font-medium text-gray-900">{invoice.service}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>Invoice {invoice.id}</span>
                          <span>•</span>
                          <span>{invoice.consultant}</span>
                          <span>•</span>
                          <span>{invoice.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{invoice.amount}</div>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {invoice.status}
                        </span>
                      </div>
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

export default Billing;