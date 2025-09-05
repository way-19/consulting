import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { supabase } from '@consulting19/shared/lib/supabase';
import {
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  Users,
  Briefcase,
  CheckCircle,
  AlertTriangle,
  Plus,
  ChevronLeft,
  ChevronRight,
  Settings,
  Save,
  User,
  Building,
  MessageSquare,
  Zap,
  Star,
  X,
  CreditCard,
  MapPin,
  Globe,
  Phone,
  Video,
  Search,
  Filter
} from 'lucide-react';

// --- Type Definitions ---
interface Department {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  is_active: boolean;
  sort_order: number;
}

interface Consultant {
  id: string;
  full_name: string;
  email: string;
  timezone: string;
  price_per_hour: number;
  currency: string;
}

interface AvailabilitySlot {
  id: string;
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  day_of_week: string;
  price_per_hour: number;
  currency: string;
}

interface BlockedTime {
  id: string;
  start_datetime: string;
  end_datetime: string;
}

interface Meeting {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  meeting_type: string;
  status: string;
  price_paid: number;
  currency: string;
  client_id: string;
  consultant_id: string;
  department_id: string;
  consultant?: {
    full_name: string;
  };
  department?: {
    name: string;
    color: string;
    icon: string;
  };
}

interface UserPreference {
  id: string;
  setting_key: string;
  setting_value: any;
}

// --- Helper Functions ---
const getDepartmentIcon = (iconName: string) => {
  switch (iconName) {
    case 'Building': return <Building className="w-5 h-5" />;
    case 'Briefcase': return <Briefcase className="w-5 h-5" />;
    case 'DollarSign': return <DollarSign className="w-5 h-5" />;
    case 'Shield': return <Zap className="w-5 h-5" />;
    case 'Users': return <Users className="w-5 h-5" />;
    case 'Globe': return <Globe className="w-5 h-5" />;
    case 'Phone': return <Phone className="w-5 h-5" />;
    case 'Video': return <Video className="w-5 h-5" />;
    default: return <Briefcase className="w-5 h-5" />;
  }
};

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':');
  const hour24 = parseInt(hours, 10);
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  return `${hour12}:${minutes} ${ampm}`;
};

const getDayName = (date: Date) => {
  return date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
};

const getStartOfWeek = (date: Date) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const startOfWeek = new Date(date.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
};

const getEndOfWeek = (date: Date) => {
  const endOfWeek = new Date(date);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  return endOfWeek;
};

const generateTimeSlots = (
  date: Date,
  availability: AvailabilitySlot[],
  blockedTimes: BlockedTime[],
  slotDuration: number,
  consultantPricePerHour: number,
  consultantCurrency: string
) => {
  const slots = [];
  const dayName = getDayName(date);
  const availableDaySlots = availability.filter(s => s.day_of_week === dayName);

  availableDaySlots.forEach(avail => {
    const [startHour, startMinute] = avail.start_time.split(':').map(Number);
    const [endHour, endMinute] = avail.end_time.split(':').map(Number);

    let currentSlotStart = new Date(date);
    currentSlotStart.setHours(startHour, startMinute, 0, 0);

    let currentSlotEnd = new Date(date);
    currentSlotEnd.setHours(endHour, endMinute, 0, 0);

    while (currentSlotStart.getTime() + slotDuration * 60 * 1000 <= currentSlotEnd.getTime()) {
      const slotEnd = new Date(currentSlotStart.getTime() + slotDuration * 60 * 1000);
      const isBlocked = blockedTimes.some(block => {
        const blockStart = new Date(block.start_datetime);
        const blockEnd = new Date(block.end_datetime);
        return (currentSlotStart < blockEnd && slotEnd > blockStart);
      });

      if (!isBlocked) {
        const price = (consultantPricePerHour / 60) * slotDuration;
        slots.push({
          start: new Date(currentSlotStart),
          end: slotEnd,
          price: price,
          currency: consultantCurrency,
          isPremium: price >= 100
        });
      }
      currentSlotStart = slotEnd;
    }
  });
  return slots;
};

const ClientCalendar = () => {
  const { user, profile } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedConsultant, setSelectedConsultant] = useState<string | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date; price: number; currency: string; isPremium: boolean } | null>(null);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDescription, setMeetingDescription] = useState('');
  const [meetingType, setMeetingType] = useState('video');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [userPreferences, setUserPreferences] = useState<any>({});
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [tempPreferences, setTempPreferences] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  const slotDurationOptions = [30, 60, 90, 120];
  const defaultSlotDuration = userPreferences.default_slot_duration || 60;

  // --- Fetch Functions ---
  const fetchDepartments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching departments:', error);
        return;
      }
      
      setDepartments(data || []);
    } catch (err) {
      console.error('Unexpected error fetching departments:', err);
    }
  }, []);

  const fetchConsultants = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          id, 
          full_name, 
          email, 
          timezone,
          consultant_availability(price_per_hour, currency)
        `)
        .eq('role', 'consultant')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching consultants:', error);
        return;
      }

      const mappedConsultants = (data || []).map((c: any) => ({
        id: c.id,
        full_name: c.full_name,
        email: c.email,
        timezone: c.timezone || 'UTC',
        price_per_hour: c.consultant_availability?.[0]?.price_per_hour || 150,
        currency: c.consultant_availability?.[0]?.currency || 'USD',
      }));
      
      setConsultants(mappedConsultants);
    } catch (err) {
      console.error('Unexpected error fetching consultants:', err);
    }
  }, []);

  const fetchConsultantAvailability = useCallback(async () => {
    if (!selectedConsultant) return;
    
    try {
      const { data: availabilityData, error: availError } = await supabase
        .from('consultant_availability')
        .select('*')
        .eq('consultant_id', selectedConsultant)
        .eq('is_active', true);

      const { data: blockedData, error: blockedError } = await supabase
        .from('consultant_blocked_times')
        .select('*')
        .eq('consultant_id', selectedConsultant)
        .eq('is_active', true)
        .gte('start_datetime', currentWeekStart.toISOString())
        .lte('end_datetime', getEndOfWeek(new Date(currentWeekStart)).toISOString());

      if (availError) {
        console.error('Error fetching availability:', availError);
      } else {
        setAvailabilitySlots(availabilityData || []);
      }
      
      if (blockedError) {
        console.error('Error fetching blocked times:', blockedError);
      } else {
        setBlockedTimes(blockedData || []);
      }
    } catch (err) {
      console.error('Unexpected error fetching availability:', err);
    }
  }, [selectedConsultant, currentWeekStart]);

  const fetchMeetings = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      // Get client ID first
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (!clientData) return;

      const { data, error } = await supabase
        .from('meetings')
        .select(`
          *,
          consultant:user_profiles(full_name),
          department:departments(name, color, icon)
        `)
        .eq('client_id', clientData.id)
        .gte('start_time', currentWeekStart.toISOString())
        .lte('end_time', getEndOfWeek(new Date(currentWeekStart)).toISOString())
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching meetings:', error);
        return;
      }
      
      setMeetings(data || []);
    } catch (err) {
      console.error('Unexpected error fetching meetings:', err);
    }
  }, [user?.id, currentWeekStart]);

  const fetchUserPreferences = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user preferences:', error);
        return;
      }

      const prefs: any = {};
      (data || []).forEach(p => {
        prefs[p.setting_key] = p.setting_value;
      });
      
      setUserPreferences(prefs);
      setTempPreferences(prefs);
      
      if (prefs.preferred_consultant_id) {
        setSelectedConsultant(prefs.preferred_consultant_id);
      }
      if (prefs.preferred_department_id) {
        setSelectedDepartment(prefs.preferred_department_id);
      }
    } catch (err) {
      console.error('Unexpected error fetching preferences:', err);
    }
  }, [user?.id]);

  // --- Event Handlers ---
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === '' ? null : e.target.value;
    setSelectedDepartment(value);
    setSelectedConsultant(null);
  };

  const handleConsultantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === '' ? null : e.target.value;
    setSelectedConsultant(value);
  };

  const handleWeekChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(getStartOfWeek(newDate));
  };

  const handleSlotClick = (slot: any) => {
    setSelectedSlot(slot);
    setMeetingTitle('');
    setMeetingDescription('');
    setMeetingType('video');
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async () => {
    if (!selectedSlot || !selectedConsultant || !user?.id) {
      alert('Missing booking details.');
      return;
    }

    try {
      setBookingLoading(true);

      // Get client ID
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (!clientData) {
        throw new Error('Client record not found');
      }

      const consultantInfo = consultants.find(c => c.id === selectedConsultant);
      if (!consultantInfo) throw new Error('Consultant not found.');

      const meetingDurationMinutes = (selectedSlot.end.getTime() - selectedSlot.start.getTime()) / (1000 * 60);
      const calculatedPrice = (consultantInfo.price_per_hour / 60) * meetingDurationMinutes;

      // Create meeting record
      const { data: newMeeting, error: meetingError } = await supabase
        .from('meetings')
        .insert({
          client_id: clientData.id,
          consultant_id: selectedConsultant,
          department_id: selectedDepartment,
          title: meetingTitle || 'Consultation Meeting',
          description: meetingDescription || '',
          start_time: selectedSlot.start.toISOString(),
          end_time: selectedSlot.end.toISOString(),
          meeting_type: meetingType,
          status: calculatedPrice > 0 ? 'scheduled' : 'confirmed',
          price_paid: calculatedPrice,
          currency: consultantInfo.currency,
        })
        .select()
        .single();

      if (meetingError) throw meetingError;

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user.id,
          action_type: 'meeting_scheduled',
          description: `Scheduled meeting: ${meetingTitle || 'Consultation'}`,
          payload: {
            meeting_id: newMeeting.id,
            consultant_id: selectedConsultant,
            department_id: selectedDepartment,
            amount: calculatedPrice,
            currency: consultantInfo.currency
          }
        });

      if (calculatedPrice > 0) {
        // Initiate Stripe Checkout for paid meetings
        const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
          'create-stripe-checkout',
          {
            body: {
              meeting_id: newMeeting.id,
              amount: Math.round(calculatedPrice * 100),
              currency: consultantInfo.currency.toLowerCase(),
              title: meetingTitle || 'Consultation Meeting',
              description: meetingDescription || `${meetingDurationMinutes}-minute consultation with ${consultantInfo.full_name}`,
              success_url: `${window.location.origin}/calendar?payment=success&meetingId=${newMeeting.id}`,
              cancel_url: `${window.location.origin}/calendar?payment=cancelled&meetingId=${newMeeting.id}`
            }
          }
        );

        if (checkoutError) throw checkoutError;

        if (checkoutData?.url) {
          window.location.href = checkoutData.url;
        }
      } else {
        alert('Free meeting booked successfully!');
        setShowBookingModal(false);
        fetchMeetings();
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      alert(`Failed to book meeting: ${error.message || 'Unknown error'}`);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!user?.id) return;
    
    try {
      setBookingLoading(true);
      
      const updates = Object.keys(tempPreferences).map(key => ({
        user_id: user.id,
        setting_key: key,
        setting_value: tempPreferences[key],
      }));

      const { error } = await supabase
        .from('user_preferences')
        .upsert(updates, { onConflict: 'user_id,setting_key' });

      if (error) throw error;

      setUserPreferences(tempPreferences);
      alert('Preferences saved successfully!');
      setShowPreferencesModal(false);
      
      // Apply preference changes immediately
      if (tempPreferences.preferred_consultant_id) {
        setSelectedConsultant(tempPreferences.preferred_consultant_id);
      }
      if (tempPreferences.preferred_department_id) {
        setSelectedDepartment(tempPreferences.preferred_department_id);
      }
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      alert(`Failed to save preferences: ${error.message || 'Unknown error'}`);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleQuickPreset = (preset: string) => {
    switch (preset) {
      case 'morning_person':
        setTempPreferences(prev => ({
          ...prev,
          preferred_time_range: 'morning',
          default_slot_duration: 60,
          reminder_minutes: 30
        }));
        break;
      case 'busy_professional':
        setTempPreferences(prev => ({
          ...prev,
          default_slot_duration: 30,
          preferred_meeting_type: 'video',
          auto_reschedule_enabled: true
        }));
        break;
      case 'detailed_discussions':
        setTempPreferences(prev => ({
          ...prev,
          default_slot_duration: 120,
          preferred_meeting_type: 'in_person',
          reminder_minutes: 60
        }));
        break;
    }
  };

  // --- Effects ---
  useEffect(() => {
    if (user && profile) {
      setLoading(true);
      Promise.all([
        fetchDepartments(),
        fetchConsultants(),
        fetchUserPreferences(),
      ]).then(() => setLoading(false));
    }
  }, [user, profile, fetchDepartments, fetchConsultants, fetchUserPreferences]);

  useEffect(() => {
    fetchConsultantAvailability();
    fetchMeetings();
  }, [selectedConsultant, currentWeekStart, fetchConsultantAvailability, fetchMeetings]);

  // --- Render Calendar Grid ---
  const daysOfWeek = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(currentWeekStart);
    date.setDate(currentWeekStart.getDate() + i);
    return date;
  });

  const allAvailableSlots = selectedConsultant ? daysOfWeek.flatMap(date => {
    const consultantInfo = consultants.find(c => c.id === selectedConsultant);
    if (!consultantInfo) return [];
    return generateTimeSlots(
      date,
      availabilitySlots,
      blockedTimes,
      userPreferences.default_slot_duration || defaultSlotDuration,
      consultantInfo.price_per_hour,
      consultantInfo.currency
    );
  }) : [];

  const filteredConsultants = consultants.filter(consultant =>
    consultant.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMeetingStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'scheduled': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      case 'rescheduled': return 'bg-purple-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const todayMeetings = meetings.filter(meeting => {
    const meetingDate = new Date(meeting.start_time);
    const today = new Date();
    return meetingDate.toDateString() === today.toDateString();
  });

  const upcomingMeetings = meetings.filter(meeting => {
    const meetingDate = new Date(meeting.start_time);
    const today = new Date();
    return meetingDate > today;
  }).slice(0, 3);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Calendar & Meetings - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
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

      <div className="space-y-8">
        {/* Header with Quick Stats */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <CalendarIcon className="w-8 h-8 mr-3 text-blue-600" />
                Calendar & Meetings
              </h1>
              <p className="text-gray-600 text-lg mt-2">Schedule consultations with expert advisors</p>
            </div>
            <button
              onClick={() => setShowPreferencesModal(true)}
              className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/40 text-gray-700 rounded-xl hover:bg-white transition-colors shadow-lg"
            >
              <Settings className="w-4 h-4 mr-2" />
              Preferences
            </button>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/40">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{todayMeetings.length}</div>
                  <div className="text-sm text-gray-600">Today's Meetings</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/40">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{upcomingMeetings.length}</div>
                  <div className="text-sm text-gray-600">Upcoming This Week</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/40">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{consultants.length}</div>
                  <div className="text-sm text-gray-600">Available Consultants</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Department Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Department</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {departments.map(dept => (
              <button
                key={dept.id}
                onClick={() => {
                  setSelectedDepartment(selectedDepartment === dept.id ? null : dept.id);
                  setSelectedConsultant(null);
                }}
                className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                  selectedDepartment === dept.id
                    ? 'border-blue-300 bg-blue-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: dept.color + '20', color: dept.color }}
                  >
                    {getDepartmentIcon(dept.icon)}
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-left">{dept.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Consultant Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Consultant</h2>
          
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search consultants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredConsultants.map(consultant => (
              <button
                key={consultant.id}
                onClick={() => setSelectedConsultant(selectedConsultant === consultant.id ? null : consultant.id)}
                className={`p-4 border-2 rounded-xl transition-all duration-200 text-left ${
                  selectedConsultant === consultant.id
                    ? 'border-blue-300 bg-blue-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{consultant.full_name}</h3>
                    <p className="text-sm text-gray-600">{consultant.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rate: ${consultant.price_per_hour}/hr</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {consultant.timezone}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Week Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => handleWeekChange('prev')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {currentWeekStart.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })} - {getEndOfWeek(new Date(currentWeekStart)).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
            <button
              onClick={() => handleWeekChange('next')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {!selectedConsultant ? (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Consultant</h3>
              <p className="text-gray-600">Choose a consultant above to view their availability and book a meeting.</p>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-4">
              {daysOfWeek.map(date => {
                const daySlots = allAvailableSlots.filter(slot => 
                  slot.start.toDateString() === date.toDateString()
                );
                const dayMeetings = meetings.filter(meeting => {
                  const meetingDate = new Date(meeting.start_time);
                  return meetingDate.toDateString() === date.toDateString();
                });
                const isToday = date.toDateString() === new Date().toDateString();

                return (
                  <div key={date.toISOString()} className="flex flex-col">
                    <div className={`text-center p-3 rounded-lg mb-3 ${
                      isToday ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50'
                    }`}>
                      <div className="text-sm font-medium text-gray-600">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className={`text-2xl font-bold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                        {date.getDate()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {date.toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {/* Existing Meetings */}
                      {dayMeetings.map(meeting => (
                        <div
                          key={meeting.id}
                          className={`p-2 rounded-lg text-xs text-white ${getMeetingStatusColor(meeting.status)}`}
                        >
                          <div className="font-medium truncate">{meeting.title}</div>
                          <div className="opacity-75">
                            {formatTime(new Date(meeting.start_time).toTimeString().substring(0, 5))}
                          </div>
                        </div>
                      ))}

                      {/* Available Slots */}
                      {daySlots.map((slot, index) => {
                        const isPastSlot = new Date() > slot.start;
                        
                        return (
                          <button
                            key={index}
                            onClick={() => !isPastSlot && handleSlotClick(slot)}
                            disabled={isPastSlot}
                            className={`w-full p-2 rounded-lg text-xs font-medium text-center transition-all duration-200 ${
                              isPastSlot
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : slot.isPremium
                                ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-300 hover:from-purple-200 hover:to-pink-200 shadow-md'
                                : 'bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-200'
                            }`}
                          >
                            <div>{formatTime(slot.start.toTimeString().substring(0, 5))}</div>
                            <div>{formatTime(slot.end.toTimeString().substring(0, 5))}</div>
                            {slot.price > 0 && (
                              <div className="mt-1 font-bold">
                                ${slot.price.toFixed(2)}
                                {slot.isPremium && <Star className="w-3 h-3 inline-block ml-1 fill-current" />}
                              </div>
                            )}
                            {slot.price === 0 && (
                              <div className="mt-1 text-green-600 font-bold">FREE</div>
                            )}
                          </button>
                        );
                      })}

                      {daySlots.length === 0 && dayMeetings.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <div className="text-2xl mb-2">🚫</div>
                          <div className="text-xs">Not available</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Meetings Summary */}
        {upcomingMeetings.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Meetings</h2>
            <div className="space-y-3">
              {upcomingMeetings.map(meeting => (
                <div key={meeting.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getMeetingStatusColor(meeting.status)}`}></div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                      <div className="text-sm text-gray-600">
                        {new Date(meeting.start_time).toLocaleString()} with {meeting.consultant?.full_name}
                      </div>
                      {meeting.department && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                          {getDepartmentIcon(meeting.department.icon)}
                          <span>{meeting.department.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getMeetingStatusColor(meeting.status)}`}>
                      {meeting.status}
                    </div>
                    {meeting.price_paid > 0 && (
                      <div className="text-sm font-bold text-green-600 mt-1">
                        ${meeting.price_paid.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Meeting Booking Modal */}
        {showBookingModal && selectedSlot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Book Meeting</h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CalendarIcon className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Meeting Details</span>
                  </div>
                  <div className="text-sm text-blue-800">
                    <div><strong>Date:</strong> {selectedSlot.start.toLocaleDateString()}</div>
                    <div><strong>Time:</strong> {formatTime(selectedSlot.start.toTimeString().substring(0, 5))} - {formatTime(selectedSlot.end.toTimeString().substring(0, 5))}</div>
                    <div><strong>Duration:</strong> {Math.round((selectedSlot.end.getTime() - selectedSlot.start.getTime()) / (1000 * 60))} minutes</div>
                    <div><strong>Cost:</strong> {selectedSlot.price === 0 ? 'FREE' : `$${selectedSlot.price.toFixed(2)} ${selectedSlot.currency}`}</div>
                    {selectedSlot.isPremium && (
                      <div className="flex items-center space-x-1 text-purple-600 mt-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="font-bold text-xs">PREMIUM SLOT</span>
                      </div>
                    )}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Initial Business Consultation"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Type
                  </label>
                  <select
                    value={meetingType}
                    onChange={(e) => setMeetingType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="video">📹 Video Call</option>
                    <option value="phone">📞 Phone Call</option>
                    <option value="in_person">🏢 In-Person Meeting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Agenda (Optional)
                  </label>
                  <textarea
                    value={meetingDescription}
                    onChange={(e) => setMeetingDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Briefly describe what you'd like to discuss..."
                  />
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
                  onClick={handleBookingSubmit}
                  disabled={bookingLoading || !meetingTitle.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {bookingLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                  ) : selectedSlot.price > 0 ? (
                    <>
                      <CreditCard className="w-4 h-4 mr-2 inline" />
                      Pay & Book (${selectedSlot.price.toFixed(2)})
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2 inline" />
                      Book Free Meeting
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preferences Modal */}
        {showPreferencesModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Calendar Preferences</h2>
                <button
                  onClick={() => setShowPreferencesModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Presets */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Presets</h3>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'morning_person', name: '🌅 Morning Person', desc: 'Prefer early meetings, 60min slots' },
                    { id: 'busy_professional', name: '⚡ Busy Professional', desc: 'Quick 30min slots, video preferred' },
                    { id: 'detailed_discussions', name: '💬 Detailed Discussions', desc: '120min slots, in-person preferred' }
                  ].map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => handleQuickPreset(preset.id)}
                      className="text-left p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{preset.name}</div>
                      <div className="text-sm text-gray-600">{preset.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Meeting Duration
                  </label>
                  <select
                    value={tempPreferences.default_slot_duration || defaultSlotDuration}
                    onChange={(e) => setTempPreferences(prev => ({ ...prev, default_slot_duration: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {slotDurationOptions.map(duration => (
                      <option key={duration} value={duration}>{duration} minutes</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Meeting Type
                  </label>
                  <select
                    value={tempPreferences.preferred_meeting_type || 'video'}
                    onChange={(e) => setTempPreferences(prev => ({ ...prev, preferred_meeting_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="video">📹 Video Call</option>
                    <option value="phone">📞 Phone Call</option>
                    <option value="in_person">🏢 In-Person</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Consultant
                  </label>
                  <select
                    value={tempPreferences.preferred_consultant_id || ''}
                    onChange={(e) => setTempPreferences(prev => ({ ...prev, preferred_consultant_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">No preference</option>
                    {consultants.map(cons => (
                      <option key={cons.id} value={cons.id}>{cons.full_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reminder (minutes before)
                  </label>
                  <select
                    value={tempPreferences.reminder_minutes || 15}
                    onChange={(e) => setTempPreferences(prev => ({ ...prev, reminder_minutes: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={5}>5 minutes</option>
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={1440}>1 day</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => setShowPreferencesModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePreferences}
                  disabled={bookingLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {bookingLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2 inline" />
                      Save Preferences
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
