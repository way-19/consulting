import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { useSearchParams } from 'react-router-dom';
import { 
  Calendar,
  Clock,
  AlertCircle,
  DollarSign,
  CreditCard,
  Video,
  Phone,
  MapPin,
  User,
  Building2,
  FileText,
  Star,
  Check,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Timer
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface TimeSlot {
  id: string;
  time: string;
  datetime: Date;
  available: boolean;
  price: number;
  currency: string;
  isPremium: boolean;
}

interface Availability {
  id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  slot_duration_minutes: number;
  price_per_hour: number;
  currency: string;
}

interface BlockedTime {
  id: string;
  start_datetime: string;
  end_datetime: string;
  reason: string;
}

interface Consultant {
  id: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  availability?: Availability[];
  blocked_times?: BlockedTime[];
}

interface Department {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
}

interface Meeting {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  status: string;
  meeting_type: string;
  department_id?: string;
  price_paid?: number;
  currency?: string;
  stripe_session_id?: string;
  stripe_payment_intent_id?: string;
  department?: {
    name: string;
    color: string;
  };
}

const ClientCalendar = () => {
  const { user, profile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [bookingDetails, setBookingDetails] = useState({
    title: '',
    description: '',
    meetingType: 'video',
    departmentId: ''
  });
  const [bookingMeeting, setBookingMeeting] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{
    type: 'success' | 'cancelled' | null;
    meetingId?: string;
  }>({ type: null });

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && profile) {
      fetchConsultantAndMeetings();
      fetchDepartments();
    }
  }, [user, profile]);

  // Handle payment result from URL params
  useEffect(() => {
    const payment = searchParams.get('payment');
    const meetingId = searchParams.get('meetingId');
    
    if (payment === 'success' && meetingId) {
      setPaymentResult({ type: 'success', meetingId });
      // Clear URL params
      setSearchParams({});
      // Refresh meetings to show updated status
      setTimeout(() => {
        fetchConsultantAndMeetings();
      }, 1000);
    } else if (payment === 'cancelled') {
      setPaymentResult({ type: 'cancelled' });
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (consultant && selectedDate) {
      const slots = generateAvailableSlots(selectedDate, consultant.id);
      setAvailableSlots(slots);
    }
  }, [consultant, selectedDate, meetings]);

  const fetchConsultantAndMeetings = async () => {
    try {
      setLoading(true);

      // Get client data first
      const { data: clientData } = await supabase
        .from('clients')
        .select('assigned_consultant_id')
        .eq('profile_id', user?.id)
        .single();

      if (!clientData?.assigned_consultant_id) {
        throw new Error('No assigned consultant found');
      }

      // Fetch consultant with availability and blocked times
      const { data: consultantData, error: consultantError } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          avatar_url,
          bio,
          consultant_availability (
            id,
            day_of_week,
            start_time,
            end_time,
            is_available,
            slot_duration_minutes,
            price_per_hour,
            currency
          ),
          consultant_blocked_times (
            id,
            start_datetime,
            end_datetime,
            reason
          )
        `)
        .eq('id', clientData.assigned_consultant_id)
        .single();

      if (consultantError) {
        throw consultantError;
      }

      // Fetch meetings
      const { data: meetingsData, error: meetingsError } = await supabase
        .from('meetings')
        .select(`
          *,
          departments (
            name,
            color
          )
        `)
        .eq('consultant_id', clientData.assigned_consultant_id)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });

      if (meetingsError) {
        throw meetingsError;
      }

      setConsultant({
        ...consultantData,
        availability: consultantData.consultant_availability || [],
        blocked_times: consultantData.consultant_blocked_times || []
      });
      setAvailability(consultantData.consultant_availability || []);
      setMeetings(meetingsData || []);
    } catch (err) {
      console.error('Error fetching consultant data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setDepartments(data || []);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const generateAvailableSlots = (date: Date, consultantId: string): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    // Get consultant availability for this day
    const availability = consultant?.availability?.find(
      avail => avail.day_of_week === dayOfWeek && avail.is_available
    );
    
    if (!availability) {
      console.log(`No availability found for ${dayOfWeek}`);
      return slots;
    }

    // Generate slots based on availability
    const startTime = new Date(`1970-01-01T${availability.start_time}Z`);
    const endTime = new Date(`1970-01-01T${availability.end_time}Z`);
    const slotDuration = availability.slot_duration_minutes;
    const hourlyRate = availability.price_per_hour;
    const slotPrice = (hourlyRate * slotDuration) / 60; // Price per slot

    let currentTime = new Date(startTime);
    
    while (currentTime < endTime) {
      const slotDateTime = new Date(date);
      slotDateTime.setHours(currentTime.getHours(), currentTime.getMinutes(), 0, 0);
      
      // Skip past times
      if (slotDateTime <= new Date()) {
        currentTime = new Date(currentTime.getTime() + slotDuration * 60000);
        continue;
      }
      
      // Check for existing meetings
      const hasConflict = meetings.some(meeting => {
        const meetingStart = new Date(meeting.start_time);
        const meetingEnd = new Date(meeting.end_time);
        return slotDateTime >= meetingStart && slotDateTime < meetingEnd;
      });

      // Check for blocked times
      const isBlocked = consultant?.blocked_times?.some(blocked => {
        const blockedStart = new Date(blocked.start_datetime);
        const blockedEnd = new Date(blocked.end_datetime);
        return slotDateTime >= blockedStart && slotDateTime < blockedEnd;
      });

      if (!hasConflict && !isBlocked) {
        slots.push({
          id: `${slotDateTime.getTime()}`,
          time: slotDateTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }),
          datetime: slotDateTime,
          available: true,
          price: slotPrice,
          currency: availability.currency || 'USD',
          isPremium: slotPrice > 100 // Premium if more expensive
        });
      }

      currentTime = new Date(currentTime.getTime() + slotDuration * 60000);
    }

    return slots;
  };

  const handleBookMeeting = async () => {
    if (!selectedSlot || !bookingDetails.title || !consultant) {
      alert('Please fill in all required fields and select a time slot');
      return;
    }

    if (!bookingDetails.departmentId) {
      alert('Please select a department for this meeting');
      return;
    }

    try {
      // Show payment processing state
      setProcessingPayment(true);

      // Get client data
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user?.id)
        .single();

      if (!clientData) {
        throw new Error('Client data not found');
      }

      const meetingEndTime = new Date(selectedSlot.datetime);
      meetingEndTime.setHours(meetingEndTime.getHours() + 1); // 1-hour meetings

      // Create pending meeting
      const { data: meetingData, error: meetingError } = await supabase
        .from('meetings')
        .insert({
          client_id: clientData.id,
          consultant_id: consultant.id,
          department_id: bookingDetails.departmentId,
          title: bookingDetails.title,
          description: bookingDetails.description,
          start_time: selectedSlot.datetime.toISOString(),
          end_time: meetingEndTime.toISOString(),
          meeting_type: bookingDetails.meetingType,
          status: selectedSlot.price > 0 ? 'pending_payment' : 'scheduled',
          price_paid: selectedSlot.price,
          currency: selectedSlot.currency || 'USD'
        })
        .select()
        .single();

      if (meetingError) {
        throw meetingError;
      }

      // If meeting is free, complete the booking
      if (selectedSlot.price === 0) {
        alert('Free meeting booked successfully!');
        setShowBookingModal(false);
        resetBookingForm();
        fetchConsultantAndMeetings();
        return;
      }

      // Create Stripe checkout for paid meetings
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
        'create-stripe-checkout',
        {
          body: {
            amount: Math.round(selectedSlot.price * 100), // Convert to cents
            currency: (selectedSlot.currency || 'USD').toLowerCase(),
            title: `Meeting with ${consultant.full_name}`,
            description: `${bookingDetails.title} - ${selectedSlot.time} on ${selectedSlot.datetime.toLocaleDateString()}`,
            meeting_id: meetingData.id,
            success_url: `${window.location.origin}/calendar?payment=success&meetingId=${meetingData.id}`,
            cancel_url: `${window.location.origin}/calendar?payment=cancelled`
          }
        }
      );

      if (checkoutError) {
        throw checkoutError;
      }

      // Update meeting with Stripe session ID
      await supabase
        .from('meetings')
        .update({ 
          stripe_session_id: checkoutData.session_id 
        })
        .eq('id', meetingData.id);

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: selectedSlot.price > 0 ? 'meeting_payment_initiated' : 'meeting_scheduled',
          description: `${selectedSlot.price > 0 ? 'Initiated payment for' : 'Scheduled'} meeting: ${bookingDetails.title}`,
          payload: { 
            meeting_id: meetingData.id,
            consultant_id: consultant.id,
            department_id: bookingDetails.departmentId,
            meeting_time: selectedSlot.datetime.toISOString(),
            amount: selectedSlot.price,
            currency: selectedSlot.currency
          }
        });

      if (checkoutData?.url) {
        // Redirect to Stripe Checkout
        window.location.href = checkoutData.url;
      }

    } catch (err) {
      console.error('Meeting booking/payment error:', err);
      alert('Failed to process meeting booking. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const resetBookingForm = () => {
    setBookingDetails({
      title: '',
      description: '',
      meetingType: 'video',
      departmentId: ''
    });
    setSelectedSlot(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-green-100 text-green-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'pending_payment':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSlots = availableSlots.filter(slot => slot.available);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Calendar - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  // Payment Success/Cancel Notifications
  if (paymentResult.type) {
    return (
      <>
        <Helmet>
          <title>Payment Result - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="text-center py-16">
            {paymentResult.type === 'success' ? (
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
                <p className="text-gray-600 mb-8">
                  Your meeting has been confirmed and payment processed successfully. 
                  You'll receive a confirmation email shortly.
                </p>
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      setPaymentResult({ type: null });
                      fetchConsultantAndMeetings();
                    }}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Calendar className="w-5 h-5 mr-2 inline" />
                    View Your Calendar
                  </button>
                  <button
                    onClick={() => window.location.href = '/billing'}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    View Billing History
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-12 h-12 text-orange-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
                <p className="text-gray-600 mb-8">
                  Your payment was cancelled. The meeting slot is still available if you'd like to try again.
                </p>
                <button
                  onClick={() => {
                    setPaymentResult({ type: null });
                  }}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ArrowRight className="w-5 h-5 mr-2 inline" />
                  Return to Calendar
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  if (!consultant) {
    return (
      <>
        <Helmet>
          <title>Calendar - Client Portal</title>
        </Helmet>
        
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Consultant Assigned</h3>
          <p className="text-gray-600">
            Please contact support to get assigned to a consultant.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Calendar - Client Portal</title>
      </Helmet>
      
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Book a Meeting
          </h1>
          <p className="text-gray-600">
            Schedule consultations with your assigned consultant
          </p>
        </div>

        {/* Consultant Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                {consultant.avatar_url ? (
                  <img 
                    src={consultant.avatar_url} 
                    alt={consultant.full_name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-blue-600" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{consultant.full_name}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-3 h-3" />
                  <span>
                    {availability.length > 0 
                      ? `Available ${availability.length} days/week`
                      : 'Limited availability'
                    }
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <span className="text-2xl font-bold text-green-600">
                    {availability.filter(a => a.is_available).length}
                  </span>
                  <p className="text-sm text-gray-600">Days Available</p>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-blue-600">
                    ${availability.find(a => a.price_per_hour)?.price_per_hour || 150}
                  </span>
                  <p className="text-sm text-gray-600">Per Hour</p>
                </div>
              </div>
            </div>
          </div>
          
          {consultant.bio && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">{consultant.bio}</p>
            </div>
          )}
        </div>

        {/* Departments */}
        {departments.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map((dept) => (
                <div key={dept.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{dept.icon}</span>
                    <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                  </div>
                  {dept.description && (
                    <p className="text-sm text-gray-600 mb-3">{dept.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{dept.name}</span>
                    <button
                      onClick={() => {
                        setBookingDetails(prev => ({ ...prev, departmentId: dept.id }));
                        setShowBookingModal(true);
                      }}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Book Now <ArrowRight className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calendar and Time Slots */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Date</h2>
            <div className="space-y-4">
              <input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="text-sm text-gray-600">
                Selected: {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>

          {/* Available Time Slots */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Times</h2>
            {filteredSlots.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No available slots for this date</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedSlot?.id === slot.id
                        ? 'border-blue-500 bg-blue-50'
                        : slot.isPremium
                          ? 'border-purple-300 bg-purple-50 hover:border-purple-400'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Clock className={`w-5 h-5 ${slot.isPremium ? 'text-purple-600' : 'text-gray-600'}`} />
                        <div>
                          <div className="font-semibold text-gray-900">{slot.time}</div>
                          <div className="text-sm text-gray-600">
                            {availability.find(a => a.is_available)?.slot_duration_minutes || 60} minutes
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right flex items-center space-x-2">
                        {slot.isPremium && (
                          <Sparkles className="w-4 h-4 text-purple-500" />
                        )}
                        <div className={`font-bold ${
                          slot.price === 0 ? 'text-green-600' : 
                          slot.isPremium ? 'text-purple-600' : 'text-gray-900'
                        }`}>
                          {slot.price === 0 ? 'FREE' : `$${slot.price}`}
                        </div>
                      </div>
                    </div>
                    
                    {slot.isPremium && (
                      <div className="mt-2 p-2 bg-purple-100 border border-purple-200 rounded text-xs">
                        <div className="flex items-center space-x-1 text-purple-700">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="font-medium">Premium Time Slot</span>
                        </div>
                        <p className="text-purple-600 mt-1">Extended consultation with priority support</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Meetings</h2>
          {meetings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No upcoming meetings scheduled</p>
            </div>
          ) : (
            <div className="space-y-4">
              {meetings.map((meeting) => (
                <div key={meeting.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                      <div className="text-sm text-gray-600">
                        {new Date(meeting.start_time).toLocaleDateString()} • {new Date(meeting.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {meeting.department && (
                        <div className="flex items-center space-x-1 mt-1">
                          <span className={`w-2 h-2 rounded-full`} style={{ backgroundColor: meeting.department.color }}></span>
                          <span className="text-xs text-gray-500">{meeting.department.name}</span>
                        </div>
                      )}
                      {meeting.price_paid && meeting.price_paid > 0 && (
                        <div className="flex items-center space-x-1 mt-1">
                          <DollarSign className="w-3 h-3 text-green-600" />
                          <span className="text-xs text-green-600 font-medium">
                            Paid: ${meeting.price_paid}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                      {meeting.status === 'pending_payment' ? 'Payment Pending' : 
                       meeting.status === 'confirmed' ? 'Confirmed & Paid' : meeting.status}
                    </span>
                    {meeting.status === 'pending_payment' && (
                      <button
                        onClick={() => {
                          // Re-initiate payment for pending meetings
                          alert('Payment options will be available soon');
                        }}
                        className="text-xs px-2 py-1 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors"
                      >
                        <Timer className="w-3 h-3 inline mr-1" />
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Book Meeting</h2>
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {selectedSlot && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-semibold text-blue-900">
                          {selectedSlot.datetime.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })} at {selectedSlot.time}
                        </div>
                        <div className="text-sm text-blue-700">
                          Duration: {availability.find(a => a.is_available)?.slot_duration_minutes || 60} minutes
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-6" ref={formRef}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meeting Type *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'video', label: 'Video Call', icon: Video },
                        { value: 'phone', label: 'Phone', icon: Phone },
                        { value: 'in_person', label: 'In Person', icon: MapPin }
                      ].map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setBookingDetails(prev => ({ ...prev, meetingType: type.value }))}
                          className={`p-3 border rounded-lg text-center transition-colors ${
                            bookingDetails.meetingType === type.value
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <type.icon className="w-5 h-5 mx-auto mb-1" />
                          <div className="text-xs font-medium">{type.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department *
                    </label>
                    <select
                      value={bookingDetails.departmentId}
                      onChange={(e) => setBookingDetails(prev => ({ ...prev, departmentId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a department...</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.icon} {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meeting Title *
                    </label>
                    <input
                      type="text"
                      value={bookingDetails.title}
                      onChange={(e) => setBookingDetails(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Company Formation Consultation"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={bookingDetails.description}
                      onChange={(e) => setBookingDetails(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Additional details about the meeting..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  {/* Payment Summary */}
                  {selectedSlot && selectedSlot.price > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <CreditCard className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold text-green-900">Payment Details</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-green-700">Meeting Duration:</span>
                          <span className="font-medium text-green-900">
                            {availability.find(a => a.is_available)?.slot_duration_minutes || 60} minutes
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Hourly Rate:</span>
                          <span className="font-medium text-green-900">
                            ${availability.find(a => a.is_available)?.price_per_hour || 150}/hour
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-green-300 pt-2">
                          <span className="text-green-700 font-semibold">Total Amount:</span>
                          <span className="font-bold text-green-900 text-lg">
                            ${selectedSlot.price} {selectedSlot.currency}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                        💳 Secure payment via Stripe. You'll be redirected to complete payment.
                      </div>
                    </div>
                  )}

                  {selectedSlot && selectedSlot.price === 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        <div>
                          <h4 className="font-semibold text-blue-900">Free Consultation</h4>
                          <p className="text-sm text-blue-700">This consultation is complimentary</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBookMeeting}
                    disabled={processingPayment || !bookingDetails.title || !selectedSlot || !bookingDetails.departmentId}
                    className={`flex-1 px-4 py-3 text-white rounded-lg disabled:opacity-50 transition-all duration-300 ${
                      selectedSlot && selectedSlot.price > 0
                        ? 'bg-green-600 hover:bg-green-700 hover:shadow-lg'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {processingPayment ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        {selectedSlot && selectedSlot.price > 0 ? (
                          <>
                            <CreditCard className="w-5 h-5 mr-2 inline" />
                            Pay ${selectedSlot.price} & Book
                          </>
                        ) : (
                          <>
                            <Calendar className="w-5 h-5 mr-2 inline" />
                            Book Free Meeting
                          </>
                        )}
                      </>
                    )}
                  </button>
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