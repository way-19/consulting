import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { 
  Sparkles, 
  ArrowRight, 
  Star, 
  MapPin,
  TrendingUp,
  Users,
  Award
} from 'lucide-react';

interface ServiceRecommendationsProps {
  client: any;
  existingApplications: any[];
  legacyOrders: any[];
}

const ServiceRecommendations: React.FC<ServiceRecommendationsProps> = ({
  client,
  existingApplications,
  legacyOrders
}) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        // Get consultant services that might be relevant
        const { data: services } = await supabase
          .from('consultant_custom_services')
          .select(`
            *,
            consultant:users!consultant_custom_services_consultant_id_fkey(
              first_name,
              last_name,
              country_id,
              performance_rating,
              countries!users_country_id_fkey(name, flag_emoji)
            )
          `)
          .eq('active', true)
          .eq('legacy_customer_eligible', true)
          .limit(6);

        setRecommendations(services || []);
      } catch (error) {
        console.error('Error loading recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [client]);

  if (loading) {
    return (
      <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg flex items-center justify-center mr-3">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          Recommended Services
        </h2>
        <Link
          to="/client/services"
          className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center"
        >
          View All Services
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-8">
          <Sparkles className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations available</h3>
          <p className="text-gray-500">Check back later for personalized service recommendations.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.slice(0, 6).map((service) => (
            <div
              key={service.id}
              className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-primary-300 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Service header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{service.consultant?.countries?.flag_emoji || '🌍'}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {service.service_name}
                    </h3>
                    <p className="text-sm text-gray-500">{service.service_category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">${service.price}</div>
                  <div className="text-xs text-gray-500">{service.currency}</div>
                </div>
              </div>

              {/* Service description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {service.service_description || 'Professional consulting service'}
              </p>

              {/* Consultant info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-3 w-3 mr-1" />
                  <span>{service.consultant?.first_name} {service.consultant?.last_name}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Star className="h-3 w-3 mr-1 text-yellow-500" />
                  <span>{service.consultant?.performance_rating || '5.0'}</span>
                </div>
              </div>

              {/* Action button */}
              <Link
                to={`/client/services?service=${service.id}`}
                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-300 flex items-center justify-center group-hover:shadow-lg"
              >
                Learn More
                <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* CTA for more services */}
      <div className="mt-8 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-6 border border-primary-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-primary-900 mb-1">
              Need something specific?
            </h3>
            <p className="text-primary-700">
              Browse our full catalog of services or contact a consultant for custom solutions.
            </p>
          </div>
          <Link
            to="/client/services"
            className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl flex items-center"
          >
            <Search className="mr-2 h-4 w-4" />
            Browse All
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceRecommendations;