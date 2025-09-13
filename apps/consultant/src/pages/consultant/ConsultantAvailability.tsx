import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Calendar,
  DollarSign,
  Globe,
  CheckCircle,
  AlertTriangle,
  User
} from 'lucide-react';
import { supabase } from '@consulting19/shared/src/lib/supabase';

interface AvailabilitySlot {
  id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  timezone: string;
  slot_duration_minutes: number;
  price_per_hour: number;
  currency: string;
  is_active: boolean;
}

interface BlockedTime {
  id: string;
  start_datetime: string;
  end_datetime: string;
  reason: string;
  is_active: boolean;
}

const ConsultantAvailability = () => {
  const { user, profile } = useAuth();
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null);
  const [saving, setSaving] = useState(false);

  const [slotFormData, setSlotFormData] = useState({
    day_of_week: 'monday',
    start_time: '09:00',
    end_time: '17:00',
    is_available: true,
    timezone: 'UTC',
    slot_duration_minutes: 60,
    price_per_hour: 150,
    currency: 'USD'
  });

  const [blockFormData, setBlockFormData] = useState({
    start_datetime: '',
    end_datetime: '',
    reason: ''
  });

  const daysOfWeek = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  const timezones = [
    'UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 
    'Europe/Berlin', 'Europe/Istanbul', 'Asia/Dubai', 'Asia/Singapore'
  ];

  useEffect(() => {
    if (user && profile) {
      fetchAvailabilityData();
    }
  }, [user, profile]);

  const fetchAvailabilityData = async () => {
    try {
      setLoading(true);
      
      // Fetch availability slots
      const { data: availabilityData, error: availabilityError } = await supabase
        .from('consultant_availability')
        .select('*')
        .eq('consultant_id', user?.id)
        .order('day_of_week')
        .order('start_time');

      if (availabilityError) {
        console.error('Error fetching availability:', availabilityError);
      } else {
        setAvailability(availabilityData || []);
      }

      // Fetch blocked times
      const { data: blockedData, error: blockedError } = await supabase
        .from('consultant_blocked_times')
        .select('*')
        .eq('consultant_id', user?.id)
        .eq('is_active', true)
        .order('start_datetime');

      if (blockedError) {
        console.error('Error fetching blocked times:', blockedError);
      } else {
        setBlockedTimes(blockedData || []);
      }

    } catch (err) {
      console.error('Error fetching availability data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSlot = async () => {
    try {
      setSaving(true);

      const slotData = {
        consultant_id: user?.id,
        day_of_week: slotFormData.day_of_week,
        start_time: slotFormData.start_time,
        end_time: slotFormData.end_time,
        is_available: slotFormData.is_available,
        timezone: slotFormData.timezone,
        slot_duration_minutes: slotFormData.slot_duration_minutes,
        price_per_hour: slotFormData.price_per_hour,
        currency: slotFormData.currency,
        is_active: true
      };

      if (editingSlot) {
        const { error } = await supabase
          .from('consultant_availability')
          .update(slotData)
          .eq('id', editingSlot.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('consultant_availability')
          .insert(slotData);
        if (error) throw error;
      }

      alert('Availability updated successfully!');
      setShowEditModal(false);
      setEditingSlot(null);
      fetchAvailabilityData();
    } catch (err) {
      console.error('Error saving availability:', err);
      alert('Failed to save availability');
    } finally {
      setSaving(false);
    }
  };

  const handleAddBlock = async () => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from('consultant_blocked_times')
        .insert({
          consultant_id: user?.id,
          start_datetime: blockFormData.start_datetime,
          end_datetime: blockFormData.end_datetime,
          reason: blockFormData.reason,
          is_active: true
        });

      if (error) throw error;

      alert('Blocked time added successfully!');
      setShowBlockModal(false);
      setBlockFormData({ start_datetime: '', end_datetime: '', reason: '' });
      fetchAvailabilityData();
    } catch (err) {
      console.error('Error adding blocked time:', err);
      alert('Failed to add blocked time');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (!confirm('Are you sure you want to delete this availability slot?')) return;

    try {
      const { error } = await supabase
        .from('consultant_availability')
        .delete()
        .eq('id', slotId);

      if (error) throw error;

      fetchAvailabilityData();
    } catch (err) {
      console.error('Error deleting slot:', err);
      alert('Failed to delete availability slot');
    }
  };

  const handleEditSlot = (slot: AvailabilitySlot) => {
    setEditingSlot(slot);
    setSlotFormData({
      day_of_week: slot.day_of_week,
      start_time: slot.start_time,
      end_time: slot.end_time,
      is_available: slot.is_available,
      timezone: slot.timezone,
      slot_duration_minutes: slot.slot_duration_minutes,
      price_per_hour: slot.price_per_hour,
      currency: slot.currency
    });
    setShowEditModal(true);
  };

  const parseTime = (timeString: string): number => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatTime = (timeString: string): string => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getWeeklyHours = () => {
    return availability
      .filter(slot => slot.is_available)
      .reduce((total, slot) => {
        const startMinutes = parseTime(slot.start_time);
        const endMinutes = parseTime(slot.end_time);
        const durationHours = (endMinutes - startMinutes) / 60;
        return total + Math.max(0, durationHours);
      }, 0);
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Availability Management - Consultant Dashboard</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Availability Management - Consultant Dashboard</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Availability Management</h1>
            <p className="text-gray-600 mt-1">Manage your weekly schedule and booking preferences</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => {
                setEditingSlot(null);
                setSlotFormData({
                  day_of_week: 'monday',
                  start_time: '09:00',
                  end_time: '17:00',
                  is_available: true,
                  timezone: 'UTC',
                  slot_duration_minutes: 60,
                  price_per_hour: 150,
                  currency: 'USD'
                });
                setShowEditModal(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Availability
            </button>
            <button 
              onClick={() => setShowBlockModal(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              Block Time
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Weekly Hours</p>
                <p className="text-3xl font-bold text-blue-600">{getWeeklyHours()}h</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Days</p>
                <p className="text-3xl font-bold text-green-600">{availability.filter(s => s.is_available).length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hourly Rate</p>
                <p className="text-3xl font-bold text-purple-600">
                  ${availability[0]?.price_per_hour || 150}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Blocked Times</p>
                <p className="text-3xl font-bold text-red-600">{blockedTimes.length}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <X className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Weekly Schedule</h2>
            <p className="text-sm text-gray-600">Configure your weekly availability for client bookings</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {daysOfWeek.map((day) => {
                const daySlots = availability.filter(slot => slot.day_of_week === day.value);
                
                return (
                  <div key={day.value} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{day.label}</h3>
                      <button
                        onClick={() => {
                          setEditingSlot(null);
                          setSlotFormData(prev => ({ ...prev, day_of_week: day.value }));
                          setShowEditModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        + Add Slot
                      </button>
                    </div>
                    
                    {daySlots.length > 0 ? (
                      <div className="space-y-2">
                        {daySlots.map((slot) => (
                          <div key={slot.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-4">
                              <div className={`w-3 h-3 rounded-full ${
                                slot.is_available ? 'bg-green-500' : 'bg-red-500'
                              }`}></div>
                              <span className="font-medium text-gray-900">
                                {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                              </span>
                              <span className="text-sm text-gray-600">
                                ${slot.price_per_hour}/hr • {slot.slot_duration_minutes}min slots
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditSlot(slot)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteSlot(slot.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No availability set for {day.label}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Blocked Times */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Blocked Times</h2>
            <p className="text-sm text-gray-600">Temporary unavailable periods</p>
          </div>
          
          <div className="p-6">
            {blockedTimes.length > 0 ? (
              <div className="space-y-3">
                {blockedTimes.map((blocked) => (
                  <div key={blocked.id} className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-4">
                    <div>
                      <h4 className="font-medium text-gray-900">{blocked.reason}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(blocked.start_datetime).toLocaleDateString()} {new Date(blocked.start_datetime).toLocaleTimeString()} - {new Date(blocked.end_datetime).toLocaleTimeString()}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('Remove this blocked time?')) {
                          supabase
                            .from('consultant_blocked_times')
                            .update({ is_active: false })
                            .eq('id', blocked.id)
                            .then(() => fetchAvailabilityData());
                        }
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <X className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No blocked times</p>
              </div>
            )}
          </div>
        </div>

        {/* Edit Availability Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {editingSlot ? 'Edit Availability' : 'Add Availability'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Day of Week
                  </label>
                  <select
                    value={slotFormData.day_of_week}
                    onChange={(e) => setSlotFormData(prev => ({ ...prev, day_of_week: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {daysOfWeek.map(day => (
                      <option key={day.value} value={day.value}>{day.label}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={slotFormData.start_time}
                      onChange={(e) => setSlotFormData(prev => ({ ...prev, start_time: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={slotFormData.end_time}
                      onChange={(e) => setSlotFormData(prev => ({ ...prev, end_time: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hourly Rate ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="10"
                      value={slotFormData.price_per_hour}
                      onChange={(e) => setSlotFormData(prev => ({ ...prev, price_per_hour: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slot Duration (min)
                    </label>
                    <select
                      value={slotFormData.slot_duration_minutes}
                      onChange={(e) => setSlotFormData(prev => ({ ...prev, slot_duration_minutes: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={30}>30 minutes</option>
                      <option value={60}>60 minutes</option>
                      <option value={120}>120 minutes</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={slotFormData.timezone}
                    onChange={(e) => setSlotFormData(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {timezones.map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={slotFormData.is_available}
                    onChange={(e) => setSlotFormData(prev => ({ ...prev, is_available: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-900">Available for booking</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingSlot(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSlot}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2 inline" />
                      {editingSlot ? 'Update' : 'Save'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Block Time Modal */}
        {showBlockModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Block Time Period</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={blockFormData.start_datetime}
                    onChange={(e) => setBlockFormData(prev => ({ ...prev, start_datetime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={blockFormData.end_datetime}
                    onChange={(e) => setBlockFormData(prev => ({ ...prev, end_datetime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason
                  </label>
                  <input
                    type="text"
                    value={blockFormData.reason}
                    onChange={(e) => setBlockFormData(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="e.g., Vacation, Meeting, Personal"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => setShowBlockModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBlock}
                  disabled={saving || !blockFormData.start_datetime || !blockFormData.end_datetime || !blockFormData.reason}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Adding...' : 'Block Time'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ConsultantAvailability;