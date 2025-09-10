import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  Clock, 
  Calendar, 
  Globe, 
  Save, 
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Settings,
  DollarSign,
  Users,
  Target
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface ConsultantAvailability {
  id: string;
  consultant_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  timezone: string;
  slot_duration_minutes: number;
  price_per_hour: number;
  currency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const ConsultantAvailability = () => {
  const { user, profile } = useAuth();
  const [availability, setAvailability] = useState<ConsultantAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [generalSettings, setGeneralSettings] = useState({
    timezone: 'UTC',
    default_slot_duration: 60,
    default_price_per_hour: 250,
    currency: 'USD',
    auto_confirm: false,
    buffer_time: 15
  });

  const weekdays = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Berlin',
    'Europe/Istanbul',
    'Asia/Dubai',
    'Asia/Singapore',
    'Asia/Tokyo',
    'Australia/Sydney'
  ];

  useEffect(() => {
    if (user && profile) {
      fetchAvailability();
    }
  }, [user, profile]);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data: availabilityData, error: fetchError } = await supabase
        .from('consultant_availability')
        .select('*')
        .eq('consultant_id', user?.id)
        .order('day_of_week');

      if (fetchError) {
        console.error('Error fetching availability:', fetchError);
        setError('Failed to load availability data');
        return;
      }

      // If no availability exists, create default schedule
      if (!availabilityData || availabilityData.length === 0) {
        await createDefaultAvailability();
        return;
      }

      setAvailability(availabilityData);

      // Set general settings from first availability record
      if (availabilityData.length > 0) {
        const firstRecord = availabilityData[0];
        setGeneralSettings({
          timezone: firstRecord.timezone,
          default_slot_duration: firstRecord.slot_duration_minutes,
          default_price_per_hour: firstRecord.price_per_hour,
          currency: firstRecord.currency,
          auto_confirm: false, // Mock setting
          buffer_time: 15 // Mock setting
        });
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred while loading availability');
    } finally {
      setLoading(false);
    }
  };

  const createDefaultAvailability = async () => {
    try {
      const defaultSchedule = weekdays.map(day => ({
        consultant_id: user?.id,
        day_of_week: day.key,
        start_time: '09:00',
        end_time: '17:00',
        is_available: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(day.key),
        timezone: 'UTC',
        slot_duration_minutes: 60,
        price_per_hour: 250,
        currency: 'USD',
        is_active: true
      }));

      const { error } = await supabase
        .from('consultant_availability')
        .insert(defaultSchedule);

      if (error) {
        throw error;
      }

      // Refetch after creating defaults
      await fetchAvailability();
    } catch (err) {
      console.error('Error creating default availability:', err);
      setError('Failed to create default availability');
    }
  };

  const updateDayAvailability = async (dayKey: string, field: string, value: any) => {
    try {
      const dayRecord = availability.find(a => a.day_of_week === dayKey);
      
      if (dayRecord) {
        // Update existing record
        const { error } = await supabase
          .from('consultant_availability')
          .update({ 
            [field]: value,
            updated_at: new Date().toISOString()
          })
          .eq('id', dayRecord.id);

        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from('consultant_availability')
          .insert({
            consultant_id: user?.id,
            day_of_week: dayKey,
            start_time: '09:00',
            end_time: '17:00',
            is_available: field === 'is_available' ? value : true,
            timezone: generalSettings.timezone,
            slot_duration_minutes: generalSettings.default_slot_duration,
            price_per_hour: generalSettings.default_price_per_hour,
            currency: generalSettings.currency,
            is_active: true,
            [field]: value
          });

        if (error) throw error;
      }

      // Refresh data
      await fetchAvailability();
    } catch (err) {
      console.error('Error updating availability:', err);
      setError('Failed to update availability');
    }
  };

  const saveGeneralSettings = async () => {
    try {
      setSaving(true);
      setError('');

      // Update all availability records with new general settings
      const { error } = await supabase
        .from('consultant_availability')
        .update({
          timezone: generalSettings.timezone,
          slot_duration_minutes: generalSettings.default_slot_duration,
          price_per_hour: generalSettings.default_price_per_hour,
          currency: generalSettings.currency,
          updated_at: new Date().toISOString()
        })
        .eq('consultant_id', user?.id);

      if (error) {
        throw error;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'other',
          description: 'Updated consultant availability settings',
          payload: generalSettings
        });

      setSuccessMessage('Availability settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Refresh data
      await fetchAvailability();
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save availability settings');
    } finally {
      setSaving(false);
    }
  };

  const getDayAvailability = (dayKey: string) => {
    return availability.find(a => a.day_of_week === dayKey) || {
      day_of_week: dayKey,
      start_time: '09:00',
      end_time: '17:00',
      is_available: false,
      timezone: generalSettings.timezone,
      slot_duration_minutes: generalSettings.default_slot_duration,
      price_per_hour: generalSettings.default_price_per_hour,
      currency: generalSettings.currency
    };
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Availability Settings - Consultant Dashboard</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        <title>Availability Settings - Consultant Dashboard</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Availability Settings</h1>
            <p className="text-gray-600 mt-1">Manage your schedule and meeting preferences</p>
          </div>
          <button
            onClick={saveGeneralSettings}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save All Changes
              </>
            )}
          </button>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">General Settings</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={generalSettings.timezone}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {timezones.map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Slot Duration (minutes)
                </label>
                <select
                  value={generalSettings.default_slot_duration}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, default_slot_duration: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={30}>30 minutes</option>
                  <option value={60}>60 minutes</option>
                  <option value={120}>120 minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate (USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    min="50"
                    step="10"
                    value={generalSettings.default_price_per_hour}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, default_price_per_hour: Number(e.target.value) }))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Standard hourly rate for consultations
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buffer Time Between Meetings (minutes)
                </label>
                <select
                  value={generalSettings.buffer_time}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, buffer_time: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0}>No buffer</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={generalSettings.auto_confirm}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, auto_confirm: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-900">Auto-confirm paid meetings</span>
              </div>
            </div>
          </div>

          {/* Weekly Schedule */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Weekly Schedule</h2>
            </div>
            
            <div className="space-y-4">
              {weekdays.map(day => {
                const dayData = getDayAvailability(day.key);
                return (
                  <div key={day.key} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={dayData.is_available}
                          onChange={(e) => updateDayAvailability(day.key, 'is_available', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="font-medium text-gray-900">
                          {day.label}
                        </span>
                      </div>
                      
                      {dayData.is_available && (
                        <div className="text-sm text-green-600 font-medium">
                          Available
                        </div>
                      )}
                    </div>
                    
                    {dayData.is_available && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Start Time
                          </label>
                          <input
                            type="time"
                            value={dayData.start_time}
                            onChange={(e) => updateDayAvailability(day.key, 'start_time', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            End Time
                          </label>
                          <input
                            type="time"
                            value={dayData.end_time}
                            onChange={(e) => updateDayAvailability(day.key, 'end_time', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Meeting Pricing Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">💰 Meeting Pricing Structure</h3>
          <p className="text-gray-600 mb-6">Fixed pricing structure for client meetings:</p>
          
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
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-2">$250</div>
              <div className="text-sm text-blue-800 font-medium">60 Minutes</div>
              <div className="text-xs text-blue-700 mt-2">Standard business consultation</div>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-2">$400</div>
              <div className="text-sm text-purple-800 font-medium">120 Minutes</div>
              <div className="text-xs text-purple-700 mt-2">Extended strategy session</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">📋 How It Works:</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Clients see your available time slots</li>
              <li>• They select duration (30/60/120 min) with fixed pricing</li>
              <li>• Payment is processed through Stripe before booking</li>
              <li>• You receive automatic notification when meeting is booked</li>
              <li>• Meeting details are sent to both parties</li>
            </ul>
          </div>
        </div>

        {/* Schedule Preview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">📅 Your Schedule Preview</h3>
          <p className="text-gray-600 mb-6">How clients will see your availability:</p>
          
          <div className="grid grid-cols-7 gap-2">
            {weekdays.map(day => {
              const dayData = getDayAvailability(day.key);
              return (
                <div key={day.key} className="text-center">
                  <div className="text-sm font-medium text-gray-900 mb-2">
                    {day.label.substring(0, 3)}
                  </div>
                  <div className={`p-4 rounded-lg border-2 ${
                    dayData.is_available 
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-300 bg-gray-50'
                  }`}>
                    {dayData.is_available ? (
                      <div className="space-y-1">
                        <div className="text-xs text-green-800 font-medium">Available</div>
                        <div className="text-xs text-green-700">
                          {dayData.start_time} - {dayData.end_time}
                        </div>
                        <div className="text-xs text-green-600">
                          {generalSettings.timezone}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500">Unavailable</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">📊 Availability Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {availability.filter(a => a.is_available).length}
              </div>
              <div className="text-sm text-blue-800">Available Days</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {availability.reduce((total, a) => {
                  if (!a.is_available) return total;
                  const start = parseTime(a.start_time);
                  const end = parseTime(a.end_time);
                  return total + Math.floor((end - start) / 60);
                }, 0)}h
              </div>
              <div className="text-sm text-green-800">Weekly Hours</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                ${generalSettings.default_price_per_hour}
              </div>
              <div className="text-sm text-purple-800">Hourly Rate</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {generalSettings.default_slot_duration}min
              </div>
              <div className="text-sm text-orange-800">Slot Duration</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsultantAvailability;