import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User,
  ChevronLeft,
  ChevronRight,
  Video,
  Phone,
  MapPin,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  X
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface Meeting {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  meeting_type: 'video' | 'phone' | 'in_person';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  meeting_url?: string;
  location?: string;
  price_paid?: number;
  currency?: string;
  consultant: {
    full_name: string;
  };
}

interface ConsultantAvailability {
  id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  timezone: string;
  slot_duration_minutes: number;
  price_per_hour: number;
  currency: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  price_30min: number;
  price_60min: number;
  price_120min: number;
}

interface BookingData {
  title: string;
  description: string;
  meeting_type: 'video' | 'phone' | 'in_person';
  location: string;
  duration: 30 | 60 | 120;
  price: number;
}

const ClientCalendar = () => {
  const { user, profile } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [availability, setAvailability] = useState<ConsultantAvailability[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingSlot, setBookingSlot] = useState<TimeSlot | null>(null);
  const [bookingData, setBookingData] = useState<BookingData>({
    title: '',
    description: '',
    meeting_type: 'video',
    location: '',
    duration: 60,
    price: 250
  });
  const [booking, setBooking] = useState(false);
  const [consultant, setConsultant] = useState<any>(null);

  useEffect(() => {
    if (user && profile) {
      fetchCalendarData();
    }
  }, [user, profile, currentDate]);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);

      // Get client data with consultant
      const { data: clientData } = await supabase
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

      if (!clientData?.assigned_consultant_id) {
        setLoading(false);
        return;
      }

      setConsultant(clientData.consultant);

      // Fetch consultant availability
      const { data: availabilityData } = await supabase
        .from('consultant_availability')
        .select('*')
        .eq('consultant_id', clientData.assigned_consultant_id)
        .eq('is_active', true);

      setAvailability(availabilityData || []);

      // Fetch meetings for current month
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const { data: meetingsData } = await supabase
        .from('meetings')
        .select(`
          *,
          consultant:user_profiles!meetings_consultant_id_fkey(full_name)
        `)
        .eq('client_id', clientData.id)
        .gte('start_time', monthStart.toISOString())
        .lte('start_time', monthEnd.toISOString())
        .order('start_time');

      setMeetings(meetingsData || []);

      // Generate available slots for selected date
      if (selectedDate) {
        const slots = generateAvailableSlots(selectedDate, availabilityData || [], meetingsData || []);
        setAvailableSlots(slots);
      }

    } catch (err) {
      console.error('Error fetching calendar data:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateAvailableSlots = (date: Date, consultantAvailability: ConsultantAvailability[], existingMeetings: Meeting[]): TimeSlot[] => {
    try {
      const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayName = weekdays[date.getDay()];
      const dayAvailability = consultantAvailability.find(a => a.day_of_week === dayName);
      
      if (!dayAvailability || !dayAvailability.is_available) {
        return [];
      }

      const slots: TimeSlot[] = [];
      const startTime = parseTime(dayAvailability.start_time);
      const endTime = parseTime(dayAvailability.end_time);
      const slotDuration = 30; // 30 minute slots
      const baseRate = dayAvailability.price_per_hour;

      // Generate slots every 30 minutes
      let currentTime = startTime;
      while (currentTime + 120 <= endTime) { // Ensure we can fit 120min meetings
        const slotDateTime = new Date(date);
        const hours = Math.floor(currentTime / 60);
        const minutes = currentTime % 60;
        slotDateTime.setHours(hours, minutes, 0, 0);

        // Check if slot conflicts with existing meetings
        const hasConflict = existingMeetings.some(meeting => {
          const meetingStart = new Date(meeting.start_time);
          const meetingEnd = new Date(meeting.end_time);
          return slotDateTime >= meetingStart && slotDateTime < meetingEnd;
        });

        // Check if slot is in the past
        const isPast = slotDateTime <= new Date();

        // Calculate prices for different durations
        const price_30min = 150; // Fixed prices as requested
        const price_60min = 250;
        const price_120min = 400;

        slots.push({
          time: formatTime(hours, minutes),
          available: !hasConflict && !isPast,
          price_30min,
          price_60min,
          price_120min
        });

        currentTime += slotDuration;
      }

      return slots;
    } catch (err) {
      console.error('Error generating available slots:', err);
      return [];
    }
  };

  const parseTime = (timeString: string): number => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatTime = (hours: number, minutes: number): string => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleBookMeeting = async () => {
    if (!bookingSlot || !consultant || !selectedDate || !bookingData.title.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setBooking(true);

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
      const [hours, minutes] = bookingSlot.time.split(':').map(Number);
      const startTime = new Date(selectedDate);
      startTime.setHours(hours, minutes, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + bookingData.duration);

      // Create meeting
      const { data: meetingData, error: meetingError } = await supabase
        .from('meetings')
        .insert({
          client_id: clientData.id,
          consultant_id: consultant.id,
          title: bookingData.title,
          description: bookingData.description,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          meeting_type: bookingData.meeting_type,
          status: 'scheduled',
          meeting_url: bookingData.meeting_type === 'video' ? 'https://meet.google.com/new' : null,
          location: bookingData.meeting_type === 'in_person' ? bookingData.location : null,
          price_paid: bookingData.price,
          currency: 'USD'
        })
        .select()
        .single();

      if (meetingError) {
        throw meetingError;
      }

      // Create Stripe checkout session for payment
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
        'create-stripe-checkout',
        {
          body: {
            meeting_id: meetingData.id,
            amount: Math.round(bookingData.price * 100), // Convert to cents
            currency: 'usd',
            title: `${bookingData.duration}min Meeting: ${bookingData.title}`,
            description: `${bookingData.duration} minute ${bookingData.meeting_type} meeting with ${consultant.full_name}`,
            success_url: `${window.location.origin}/meetings?payment=success&meeting_id=${meetingData.id}`,
            cancel_url: `${window.location.origin}/meetings?payment=cancelled`
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
        alert('Meeting scheduled successfully!');
        setBookingSlot(null);
        setBookingData({ title: '', description: '', meeting_type: 'video', location: '', duration: 60, price: 250 });
        fetchCalendarData();
      }

    } catch (err) {
      console.error('Booking error:', err);
      alert('Failed to book meeting. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  const cancelMeeting = async (meetingId: string) => {
    if (!confirm('Are you sure you want to cancel this meeting?')) return;

    try {
      const { error } = await supabase
        .from('meetings')
        .update({ status: 'cancelled' })
        .eq('id', meetingId);

      if (error) throw error;

      alert('Meeting cancelled successfully');
      fetchCalendarData();
    } catch (err) {
      console.error('Cancel error:', err);
      alert('Failed to cancel meeting');
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Previous month days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month, -i);
      days.push({ date: day, isCurrentMonth: false });
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true });
    }
    
    // Next month days to fill grid
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({ date, isCurrentMonth: false });
    }
    
    return days;
  };

  const getMeetingsForDate = (date: Date) => {
    return meetings.filter(meeting => {
      const meetingDate = new Date(meeting.start_time);
      return meetingDate.toDateString() === date.toDateString();
    });
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);
    if (availability.length > 0) {
      const slots = generateAvailableSlots(date, availability, meetings);
      setAvailableSlots(slots);
    }
  };

  const selectDurationAndPrice = (duration: 30 | 60 | 120) => {
    const prices = { 30: 150, 60: 250, 120: 400 };
    setBookingData(prev => ({ 
      ...prev, 
      duration, 
      price: prices[duration] 
    }));
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const meetingTypeIcons = {
    video: Video,
    phone: Phone,
    in_person: MapPin
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
              You'll be able to schedule meetings once you're assigned to a consultant. 
              This usually happens within 24 hours of account creation.
            </p>
          </div>
        </div>
      </>
    );
  }

  const days = getDaysInMonth(currentDate);

  return (
    <>
      <Helmet>
        <title>Calendar - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar & Meetings</h1>
          <p className="text-gray-600 mt-1">Schedule meetings with your consultant: {consultant.full_name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={prevMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {dayNames.map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {days.map((day, index) => {
                  const dayMeetings = getMeetingsForDate(day.date);
                  const isToday = day.date.toDateString() === new Date().toDateString();
                  const isSelected = selectedDate?.toDateString() === day.date.toDateString();
                  
                  return (
                    <button
                      key={index}
                      onClick={() => selectDate(day.date)}
                      className={`relative p-2 h-16 text-left transition-colors rounded-lg ${
                        !day.isCurrentMonth 
                          ? 'text-gray-300 hover:bg-gray-50' 
                          : isSelected
                            ? 'bg-blue-600 text-white'
                            : isToday
                              ? 'bg-blue-100 text-blue-900 hover:bg-blue-200'
                              : 'hover:bg-gray-100 text-gray-900'
                      }`}
                    >
                      <span className="text-sm font-medium">
                        {day.date.getDate()}
                      </span>
                      
                      {/* Meeting indicators */}
                      {dayMeetings.length > 0 && (
                        <div className="absolute bottom-1 left-1 flex space-x-1">
                          {dayMeetings.slice(0, 3).map((meeting, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${
                                meeting.status === 'confirmed' ? 'bg-green-500' :
                                meeting.status === 'scheduled' ? 'bg-blue-500' :
                                meeting.status === 'cancelled' ? 'bg-red-500' :
                                'bg-gray-500'
                              } ${!day.isCurrentMonth ? 'opacity-30' : ''}`}
                            />
                          ))}
                          {dayMeetings.length > 3 && (
                            <span className="text-xs">+{dayMeetings.length - 3}</span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Selected Date Info */}
            {selectedDate && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>

                {/* Available Time Slots */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Available Times</h4>
                  
                  {availableSlots.length > 0 ? (
                    <div className="space-y-2">
                      {availableSlots.filter(slot => slot.available).map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => setBookingSlot(slot)}
                          className={`w-full p-3 text-left border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors ${
                            bookingSlot?.time === slot.time ? 'bg-blue-100 border-blue-400' : 'bg-white'
                          }`}
                        >
                          <div className="font-medium text-gray-900">{slot.time}</div>
                          <div className="text-xs text-gray-600">
                            30min: ${slot.price_30min} • 60min: ${slot.price_60min} • 120min: ${slot.price_120min}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <Clock className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">No available slots for this date</p>
                    </div>
                  )}
                </div>

                {/* Existing Meetings */}
                {getMeetingsForDate(selectedDate).length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-3">Scheduled Meetings</h4>
                    <div className="space-y-2">
                      {getMeetingsForDate(selectedDate).map((meeting) => {
                        const MeetingIcon = meetingTypeIcons[meeting.meeting_type];
                        return (
                          <div key={meeting.id} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2 mb-1">
                              <MeetingIcon className="w-4 h-4 text-gray-600" />
                              <span className="font-medium text-gray-900 text-sm">{meeting.title}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(meeting.start_time).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })} - {new Date(meeting.end_time).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                            <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                              {meeting.status}
                            </span>
                            {meeting.status === 'scheduled' && (
                              <button
                                onClick={() => cancelMeeting(meeting.id)}
                                className="ml-2 text-xs text-red-600 hover:text-red-700"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Booking Modal */}
        {bookingSlot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Book Meeting - {bookingSlot.time}
                </h2>
                <button
                  onClick={() => setBookingSlot(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Title *
                  </label>
                  <input
                    type="text"
                    value={bookingData.title}
                    onChange={(e) => setBookingData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Initial Business Consultation"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration & Price
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => selectDurationAndPrice(30)}
                      className={`p-3 border-2 rounded-lg text-center transition-colors ${
                        bookingData.duration === 30
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold">30min</div>
                      <div className="text-sm">$150</div>
                    </button>
                    <button
                      onClick={() => selectDurationAndPrice(60)}
                      className={`p-3 border-2 rounded-lg text-center transition-colors ${
                        bookingData.duration === 60
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold">60min</div>
                      <div className="text-sm">$250</div>
                    </button>
                    <button
                      onClick={() => selectDurationAndPrice(120)}
                      className={`p-3 border-2 rounded-lg text-center transition-colors ${
                        bookingData.duration === 120
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold">120min</div>
                      <div className="text-sm">$400</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={bookingData.description}
                    onChange={(e) => setBookingData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="What would you like to discuss?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Type
                  </label>
                  <select
                    value={bookingData.meeting_type}
                    onChange={(e) => setBookingData(prev => ({ ...prev, meeting_type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="video">Video Call</option>
                    <option value="phone">Phone Call</option>
                    <option value="in_person">In Person</option>
                  </select>
                </div>

                {bookingData.meeting_type === 'in_person' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={bookingData.location}
                      onChange={(e) => setBookingData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Meeting location"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Meeting Summary</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p><strong>Date:</strong> {selectedDate?.toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {bookingSlot.time} ({bookingData.duration} minutes)</p>
                    <p><strong>Consultant:</strong> {consultant.full_name}</p>
                    <p><strong>Type:</strong> {bookingData.meeting_type}</p>
                    <p><strong>Price:</strong> ${bookingData.price}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => setBookingSlot(null)}
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
                      <CheckCircle className="w-4 h-4 mr-2 inline" />
                      Book & Pay ${bookingData.price}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Meetings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Meetings</h2>
          
          {meetings.filter(m => new Date(m.start_time) >= new Date() && m.status !== 'cancelled').length > 0 ? (
            <div className="space-y-4">
              {meetings
                .filter(m => new Date(m.start_time) >= new Date() && m.status !== 'cancelled')
                .map((meeting) => {
                  const MeetingIcon = meetingTypeIcons[meeting.meeting_type];
                  return (
                    <div key={meeting.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <MeetingIcon className="w-5 h-5 text-gray-600" />
                          <div>
                            <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(meeting.start_time).toLocaleDateString()} at{' '}
                              {new Date(meeting.start_time).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                            {meeting.description && (
                              <p className="text-xs text-gray-500 mt-1">{meeting.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                            {meeting.status}
                          </span>
                          {meeting.meeting_url && meeting.status === 'confirmed' && (
                            <div className="mt-2">
                              <a
                                href={meeting.meeting_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 text-xs"
                              >
                                Join Meeting
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Upcoming Meetings</h3>
              <p className="text-gray-600">
                Select a date from the calendar to schedule a meeting with {consultant.full_name}.
              </p>
            </div>
          )}
        </div>

        {/* Pricing Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Meeting Pricing</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="text-2xl font-bold text-green-600 mb-1">$150</div>
              <div className="text-sm text-green-800">30 Minutes</div>
              <div className="text-xs text-green-700 mt-1">Quick consultation</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="text-2xl font-bold text-blue-600 mb-1">$250</div>
              <div className="text-sm text-blue-800">60 Minutes</div>
              <div className="text-xs text-blue-700 mt-1">Standard meeting</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="text-2xl font-bold text-purple-600 mb-1">$400</div>
              <div className="text-sm text-purple-800">120 Minutes</div>
              <div className="text-xs text-purple-700 mt-1">Extended consultation</div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">
            All payments are processed securely through Stripe. You'll receive meeting details after payment.
          </p>
        </div>
      </div>
    </>
  );
};

export default ClientCalendar;