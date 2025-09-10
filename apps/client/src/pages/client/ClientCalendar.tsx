import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Phone, 
  MapPin,
  Plus,
  ChevronLeft, 
  ChevronRight,
  User,
  CheckCircle,
  AlertTriangle,
  X,
  Edit,
  Trash2,
  Globe,
  Zap
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface Meeting {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  meeting_type: 'video' | 'phone' | 'in_person';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  meeting_url?: string;
  location?: string;
  price_paid?: number;
  currency?: string;
  consultant: {
    full_name: string;
    email: string;
    timezone: string;
  };
}

interface AvailableSlot {
  date: string;
  time: string;
  datetime: string;
  duration: number;
  price: number;
  type: 'video' | 'phone' | 'in_person';
}

interface ConsultantAvailability {
  id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  price_per_hour: number;
  currency: string;
  timezone: string;
}

const ClientCalendar = () => {
  const { user, profile } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [consultant, setConsultant] = useState<any>(null);
  const [consultantAvailability, setConsultantAvailability] = useState<ConsultantAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [bookingData, setBookingData] = useState({
    title: '',
    description: '',
    meeting_type: 'video' as const,
    special_requests: ''
  });
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const meetingTypes = [
    { value: 'video', label: 'Video Call', icon: Video, color: 'blue' },
    { value: 'phone', label: 'Phone Call', icon: Phone, color: 'green' },
    { value: 'in_person', label: 'In Person', icon: MapPin, color: 'purple' }
  ];

  useEffect(() => {
    if (user && profile) {
      fetchCalendarData();
    }
  }, [user, profile, currentDate]);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get client data with consultant
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

      if (clientError || !clientData) {
        setError('Client data not found. Please ensure you have an active client profile.');
        return;
      }

      if (!clientData.assigned_consultant_id) {
        setError('No consultant assigned yet. You will be assigned to a consultant within 24 hours.');
        return;
      }

      setConsultant(clientData.consultant);
      
      // Fetch existing meetings
      await fetchMeetings(clientData.id);
      
      // Fetch consultant availability
      await fetchConsultantAvailability(clientData.assigned_consultant_id);
      
      // Generate available slots for next 2 weeks
      await generateAvailableSlots(clientData.assigned_consultant_id);

    } catch (err) {
      console.error('Error fetching calendar data:', err);
      setError(`Failed to load calendar data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeetings = async (clientId: string) => {
    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString();

      const { data: meetingsData, error } = await supabase
        .from('meetings')
        .select(`
          *,
          consultant:user_profiles!meetings_consultant_id_fkey(full_name, email, timezone)
        `)
        .eq('client_id', clientId)
        .gte('start_time', startOfMonth)
        .lte('start_time', endOfMonth)
        .order('start_time');

      if (error) {
        console.error('Error fetching meetings:', error);
        return;
      }

      setMeetings(meetingsData || []);
    } catch (err) {
      console.error('Error fetching meetings:', err);
    }
  };

  const fetchConsultantAvailability = async (consultantId: string) => {
    try {
      const { data: availability, error } = await supabase
        .from('consultant_availability')
        .select('*')
        .eq('consultant_id', consultantId)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching availability:', error);
        return;
      }

      setConsultantAvailability(availability || []);
    } catch (err) {
      console.error('Error fetching availability:', err);
    }
  };

  const generateAvailableSlots = async (consultantId: string) => {
    try {
      // Get existing meetings to avoid conflicts
      const twoWeeksFromNow = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
      const { data: existingMeetings } = await supabase
        .from('meetings')
        .select('start_time, end_time')
        .eq('consultant_id', consultantId)
        .gte('start_time', new Date().toISOString())
        .lte('start_time', twoWeeksFromNow);

      const bookedSlots = new Set(
        (existingMeetings || []).map(m => new Date(m.start_time).toISOString().slice(0, 16))
      );

      const slots: AvailableSlot[] = [];
      const today = new Date();

      // Generate slots for next 14 days
      for (let i = 1; i <= 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'lowercase' });
        const availability = consultantAvailability.find(a => a.day_of_week === dayOfWeek);
        
        if (!availability || !availability.is_available) continue;

        // Generate time slots for this day
        const startTime = availability.start_time;
        const endTime = availability.end_time;
        const slotDuration = availability.slot_duration_minutes || 60;
        const pricePerHour = availability.price_per_hour || 150;
        
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);
        
        let currentHour = startHour;
        let currentMin = startMin;

        while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
          const slotTime = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
          const slotDateTime = new Date(date);
          slotDateTime.setHours(currentHour, currentMin, 0, 0);
          
          const slotKey = slotDateTime.toISOString().slice(0, 16);
          
          // Skip if slot is already booked
          if (!bookedSlots.has(slotKey)) {
            slots.push({
              date: date.toISOString().split('T')[0],
              time: slotTime,
              datetime: slotDateTime.toISOString(),
              duration: slotDuration,
              price: (pricePerHour / 60) * slotDuration,
              type: 'video' // Default type
            });
          }

          // Move to next slot
          currentMin += slotDuration;
          if (currentMin >= 60) {
            currentMin -= 60;
            currentHour++;
          }
        }
      }

      setAvailableSlots(slots);
    } catch (err) {
      console.error('Error generating available slots:', err);
    }
  };

  const handleBookMeeting = async () => {
    if (!selectedSlot || !bookingData.title.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setBooking(true);
      setError('');
      setSuccessMessage('');

      // Get client data
      const { data: clientData } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .single();

      if (!clientData) {
        throw new Error('Client data not found');
      }

      // Calculate end time
      const startTime = new Date(selectedSlot.datetime);
      const endTime = new Date(startTime.getTime() + selectedSlot.duration * 60000);

      // Create meeting record
      const { data: meetingData, error: meetingError } = await supabase
        .from('meetings')
        .insert({
          client_id: clientData.id,
          consultant_id: clientData.assigned_consultant_id,
          title: bookingData.title,
          description: bookingData.description || bookingData.special_requests,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          meeting_type: bookingData.meeting_type,
          status: 'scheduled',
          meeting_url: bookingData.meeting_type === 'video' ? `https://meet.consulting19.com/${Date.now()}` : null,
          location: bookingData.meeting_type === 'in_person' ? 'To be confirmed' : null,
          notes: bookingData.special_requests
        })
        .select()
        .single();

      if (meetingError) {
        throw meetingError;
      }

      // Create Stripe checkout for paid meetings
      if (selectedSlot.price > 0) {
        const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
          'create-stripe-checkout',
          {
            body: {
              meeting_id: meetingData.id,
              amount: Math.round(selectedSlot.price * 100), // Convert to cents
              currency: 'usd',
              title: `Meeting: ${bookingData.title}`,
              description: `${selectedSlot.duration}-minute ${bookingData.meeting_type} meeting`,
              success_url: `${window.location.origin}/calendar?payment=success&meeting_id=${meetingData.id}`,
              cancel_url: `${window.location.origin}/calendar?payment=cancelled`,
            }
          }
        );

        if (checkoutError) {
          throw checkoutError;
        }

        if (checkoutData?.url) {
          window.location.href = checkoutData.url;
          return;
        }
      }

      // Notify consultant
      await supabase.functions.invoke('notify', {
        body: {
          recipient_id: clientData.assigned_consultant_id,
          type: 'meeting_scheduled',
          payload: {
            client_name: profile?.full_name,
            meeting_title: bookingData.title,
            meeting_time: startTime.toISOString(),
            meeting_type: bookingData.meeting_type,
            duration: selectedSlot.duration
          },
          email_notification: true
        }
      });

      setSuccessMessage('Meeting booked successfully!');
      setShowBookingModal(false);
      setSelectedSlot(null);
      setBookingData({
        title: '',
        description: '',
        meeting_type: 'video',
        special_requests: ''
      });
      
      // Refresh data
      fetchCalendarData();
      
      setTimeout(() => setSuccessMessage(''), 5000);

    } catch (err: any) {
      console.error('Meeting booking error:', err);
      setError(err.message || 'Failed to book meeting. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  const handleCancelMeeting = async (meetingId: string) => {
    if (!confirm('Are you sure you want to cancel this meeting?')) return;

    try {
      const { error } = await supabase
        .from('meetings')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', meetingId);

      if (error) throw error;

      setSuccessMessage('Meeting cancelled successfully!');
      fetchCalendarData();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError('Failed to cancel meeting');
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Previous month's days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true });
    }
    
    // Next month's days to fill the grid
    const remainingSlots = 42 - days.length;
    for (let day = 1; day <= remainingSlots; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({ date: nextDate, isCurrentMonth: false });
    }

    return days;
  };

  const getMeetingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return meetings.filter(meeting => 
      meeting.start_time.startsWith(dateStr)
    );
  };

  const getAvailableSlotsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return availableSlots.filter(slot => slot.date === dateStr);
  };

  const formatTime = (time: string) => {
    return new Date(time).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMeetingStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      case 'rescheduled': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
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
            <div className="h-96 bg-gray-200 rounded-lg"></div>
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
        
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <User className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-yellow-900 mb-4">No Consultant Assigned</h3>
            <p className="text-yellow-800 mb-6">
              You need to be assigned to a consultant to schedule meetings. 
              This usually happens within 24 hours of account creation.
            </p>
            <div className="bg-white rounded-lg p-4 border border-yellow-300 max-w-md mx-auto">
              <h4 className="font-semibold text-gray-900 mb-2">📋 Next Steps:</h4>
              <ol className="text-sm text-gray-700 text-left space-y-1">
                <li>1. Wait for consultant assignment</li>
                <li>2. Receive welcome message</li>
                <li>3. Schedule your first consultation</li>
              </ol>
            </div>
          </div>
        </div>
      </>
    );
  }

  const days = getDaysInMonth();

  return (
    <>
      <Helmet>
        <title>Calendar - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
            <p className="text-gray-600 mt-1">Schedule meetings with your consultant</p>
          </div>
          <div className="flex items-center space-x-3">
            {consultant && (
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{consultant.full_name}</div>
                <div className="text-xs text-gray-500">Your Consultant</div>
              </div>
            )}
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <div className="flex-1">{error}</div>
            <button onClick={() => setError('')} className="ml-2 text-red-500 hover:text-red-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            <div className="flex-1">{successMessage}</div>
            <button onClick={() => setSuccessMessage('')} className="ml-2 text-green-500 hover:text-green-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Calendar Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <h2 className="text-xl font-semibold text-gray-900">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {days.map((dayInfo, index) => {
              const dayMeetings = getMeetingsForDate(dayInfo.date);
              const daySlots = getAvailableSlotsForDate(dayInfo.date);
              const isSelected = selectedDate?.toDateString() === dayInfo.date.toDateString();
              const todayClass = isToday(dayInfo.date) ? 'bg-blue-100 border-blue-300' : '';
              const pastClass = isPastDate(dayInfo.date) ? 'opacity-50' : '';
              
              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(dayInfo.date)}
                  disabled={isPastDate(dayInfo.date)}
                  className={`
                    p-2 min-h-[80px] border border-gray-200 rounded-lg text-left hover:bg-gray-50 
                    transition-colors relative disabled:cursor-not-allowed
                    ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                    ${!dayInfo.isCurrentMonth ? 'text-gray-400 bg-gray-50' : ''}
                    ${todayClass}
                    ${pastClass}
                  `}
                >
                  <div className="text-sm font-medium mb-1">
                    {dayInfo.date.getDate()}
                  </div>
                  
                  {/* Meetings indicator */}
                  {dayMeetings.length > 0 && (
                    <div className="space-y-1">
                      {dayMeetings.slice(0, 2).map((meeting) => (
                        <div
                          key={meeting.id}
                          className={`text-xs px-1 py-0.5 rounded border ${getMeetingStatusColor(meeting.status)}`}
                        >
                          {formatTime(meeting.start_time)}
                        </div>
                      ))}
                      {dayMeetings.length > 2 && (
                        <div className="text-xs text-gray-500">+{dayMeetings.length - 2} more</div>
                      )}
                    </div>
                  )}
                  
                  {/* Available slots indicator */}
                  {daySlots.length > 0 && dayMeetings.length === 0 && (
                    <div className="absolute bottom-1 right-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details */}
        {selectedDate && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Existing Meetings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Meetings on {selectedDate.toLocaleDateString()}
              </h3>
              
              {getMeetingsForDate(selectedDate).length > 0 ? (
                <div className="space-y-3">
                  {getMeetingsForDate(selectedDate).map((meeting) => (
                    <div key={meeting.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{meeting.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{meeting.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{formatTime(meeting.start_time)} - {formatTime(meeting.end_time)}</span>
                            <span className="capitalize">{meeting.meeting_type}</span>
                            {meeting.price_paid && (
                              <span>${meeting.price_paid} {meeting.currency}</span>
                            )}
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getMeetingStatusColor(meeting.status)}`}>
                          {meeting.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-3">
                        {meeting.meeting_url && meeting.status !== 'cancelled' && (
                          <button
                            onClick={() => window.open(meeting.meeting_url, '_blank')}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                          >
                            <Video className="w-3 h-3 mr-1 inline" />
                            Join Meeting
                          </button>
                        )}
                        {meeting.status === 'scheduled' && (
                          <button
                            onClick={() => handleCancelMeeting(meeting.id)}
                            className="px-3 py-1 border border-red-300 text-red-600 rounded text-xs hover:bg-red-50"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No meetings scheduled for this date</p>
                </div>
              )}
            </div>

            {/* Available Time Slots */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Available Time Slots
              </h3>
              
              {getAvailableSlotsForDate(selectedDate).length > 0 ? (
                <div className="space-y-2">
                  {getAvailableSlotsForDate(selectedDate).slice(0, 8).map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedSlot(slot);
                        setShowBookingModal(true);
                      }}
                      className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{slot.time}</span>
                        <span className="text-sm text-gray-600">({slot.duration} min)</span>
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        ${slot.price.toFixed(0)}
                      </div>
                    </button>
                  ))}
                  {getAvailableSlotsForDate(selectedDate).length > 8 && (
                    <div className="text-center text-sm text-gray-500">
                      +{getAvailableSlotsForDate(selectedDate).length - 8} more slots available
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No available slots for this date</p>
                  {isPastDate(selectedDate) && (
                    <p className="text-sm text-gray-500 mt-2">Past dates are not bookable</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Booking Modal */}
        {showBookingModal && selectedSlot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Book Meeting</h3>
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setSelectedSlot(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {/* Meeting Details */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-semibold text-blue-900 mb-2">📅 Meeting Details</h4>
                  <div className="space-y-1 text-sm text-blue-800">
                    <div>Date: {new Date(selectedSlot.date).toLocaleDateString()}</div>
                    <div>Time: {selectedSlot.time}</div>
                    <div>Duration: {selectedSlot.duration} minutes</div>
                    <div>Price: ${selectedSlot.price.toFixed(0)}</div>
                    <div>Consultant: {consultant.full_name}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Title *
                  </label>
                  <input
                    type="text"
                    value={bookingData.title}
                    onChange={(e) => setBookingData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Initial Business Consultation"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {meetingTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setBookingData(prev => ({ ...prev, meeting_type: type.value }))}
                        className={`p-2 border border-gray-300 rounded-lg text-center transition-colors ${
                          bookingData.meeting_type === type.value
                            ? `bg-${type.color}-100 border-${type.color}-300 text-${type.color}-800`
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <type.icon className="w-4 h-4 mx-auto mb-1" />
                        <div className="text-xs">{type.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description / Agenda
                  </label>
                  <textarea
                    value={bookingData.description}
                    onChange={(e) => setBookingData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="What would you like to discuss in this meeting?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    value={bookingData.special_requests}
                    onChange={(e) => setBookingData(prev => ({ ...prev, special_requests: e.target.value }))}
                    placeholder="Any specific requirements or preparation needed?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-6 p-4">
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setSelectedSlot(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookMeeting}
                  disabled={booking || !bookingData.title.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {booking ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Booking...
                    </>
                  ) : (
                    <>
                      <CalendarIcon className="w-4 h-4 mr-2 inline" />
                      Book Meeting (${selectedSlot.price.toFixed(0)})
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Meeting Guidelines */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Meeting Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-0.5">
                  <Video className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Video Meetings</h4>
                  <p className="text-sm text-gray-600">
                    High-quality video calls with screen sharing capabilities. 
                    Meeting links are provided after booking confirmation.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mt-0.5">
                  <Phone className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Phone Consultations</h4>
                  <p className="text-sm text-gray-600">
                    Professional phone consultations for urgent matters or preference. 
                    Your consultant will call you at the scheduled time.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mt-0.5">
                  <MapPin className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">In-Person Meetings</h4>
                  <p className="text-sm text-gray-600">
                    Face-to-face meetings at your consultant's office or agreed location. 
                    Subject to availability and location.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mt-0.5">
                  <Clock className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Preparation Tips</h4>
                  <p className="text-sm text-gray-600">
                    Prepare your questions in advance. Have relevant documents ready. 
                    Check your internet connection for video meetings.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mt-0.5">
                  <Globe className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Time Zones</h4>
                  <p className="text-sm text-gray-600">
                    All times are shown in your local timezone. Your consultant is in 
                    {consultant.timezone} timezone.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mt-0.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Cancellation Policy</h4>
                  <p className="text-sm text-gray-600">
                    Free cancellation up to 24 hours before the meeting. 
                    Late cancellations may incur charges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientCalendar;