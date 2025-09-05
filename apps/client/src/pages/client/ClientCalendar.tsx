import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Plus, 
  Video, 
  Phone,
  MessageSquare,
  MapPin,
  Globe,
  ChevronLeft,
  ChevronRight,
  Settings,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  X,
  Edit,
  Trash2,
  CalendarCheck,
  CalendarX,
  Bell,
  Link as LinkIcon
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface Meeting {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  meeting_type: 'video' | 'phone' | 'in_person';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  meeting_url: string | null;
  notes: string | null;
  consultant: {
    full_name: string;
    timezone: string;
    metadata: any;
  };
  created_at: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  consultant_timezone: string;
}

const ClientCalendar = () => {
  const { user, profile } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [consultant, setConsultant] = useState<any>(null);
  const [bookingForm, setBookingForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'video' as 'video' | 'phone' | 'in_person',
    duration: 60
  });
  const [submitting, setSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  useEffect(() => {
    if (user && profile) {
      fetchConsultantAndMeetings();
    }
  }, [user, profile]);

  const fetchConsultantAndMeetings = async () => {
    try {
      setLoading(true);
      
      // Get client and consultant data
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (clientError || !clientData?.assigned_consultant_id) {
        console.error('Client/consultant fetch error:', clientError);
        return;
      }

      // Get consultant details
      const { data: consultantData, error: consultantError } = await supabase
        .from('user_profiles')
        .select('id, full_name, timezone, metadata')
        .eq('id', clientData.assigned_consultant_id)
        .eq('role', 'consultant')
        .single();

      if (consultantError || !consultantData) {
        console.error('Consultant details fetch error:', consultantError);
        return;
      }

      setConsultant(consultantData);

      // Fetch meetings (using a mock structure since we don't have meetings table yet)
      // In real implementation, you'd fetch from a meetings table
      setMeetings([
        {
          id: '1',
          title: 'Initial Consultation',
          description: 'Discuss business expansion plans and requirements',
          start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
          end_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // +1 hour
          meeting_type: 'video',
          status: 'confirmed',
          meeting_url: 'https://meet.google.com/abc-defg-hij',
          notes: null,
          consultant: consultantData,
          created_at: new Date().toISOString()
        }
      ]);

      generateAvailableSlots(consultantData);
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateAvailableSlots = (consultantData: any) => {
    // Generate available time slots for the next 7 days
    const slots: TimeSlot[] = [];
    const today = new Date();
    
    for (let day = 1; day <= 7; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() + day);
      
      // Skip weekends for this demo
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      // Generate morning and afternoon slots
      ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'].forEach(time => {
        slots.push({
          time: `${date.toISOString().split('T')[0]}T${time}:00.000Z`,
          available: Math.random() > 0.3, // 70% availability chance
          consultant_timezone: consultantData.timezone || 'UTC'
        });
      });
    }
    
    setAvailableSlots(slots);
  };

  const handleBookMeeting = async () => {
    if (!bookingForm.title.trim() || !bookingForm.date || !bookingForm.time) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);

      // Get client data
      const { data: clientData } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .single();

      if (!clientData) {
        throw new Error('Client data not found');
      }

      // Create meeting start and end times
      const startTime = new Date(`${bookingForm.date}T${bookingForm.time}`);
      const endTime = new Date(startTime.getTime() + bookingForm.duration * 60000);

      // In real implementation, you would insert into meetings table
      // For now, we'll simulate the creation and add to local state
      const newMeeting: Meeting = {
        id: Date.now().toString(),
        title: bookingForm.title,
        description: bookingForm.description,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        meeting_type: bookingForm.type,
        status: 'scheduled',
        meeting_url: bookingForm.type === 'video' ? 'https://meet.google.com/new-meeting' : null,
        notes: null,
        consultant: consultant,
        created_at: new Date().toISOString()
      };

      setMeetings(prev => [...prev, newMeeting]);

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'meeting_scheduled',
          description: `Scheduled meeting: ${bookingForm.title}`,
          payload: {
            meeting_title: bookingForm.title,
            meeting_type: bookingForm.type,
            start_time: startTime.toISOString(),
            consultant_id: clientData.assigned_consultant_id
          }
        });

      // Notify consultant
      if (clientData.assigned_consultant_id) {
        await supabase.functions.invoke('notify', {
          body: {
            recipient_id: clientData.assigned_consultant_id,
            type: 'meeting_scheduled',
            payload: {
              client_name: profile?.full_name,
              meeting_title: bookingForm.title,
              meeting_time: startTime.toISOString(),
              meeting_type: bookingForm.type
            },
            email_notification: true
          }
        });
      }

      alert('Meeting scheduled successfully!');
      setShowBookingModal(false);
      setBookingForm({
        title: '',
        description: '',
        date: '',
        time: '',
        type: 'video',
        duration: 60
      });
    } catch (err) {
      console.error('Meeting booking error:', err);
      alert('Failed to schedule meeting. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getNextSevenDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    
    return days;
  };

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'in_person': return <MapPin className="w-4 h-4" />;
      default: return <CalendarIcon className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const upcomingMeetings = meetings.filter(m => 
    new Date(m.start_time) > new Date() && 
    ['scheduled', 'confirmed'].includes(m.status)
  );
  
  const pastMeetings = meetings.filter(m => 
    new Date(m.start_time) <= new Date() || 
    ['completed', 'cancelled'].includes(m.status)
  );

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Calendar - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
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
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-6 rounded-lg text-center">
            <CalendarIcon className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">No Consultant Assigned</h3>
            <p className="text-sm">
              You need to be assigned to a consultant to schedule meetings.
            </p>
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
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendar & Meetings</h1>
            <p className="text-gray-600 mt-1">Schedule and manage meetings with your consultant</p>
          </div>
          <button 
            onClick={() => setShowBookingModal(true)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule Meeting
          </button>
        </div>

        {/* Calendar Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Upcoming Meetings</p>
                <p className="text-3xl font-bold text-blue-900">{upcomingMeetings.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <CalendarIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Total Meetings</p>
                <p className="text-3xl font-bold text-green-900">{meetings.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Your Consultant</p>
                <p className="text-lg font-bold text-purple-900">{consultant.full_name}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Calendar View */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2 text-blue-500" />
              This Week's Overview
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Consultant timezone: {consultant.timezone || 'UTC'} • Your timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-7 gap-2 mb-6">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-gray-500 p-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {getNextSevenDays().map((date, index) => {
                const dayMeetings = meetings.filter(m => {
                  const meetingDate = new Date(m.start_time);
                  return meetingDate.toDateString() === date.toDateString();
                });

                return (
                  <div
                    key={index}
                    className={`min-h-[80px] p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      date.toDateString() === new Date().toDateString()
                        ? 'bg-blue-50 border-blue-300 shadow-md'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedDate(date);
                      if (dayMeetings.length === 0) {
                        setBookingForm(prev => ({ ...prev, date: date.toISOString().split('T')[0] }));
                        setShowBookingModal(true);
                      }
                    }}
                  >
                    <div className="text-center mb-2">
                      <span className={`text-lg font-bold ${
                        date.toDateString() === new Date().toDateString() 
                          ? 'text-blue-600' 
                          : 'text-gray-900'
                      }`}>
                        {date.getDate()}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      {dayMeetings.slice(0, 2).map((meeting) => (
                        <div
                          key={meeting.id}
                          className="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate"
                        >
                          {new Date(meeting.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      ))}
                      {dayMeetings.length > 2 && (
                        <div className="text-xs text-gray-500">+{dayMeetings.length - 2} more</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Meetings */}
        {upcomingMeetings.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-blue-500" />
                Upcoming Meetings ({upcomingMeetings.length})
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {upcomingMeetings.map((meeting) => {
                const { date, time } = formatDateTime(meeting.start_time);
                const timeUntil = Math.ceil((new Date(meeting.start_time).getTime() - new Date().getTime()) / (1000 * 60 * 60));
                
                return (
                  <div key={meeting.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${
                          meeting.meeting_type === 'video' ? 'bg-blue-100' :
                          meeting.meeting_type === 'phone' ? 'bg-green-100' : 'bg-purple-100'
                        }`}>
                          {getMeetingTypeIcon(meeting.meeting_type)}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{meeting.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{meeting.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                            <div className="flex items-center">
                              <CalendarIcon className="w-4 h-4 mr-1" />
                              <span>{date}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{time}</span>
                            </div>
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              <span>{meeting.consultant.full_name}</span>
                            </div>
                            {timeUntil <= 24 && (
                              <div className="flex items-center text-orange-600 font-medium">
                                <Bell className="w-4 h-4 mr-1" />
                                <span>In {timeUntil}h</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                          {meeting.status}
                        </span>
                        
                        <div className="flex items-center space-x-1">
                          {meeting.meeting_url && (
                            <button 
                              onClick={() => window.open(meeting.meeting_url!, '_blank')}
                              className="inline-flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              {getMeetingTypeIcon(meeting.meeting_type)}
                              <span className="ml-1">Join</span>
                            </button>
                          )}
                          <button className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Past Meetings */}
        {pastMeetings.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <CalendarCheck className="w-5 h-5 mr-2 text-gray-500" />
                Meeting History ({pastMeetings.length})
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
              {pastMeetings.map((meeting) => {
                const { date, time } = formatDateTime(meeting.start_time);
                
                return (
                  <div key={meeting.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          {getMeetingTypeIcon(meeting.meeting_type)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{meeting.title}</h4>
                          <div className="flex items-center space-x-3 text-sm text-gray-500">
                            <span>{date}</span>
                            <span>{time}</span>
                            <span className="capitalize">{meeting.meeting_type}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                        {meeting.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* No Meetings State */}
        {meetings.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CalendarIcon className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Schedule Your First Meeting</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Connect with {consultant.full_name} to discuss your business expansion plans and get expert guidance.
            </p>
            <button 
              onClick={() => setShowBookingModal(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Schedule First Meeting
            </button>
          </div>
        )}

        {/* Meeting Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Schedule Meeting</h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meeting Title *
                    </label>
                    <input
                      type="text"
                      value={bookingForm.title}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Business Strategy Discussion"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={bookingForm.description}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="What would you like to discuss?"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        value={bookingForm.date}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time *
                      </label>
                      <select
                        value={bookingForm.time}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select time...</option>
                        {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'].map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meeting Type
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { type: 'video', label: 'Video Call', icon: Video, color: 'blue' },
                        { type: 'phone', label: 'Phone Call', icon: Phone, color: 'green' },
                        { type: 'in_person', label: 'In Person', icon: MapPin, color: 'purple' }
                      ].map(({ type, label, icon: Icon, color }) => (
                        <button
                          key={type}
                          onClick={() => setBookingForm(prev => ({ ...prev, type: type as any }))}
                          className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                            bookingForm.type === type
                              ? `border-${color}-500 bg-${color}-50`
                              : 'border-gray-200 bg-white hover:bg-gray-50'
                          }`}
                        >
                          <Icon className={`w-6 h-6 mx-auto mb-2 ${
                            bookingForm.type === type ? `text-${color}-600` : 'text-gray-400'
                          }`} />
                          <div className={`text-sm font-medium ${
                            bookingForm.type === type ? `text-${color}-900` : 'text-gray-700'
                          }`}>
                            {label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <select
                      value={bookingForm.duration}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, duration: Number(e.target.value) }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>
                </div>

                {/* Available Slots Preview */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Available Times</h3>
                  {bookingForm.date ? (
                    <div className="space-y-2">
                      {availableSlots
                        .filter(slot => slot.time.startsWith(bookingForm.date))
                        .slice(0, 6)
                        .map((slot, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg transition-colors cursor-pointer ${
                            slot.available
                              ? 'bg-green-50 border border-green-200 hover:bg-green-100'
                              : 'bg-gray-100 border border-gray-200 cursor-not-allowed'
                          }`}
                          onClick={() => {
                            if (slot.available) {
                              const time = new Date(slot.time).toTimeString().slice(0, 5);
                              setBookingForm(prev => ({ ...prev, time }));
                            }
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`font-medium ${
                              slot.available ? 'text-green-800' : 'text-gray-500'
                            }`}>
                              {new Date(slot.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              slot.available 
                                ? 'bg-green-200 text-green-800' 
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              {slot.available ? 'Available' : 'Busy'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">Select a date to view available times</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookMeeting}
                  disabled={submitting || !bookingForm.title.trim() || !bookingForm.date || !bookingForm.time}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Scheduling...
                    </>
                  ) : (
                    <>
                      <CalendarIcon className="w-4 h-4 mr-2 inline" />
                      Schedule Meeting
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Calendar Integration Notice */}
        <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 rounded-2xl border border-indigo-200 p-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <LinkIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-indigo-900 mb-2">Calendar Integration</h3>
              <p className="text-indigo-800 mb-4">
                Sync your meetings with Google Calendar, Outlook, or Apple Calendar for seamless scheduling.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button className="flex items-center justify-center px-4 py-2 bg-white border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
                  <span className="text-lg mr-2">📅</span>
                  <span className="font-medium text-indigo-900">Google Calendar</span>
                </button>
                <button className="flex items-center justify-center px-4 py-2 bg-white border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
                  <span className="text-lg mr-2">🗓️</span>
                  <span className="font-medium text-indigo-900">Outlook</span>
                </button>
                <button className="flex items-center justify-center px-4 py-2 bg-white border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
                  <span className="text-lg mr-2">🍎</span>
                  <span className="font-medium text-indigo-900">Apple Calendar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientCalendar;