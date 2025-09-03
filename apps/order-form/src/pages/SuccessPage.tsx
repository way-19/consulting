import React from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, ArrowRight, MessageSquare, Calendar } from 'lucide-react';

const SuccessPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Helmet>
        <title>Order Submitted Successfully - Consulting19</title>
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Submitted Successfully!
          </h1>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you for choosing Consulting19. Your company formation request has been received 
            and our expert consultant will contact you within 24 hours to discuss your project.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-3">What happens next?</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <span className="text-blue-800 text-sm">Expert consultant reviews your requirements</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <span className="text-blue-800 text-sm">You'll receive a detailed quote and timeline</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <span className="text-blue-800 text-sm">Upon approval, we begin your company formation</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = 'http://localhost:5173'}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Back to Home</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.location.href = 'http://localhost:5177/login'}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Access Dashboard</span>
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Order ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;