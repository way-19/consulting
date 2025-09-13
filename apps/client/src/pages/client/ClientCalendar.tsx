import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  Calendar, 
  Plus, 
  Clock, 
  Video, 
  Phone, 
  MapPin,
  User,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  CreditCard
} from 'lucide-react';
import { supabase } from '@consulting19/shared/src/lib/supabase';

interface Meeting {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  meeting_type: 'video' | 'phone' | 'in_person';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  meeting_url?: string;
  location?: string;
  price_paid: number;
  currency: string;
  consultant: {
    full_name: string;
  };
}

const ClientCalendar = () => {
  const { user, profile } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [meetingDuration, setMeetingDuration] = useState<30 | 60 | 120>(60);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingMeeting, setBookingMeeting] = useState(false);

  const meetingPrices = {
    30: 150,   // 30 minutes = $150
    60: 250,   // 60 minutes = $250
    120: 400   // 120 minutes = $400
  };

  useEffect(() => {
    if (user && profile) {
      fetchMeetings();
    }
  }, [user, profile]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      
      // Get client ID
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (clientError || !clientData) {
        console.error('Client fetch error:', clientError);
        return;
      }

      // Fetch meetings
      const { data: meetingsData, error: meetingsError } = await supabase
        .from('meetings')
        .select(`
          *,
          consultant:user_profiles!meetings_consultant_id_fkey(full_name)
        `)
        .eq('client_id', clientData.id)
        .order('start_time', { ascending: true });

      if (meetingsError) {
        console.error('Error fetching meetings:', meetingsError);
        return;
      }

      setMeetings(meetingsData || []);
    } catch (err) {
      console.error('Error fetching meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookMeeting = async () => {
    try {
      setBookingMeeting(true);
      
      // Get client data
      const { data: clientData } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .single();

      if (!clientData || !clientData.assigned_consultant_id) {
        alert('No consultant assigned. Please wait for consultant assignment.');
        return;
      }

      const startTime = new Date(selectedTimeSlot);
      const endTime = new Date(startTime.getTime() + meetingDuration * 60 * 1000);
      const price = meetingPrices[meetingDuration];

      // Create meeting
      const { data: meetingData, error: meetingError } = await supabase
        .from('meetings')
        .insert({
          client_id: clientData.id,
          consultant_id: clientData.assigned_consultant_id,
          title: `${meetingDuration} Minute Consultation`,
          description: 'Business consultation meeting',
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          meeting_type: 'video',
          status: 'scheduled',
          price_paid: 0,
          currency: 'USD'
        })
        .select()
        .single();

      if (meetingError) {
        throw meetingError;
      }

      // Create Stripe checkout for meeting payment
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
        'create-stripe-checkout',
        {
          body: {
            meeting_id: meetingData.id,
            amount: price * 100, // Convert to cents
            currency: 'usd',
            title: `${meetingDuration} Minute Consultation`,
            description: `Business consultation with your expert consultant`,
            success_url: `${window.location.origin}/meetings?payment=success&meeting_id=${meetingData.id}`,
            cancel_url: `${window.location.origin}/meetings?payment=cancelled`
          }
        }
      );

      if (checkoutError) {
        throw checkoutError;
      }

      if (checkoutData?.url) {
        window.location.href = checkoutData.url;
      }

    } catch (err) {
      console.error('Booking error:', err);
      alert('Failed to book meeting. Please try again.');
    } finally {
      setBookingMeeting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMeetingIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'in_person': return <MapPin className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Calendar - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Calendar & Meetings - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendar & Meetings</h1>
            <p className="text-gray-600 mt-1">Schedule consultations with your expert consultant</p>
          </div>
          <button 
            onClick={() => setShowBookingModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule Meeting
          </button>
        </div>

        {/* Meeting Pricing */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Meeting Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-2">$150</div>
              <div className="text-sm text-green-800 font-medium">30 Minutes</div>
              <div className="text-xs text-green-700 mt-2">Quick consultation or follow-up</div>
            </div>

            <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-2">$250</div>
              <div className="text-sm text-blue-800 font-medium">60 Minutes</div>
              <div className="text-xs text-blue-700 mt-2">Standard business consultation</div>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-2">$400</div>
              <div className="text-sm text-purple-800 font-medium">120 Minutes</div>
              <div className="text-xs text-purple-700 mt-2">Extended strategy session</div>
            </div>
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Meetings</h2>
          </div>
          
          <div className="p-6">
            {meetings.length > 0 ? (
              <div className="space-y-4">
                {meetings.map((meeting) => (
                  <div key={meeting.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          {getMeetingIcon(meeting.meeting_type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                          <p className="text-sm text-gray-600">{meeting.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{new Date(meeting.start_time).toLocaleDateString()}</span>
                            <span>{new Date(meeting.start_time).toLocaleTimeString()}</span>
                            <span>with {meeting.consultant.full_name}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(meeting.status)}`}>
                          {meeting.status}
                        </span>
                        {meeting.price_paid > 0 && (
                          <span className="text-sm text-green-600 font-medium">
                            ${meeting.price_paid} paid
                          </span>
                        )}
                        {meeting.meeting_url && meeting.status === 'confirmed' && (
                          <button 
                            onClick={() => window.open(meeting.meeting_url, '_blank')}
                            className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            <Video className="w-4 h-4 mr-1" />
                            Join Meeting
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Meetings Scheduled</h3>
                <p className="text-gray-600 mb-6">
                  Schedule your first consultation with your expert consultant
                </p>
                <button 
                  onClick={() => setShowBookingModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule First Meeting
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Schedule Meeting</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Duration
                  </label>
                  <select
                    value={meetingDuration}
                    onChange={(e) => setMeetingDuration(Number(e.target.value) as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={30}>30 Minutes ($150)</option>
                    <option value={60}>60 Minutes ($250)</option>
                    <option value={120}>120 Minutes ($400)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">Meeting Details</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Duration: {meetingDuration} minutes</li>
                    <li>• Price: ${meetingPrices[meetingDuration]}</li>
                    <li>• Type: Video consultation</li>
                    <li>• Payment required before confirmation</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookMeeting}
                  disabled={bookingMeeting || !selectedTimeSlot}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {bookingMeeting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Booking...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2 inline" />
                      Book & Pay ${meetingPrices[meetingDuration]}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientCalendar;