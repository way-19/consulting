import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Send, Inbox, Archive, Trash2, Star, Search, Filter } from 'lucide-react';

const ClientMailbox = () => {
  return (
    <>
      <Helmet>
        <title>Mailbox - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mailbox</h1>
            <p className="text-gray-600 mt-1">Secure communications with your consultant</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Send className="w-4 h-4 mr-2" />
            Compose
          </button>
        </div>

        {/* Mailbox Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-blue-600">0</p>
              </div>
              <Inbox className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <Mail className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Starred</p>
                <p className="text-2xl font-bold text-yellow-600">0</p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Archived</p>
                <p className="text-2xl font-bold text-gray-600">0</p>
              </div>
              <Archive className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Mailbox Interface */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Mailbox Header */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold text-gray-900">Inbox</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">0 new</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Empty State */}
          <div className="p-12 text-center">
            <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your mailbox is empty</h3>
            <p className="text-gray-600 mb-6">
              Messages from your consultant and system notifications will appear here.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Getting Started</h4>
              <p className="text-xs text-blue-800">
                Once you're assigned to a consultant, you'll be able to receive and send secure messages through this mailbox.
                All communications will be synchronized with your consultant's dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientMailbox;