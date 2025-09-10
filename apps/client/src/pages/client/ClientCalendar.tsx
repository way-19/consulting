import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  Calendar, 
  Clock, 
  User, 
  DollarSign,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  X,
  CreditCard
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface ConsultantAvailability {
  day_of_week: string;
  start_time: string;
  end_time: string;
  timezone: string;
  price_per_hour: number;
  slot_duration_minutes: number;
}

interface TimeSlot {
  time: string;
  available: boolean;
  price: number;
  duration: number;
}

interface Meeting {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  status: string;
  price_paid: number;
  currency: string;
  meeting_url?: string;
  consultant: {
    full_name: string;
  };
}

const ClientCalendar = () => {
  const { user, profile } = useAuth();
  const [availability, setAvailability] = useState<ConsultantAvailability[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [consultant, setConsultant] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDescription, setMeetingDescription] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Meeting duration options with fixed pricing
  const durationOptions = [
    { duration: 30, price: 150, label: '30 Minutes - $150' },
    { duration: 60, price: 250, label: '60 Minutes - $250' },
    { duration: 120, price: 400, label: '120 Minutes - $400' }
  ];

  useEffect(() => {
    if (user && profile) {
      fetchCalendarData();
    }
  }, [user, profile]);

  useEffect(() => {
    if (consultant && availability.length > 0) {
      generateAvailableSlots();
    }
  }, [selectedDate, consultant, availability]);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get client data
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select(`
          id,
          assigned_consultant_id,
          consultant:user_profiles!clients_assigned_consultant_id_fkey(
            id, full_name, email, timezone
          )
        `)
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (clientError) {
        console.error('Client fetch error:', clientError);
        setError('Unable to fetch client data');
        return;
      }

      if (!clientData || !clientData.assigned_consultant_id) {
        setError('No consultant assigned. Please contact support.');
        return;
      }

      setConsultant(clientData.consultant);

      // Fetch consultant availability
      const { data: availabilityData, error: availabilityError } = await supabase
        .from('consultant_availability')
        .select('*')
        .eq('consultant_id', clientData.assigned_consultant_id)
        .eq('is_active', true);

      if (availabilityError) {
        console.error('Availability fetch error:', availabilityError);
        setError('Unable to fetch consultant availability');
        return;
      }

      setAvailability(availabilityData || []);

      // Fetch existing meetings
      const { data: meetingsData, error: meetingsError } = await supabase
        .from('meetings')
        .select(`
          *,
          consultant:user_profiles!meetings_consultant_id_fkey(full_name)
        `)
        .eq('client_id', clientData.id)
        .order('start_time', { ascending: true });

      if (meetingsError) {
        console.error('Meetings fetch error:', meetingsError);
        // Don't set error here, just log it
      } else {
        setMeetings(meetingsData || []);
      }

    } catch (err) {
      console.error('Calendar data fetch error:', err);
      setError('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  };

  const generateAvailableSlots = () => {
    try {
      const selectedDateStr = selectedDate.toLocaleDateString('en-CA'); // YYYY-MM-DD format
      const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      
      // Find availability for selected day
      const dayAvailability = availability.find(a => a.day_of_week === dayOfWeek);
      
      if (!dayAvailability) {
        setAvailableSlots([]);
        return;
      }

      const slots: TimeSlot[] = [];
      const [startHour, startMinute] = dayAvailability.start_time.split(':').map(Number);
      const [endHour, endMinute] = dayAvailability.end_time.split(':').map(Number);
      
      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;
      const slotDuration = dayAvailability.slot_duration_minutes;
      
      for (let currentMinutes = startMinutes; currentMinutes + slotDuration <= endMinutes; currentMinutes += slotDuration) {
        const hours = Math.floor(currentMinutes / 60);
        const minutes = currentMinutes % 60;
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        // Check if this slot conflicts with existing meetings
        const slotDateTime = new Date(selectedDate);
        slotDateTime.setHours(hours, minutes, 0, 0);
        
        const isConflict = meetings.some(meeting => {
          const meetingStart = new Date(meeting.start_time);
          const meetingEnd = new Date(meeting.end_time);
          return slotDateTime >= meetingStart && slotDateTime < meetingEnd;
        });
        
        slots.push({
          time: timeString,
          available: !isConflict,
          price: dayAvailability.price_per_hour,
          duration: slotDuration
        });
      }
      
      setAvailableSlots(slots);
    } catch (err) {
      console.error('Error generating slots:', err);
      setAvailableSlots([]);
    }
  };

  const handleBookMeeting = async () => {
    if (!selectedSlot || !meetingTitle.trim() || !consultant) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setBookingLoading(true);
      setError('');

      // Get client data
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user?.id)
        .single();

      if (!clientData) {
        throw new Error('Client data not found');
      }

      // Calculate meeting times
      const meetingStart = new Date(selectedDate);
      const [hours, minutes] = selectedSlot.time.split(':').map(Number);
      meetingStart.setHours(hours, minutes, 0, 0);
      
      const meetingEnd = new Date(meetingStart);
      meetingEnd.setMinutes(meetingEnd.getMinutes() + selectedDuration);

      const selectedDurationOption = durationOptions.find(opt => opt.duration === selectedDuration);
      if (!selectedDurationOption) {
        throw new Error('Invalid duration selected');
      }

      // Create meeting record
      const { data: meetingData, error: meetingError } = await supabase
        .from('meetings')
        .insert({
          client_id: clientData.id,
          consultant_id: consultant.id,
          title: meetingTitle,
          description: meetingDescription || null,
          start_time: meetingStart.toISOString(),
          end_time: meetingEnd.toISOString(),
          meeting_type: 'video',
          status: 'pending',
          price_paid: selectedDurationOption.price,
          currency: 'USD'
        })
        .select()
        .single();

      if (meetingError) {
        throw meetingError;
      }

      // Create Stripe checkout session for meeting payment
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
        'create-stripe-checkout',
        {
          body: {
            meeting_id: meetingData.id,
            amount: Math.round(selectedDurationOption.price * 100), // Convert to cents
            currency: 'usd',
            title: `Meeting with ${consultant.full_name}`,
            description: `${selectedDuration} minute consultation - ${meetingTitle}`,
            success_url: `${window.location.origin}/meetings?payment=success&meeting_id=${meetingData.id}`,
            cancel_url: `${window.location.origin}/meetings?payment=cancelled`,
            metadata: {
              meeting_id: meetingData.id,
              duration: selectedDuration,
              consultant_id: consultant.id,
              client_id: clientData.id
            }
          }
        }
      );

      if (checkoutError) {
        throw checkoutError;
      }

      // Redirect to Stripe Checkout
      if (checkoutData?.url) {
        window.location.href = checkoutData.url;
      } else {
        throw new Error('No checkout URL received');
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'meeting_scheduled',
          description: `Scheduled meeting with ${consultant.full_name}`,
          payload: {
            meeting_id: meetingData.id,
            duration: selectedDuration,
            price: selectedDurationOption.price,
            scheduled_time: meetingStart.toISOString()
          }
        });

    } catch (err) {
      console.error('Booking error:', err);
      setError(`Failed to book meeting: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Meetings - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error && !consultant) {
    return (
      <>
        <Helmet>
          <title>Meetings - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
          
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  const todaysMeetings = meetings.filter(meeting => {
    const meetingDate = new Date(meeting.start_time).toDateString();
    return meetingDate === new Date().toDateString();
  });

  const upcomingMeetings = meetings.filter(meeting => {
    const meetingDate = new Date(meeting.start_time);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return meetingDate > today;
  });

  return (
    <>
      <Helmet>
        <title>Meetings - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
            <p className="text-gray-600 mt-1">Schedule meetings with your consultant</p>
          </div>
          <button 
            onClick={fetchCalendarData}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => setError('')}
                className="text-red-700 hover:text-red-900 ml-4"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>{successMessage}</span>
              </div>
              <button
                onClick={() => setSuccessMessage('')}
                className="text-green-700 hover:text-green-900 ml-4"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {consultant && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Schedule Meeting</h2>
              <p className="text-gray-600 mb-6">
                Book a consultation with <span className="font-semibold text-blue-600">{consultant.full_name}</span>
              </p>

              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Time Slots */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Available Time Slots
                </label>
                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => slot.available && setSelectedSlot(slot)}
                        disabled={!slot.available}
                        className={`p-2 text-sm font-medium rounded-lg transition-colors ${
                          slot.available
                            ? selectedSlot?.time === slot.time
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                            : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No available slots for this date</p>
                  </div>
                )}
              </div>

              {/* Duration & Pricing */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Meeting Duration & Price
                </label>
                <div className="space-y-2">
                  {durationOptions.map((option) => (
                    <label key={option.duration} className="flex items-center">
                      <input
                        type="radio"
                        name="duration"
                        value={option.duration}
                        checked={selectedDuration === option.duration}
                        onChange={(e) => setSelectedDuration(Number(e.target.value))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-900">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {selectedSlot && (
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Book Meeting - ${durationOptions.find(opt => opt.duration === selectedDuration)?.price}
                </button>
              )}
            </div>

            {/* Meetings List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Meetings</h2>
              
              {/* Today's Meetings */}
              {todaysMeetings.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Today</h3>
                  <div className="space-y-3">
                    {todaysMeetings.map((meeting) => (
                      <div key={meeting.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{meeting.title}</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(meeting.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                              {new Date(meeting.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <p className="text-sm text-gray-500">with {meeting.consultant.full_name}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            meeting.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            meeting.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {meeting.status}
                          </span>
                        </div>
                        {meeting.meeting_url && meeting.status === 'confirmed' && (
                          <div className="mt-3">
                            <a
                              href={meeting.meeting_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                              Join Meeting
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming Meetings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Upcoming</h3>
                {upcomingMeetings.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingMeetings.map((meeting) => (
                      <div key={meeting.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{meeting.title}</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(meeting.start_time).toLocaleDateString()} at{' '}
                              {new Date(meeting.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <p className="text-sm text-gray-500">with {meeting.consultant.full_name}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              meeting.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              meeting.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {meeting.status}
                            </span>
                            {meeting.price_paid > 0 && (
                              <p className="text-xs text-gray-500 mt-1">
                                ${meeting.price_paid} {meeting.currency}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No upcoming meetings scheduled</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Booking Modal */}
        {showBookingModal && selectedSlot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Book Meeting with {consultant?.full_name}
                </h3>
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setSelectedSlot(null);
                    setMeetingTitle('');
                    setMeetingDescription('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Meeting Summary */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Meeting Summary</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p><strong>Date:</strong> {selectedDate.toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {selectedSlot.time}</p>
                    <p><strong>Duration:</strong> {selectedDuration} minutes</p>
                    <p><strong>Price:</strong> ${durationOptions.find(opt => opt.duration === selectedDuration)?.price}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Title *
                  </label>
                  <input
                    type="text"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    placeholder="e.g., Initial Business Consultation"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={meetingDescription}
                    onChange={(e) => setMeetingDescription(e.target.value)}
                    placeholder="Brief description of what you'd like to discuss..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Duration & Price
                  </label>
                  <div className="space-y-2">
                    {durationOptions.map((option) => (
                      <label key={option.duration} className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="duration"
                          value={option.duration}
                          checked={selectedDuration === option.duration}
                          onChange={(e) => setSelectedDuration(Number(e.target.value))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-900">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-yellow-900 mb-1">💳 Payment Process</h4>
                  <p className="text-xs text-yellow-800">
                    You'll be redirected to Stripe for secure payment. Meeting will be confirmed after successful payment.
                  </p>
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setShowBookingModal(false);
                      setSelectedSlot(null);
                      setMeetingTitle('');
                      setMeetingDescription('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBookMeeting}
                    disabled={bookingLoading || !meetingTitle.trim()}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-semibold"
                  >
                    {bookingLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2 inline" />
                        Pay & Book - ${durationOptions.find(opt => opt.duration === selectedDuration)?.price}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Consultant Info */}
        {consultant && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Consultant</h3>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{consultant.full_name}</h4>
                <p className="text-sm text-gray-600">{consultant.email}</p>
                <p className="text-xs text-gray-500">Timezone: {consultant.timezone}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Standard Rates:</div>
                <div className="text-xs text-gray-500 space-y-0.5">
                  <div>30min: $150</div>
                  <div>60min: $250</div>
                  <div>120min: $400</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientCalendar;