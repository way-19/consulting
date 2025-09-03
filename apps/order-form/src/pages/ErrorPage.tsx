import React from 'react';
import { Helmet } from 'react-helmet-async';
import { AlertTriangle, ArrowLeft, RefreshCw, MessageSquare } from 'lucide-react';

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Helmet>
        <title>Order Submission Error - Consulting19</title>
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Something Went Wrong
          </h1>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            We encountered an error while processing your order. Please try again or contact our support team for assistance.
          </p>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-orange-900 mb-3">What you can do:</h3>
            <div className="space-y-2 text-left">
              <div className="flex items-center space-x-3">
                <RefreshCw className="w-4 h-4 text-orange-600" />
                <span className="text-orange-800 text-sm">Try submitting the form again</span>
              </div>
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-4 h-4 text-orange-600" />
                <span className="text-orange-800 text-sm">Contact our support team for help</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Back to Form</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.location.href = 'mailto:support@consulting19.com'}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Contact Support</span>
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;