import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { 
  Eye, 
  Mail, 
  Phone,
  FileText,
  DollarSign,
  MapPin,
  Building,
  Calendar
} from 'lucide-react';

interface LegacyOrderManagerProps {
  consultantId: string;
}

const LegacyOrderManager: React.FC<LegacyOrderManagerProps> = ({ consultantId }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('legacy_order_integrations')
          .select('*')
          .eq('consultant_id', consultantId)
          .order('assignment_date', { ascending: false })
          .limit(5); // Show only recent orders

        if (!error && data) {
          setOrders(data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [consultantId]);

  const handleContactClient = async (order: any) => {
    console.log('Contacting client:', order.customer_email);
    // Navigate to communication hub or create message
  };

  const handleViewDetails = (order: any) => {
    console.log('Viewing order details:', order.id);
    // Show order details modal
  };

  const handleOfferServices = (order: any) => {
    console.log('Offering additional services to:', order.customer_name);
    // Navigate to service offering flow
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
        <div className="animate-pulse p-8">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
      <div className="px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
              <FileText className="h-4 w-4 text-white" />
            </div>
            Assigned Legacy Orders
          </h2>
          <span className="text-sm text-gray-500">
            {orders.length} active orders
          </span>
        </div>
        <p className="mt-2 text-gray-600">
          Company formation orders from the legacy system assigned to you
        </p>
      </div>

      {/* Orders list */}
      <div className="divide-y divide-gray-200">
        {orders.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assigned orders yet</h3>
            <p className="text-gray-500">Legacy orders will appear here when assigned to you.</p>
          </div>
        ) : (
          orders.map((order, index) => (
            <div
              key={order.id}
              className="p-6 hover:bg-gray-50 transition-colors"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {order.customer_name}
                    </h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status?.replace('_', ' ') || 'Assigned'}
                    </span>
                  </div>
                   
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{order.customer_email}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                      <span>Order: ${order.order_amount}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{new Date(order.assignment_date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                      <div>
                        <span className="font-medium text-gray-700">Countries:</span>
                        <div className="text-gray-600">
                          {Array.isArray(order.selected_countries) 
                            ? order.selected_countries.join(', ') 
                            : order.selected_countries}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Building className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                      <div>
                        <span className="font-medium text-gray-700">Companies:</span>
                        <div className="text-gray-600">
                          {Array.isArray(order.company_names) 
                            ? order.company_names.join(', ') 
                            : order.company_names}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Commission info */}
                  <div className="mt-4 bg-green-50 rounded-lg p-3 border border-green-200">
                    <div className="flex items-center text-green-800">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span className="font-medium">Your Commission: ${order.consultant_commission}</span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col space-y-2 ml-6">
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </button>
                   
                  <button
                    onClick={() => handleContactClient(order)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Client
                  </button>
                   
                  <button
                    onClick={() => handleOfferServices(order)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg transition-all duration-300"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Offer Services
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {orders.length > 0 && (
        <div className="px-8 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="text-center">
            <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
              View All Legacy Orders →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LegacyOrderManager;