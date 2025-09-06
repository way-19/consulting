import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Globe, Save, DollarSign, AlertTriangle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@consulting19/shared/lib/supabase';
import { useAuth } from '@consulting19/shared';

interface ConsultantAvailabilityRecord {
  id?: string;
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
}

const ConsultantAvailability = () => {
  const { user } = useAuth();
  const [availability, setAvailability] = useState<ConsultantAvailabilityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [globalTimezone, setGlobalTimezone] = useState('UTC');
  const [globalCurrency, setGlobalCurrency] = useState('USD');
  const [globalPricePerHour, setGlobalPricePerHour] = useState(150);
  const [globalSlotDuration, setGlobalSlotDuration] = useState(60);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const timezones = [
    'UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London',
    'Europe/Berlin', 'Europe/Istanbul', 'Asia/Dubai', 'Asia/Singapore',
    'Asia/Tokyo', 'Australia/Sydney'
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'GEL'];

  const days = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];

  useEffect(() => {
    if (user) {
      initializeAvailability();
    }
  }, [user]);

  const initializeAvailability = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      await fetchAvailability();
    } catch (err) {
      console.error('Error initializing availability:', err);
      setError('Failed to load availability data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('consultant_availability')
        .select('*')
        .eq('consultant_id', user.id)
        .order('day_of_week');

      if (error) {
        console.error('Error fetching availability:', error);
        setError('Failed to fetch availability data');
        return;
      }

      // Create a map of existing availability records
      const existingMap = new Map(data?.map(item => [item.day_of_week, item]) || []);
      
      // Create complete availability array with defaults for missing days
      const completeAvailability: ConsultantAvailabilityRecord[] = days.map(day => {
        const existing = existingMap.get(day);
        return existing || {
          consultant_id: user.id,
          day_of_week: day,
          start_time: '09:00',
          end_time: '17:00',
          is_available: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(day),
          timezone: globalTimezone,
          slot_duration_minutes: globalSlotDuration,
          price_per_hour: globalPricePerHour,
          currency: globalCurrency,
          is_active: true
        };
      });

      setAvailability(completeAvailability);

      // Set global values from first existing record
      if (data && data.length > 0) {
        setGlobalTimezone(data[0].timezone);
        setGlobalCurrency(data[0].currency);
        setGlobalPricePerHour(data[0].price_per_hour);
        setGlobalSlotDuration(data[0].slot_duration_minutes);
      }
    } catch (err) {
      console.error('Unexpected error fetching availability:', err);
      setError('An unexpected error occurred');
    }
  };

  const updateAvailabilityField = (day: string, field: keyof ConsultantAvailabilityRecord, value: any) => {
    setAvailability(prev =>
      prev.map(item =>
        item.day_of_week === day
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const applyGlobalSettings = () => {
    setAvailability(prev =>
      prev.map(item => ({
        ...item,
        timezone: globalTimezone,
        currency: globalCurrency,
        price_per_hour: globalPricePerHour,
        slot_duration_minutes: globalSlotDuration
      }))
    );
  };

  const handleSaveAvailability = async () => {
    if (!user?.id) {
      setError('User not logged in');
      return;
    }

    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      // Prepare data for upsert
      const dataToSave = availability.map(item => ({
        consultant_id: user.id,
        day_of_week: item.day_of_week,
        start_time: item.start_time || '00:00',
        end_time: item.end_time || '23:59',
        is_available: item.is_available,
        timezone: item.timezone,
        slot_duration_minutes: item.slot_duration_minutes || 60,
        price_per_hour: item.price_per_hour || 0,
        currency: item.currency,
        is_active: item.is_active
      }));

      const { error } = await supabase
        .from('consultant_availability')
        .upsert(dataToSave, { onConflict: 'consultant_id,day_of_week' });

      if (error) {
        console.error('Error saving availability:', error);
        setError('Failed to save availability: ' + error.message);
        return;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user.id,
          action_type: 'availability_updated',
          description: 'Updated consultant availability schedule',
          payload: {
            timezone: globalTimezone,
            currency: globalCurrency,
            average_price: globalPricePerHour,
            available_days: availability.filter(a => a.is_available).length
          }
        });

      setSuccessMessage('Availability saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Re-fetch to get updated data with IDs
      await fetchAvailability();
    } catch (err) {
      console.error('Unexpected error saving availability:', err);
      setError('An unexpected error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  const calculateWeeklyHours = () => {
    return availability.reduce((total, day) => {
      if (!day.is_available) return total;
      const start = parseTime(day.start_time);
      const end = parseTime(day.end_time);
      return total + Math.max(0, end - start);
    }, 0);
  };

  const parseTime = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours + minutes / 60;
  };

  const getAvailableTimeSlots = (day: ConsultantAvailabilityRecord) => {
    if (!day.is_available) return 0;
    const start = parseTime(day.start_time);
    const end = parseTime(day.end_time);
    const totalMinutes = (end - start) * 60;
    return Math.floor(totalMinutes / day.slot_duration_minutes);
  };

  const weeklyHours = calculateWeeklyHours();
  const totalSlots = availability.reduce((sum, day) => sum + getAvailableTimeSlots(day), 0);
  const weeklyPotentialRevenue = availability.reduce((sum, day) => {
    if (!day.is_available) return sum;
    const hours = parseTime(day.end_time) - parseTime(day.start_time);
    return sum + (hours * day.price_per_hour);
  }, 0);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Availability - Consultant Dashboard</title>
        </Helmet>
        
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
        <title>Availability - Consultant Dashboard</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Availability Management</h1>
            <p className="text-gray-600">Set your schedule, pricing, and booking preferences for client meetings</p>
          </div>

          {/* Messages */}
          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-2">
                <span className="text-white text-xs">✓</span>
              </div>
              {successMessage}
            </div>
          )}
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {/* Weekly Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Weekly Hours</p>
                  <p className="text-2xl font-bold text-blue-600">{weeklyHours.toFixed(1)}h</p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Available Slots</p>
                  <p className="text-2xl font-bold text-green-600">{totalSlots}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Rate</p>
                  <p className="text-2xl font-bold text-purple-600">${globalPricePerHour}</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Potential Weekly</p>
                  <p className="text-2xl font-bold text-orange-600">${weeklyPotentialRevenue.toFixed(0)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Global Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Global Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={globalTimezone}
                      onChange={(e) => setGlobalTimezone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {timezones.map(tz => (
                        <option key={tz} value={tz}>{tz}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={globalCurrency}
                      onChange={(e) => setGlobalCurrency(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {currencies.map(curr => (
                        <option key={curr} value={curr}>{curr}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Price per Hour
                  </label>
                  <input
                    type="number"
                    value={globalPricePerHour}
                    onChange={(e) => setGlobalPricePerHour(Number(e.target.value))}
                    min="0"
                    step="10"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Slot Duration (minutes)
                  </label>
                  <select
                    value={globalSlotDuration}
                    onChange={(e) => setGlobalSlotDuration(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={60}>60 minutes</option>
                    <option value={90}>90 minutes</option>
                    <option value={120}>120 minutes</option>
                  </select>
                </div>

                <button
                  onClick={applyGlobalSettings}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Apply to All Days
                </button>
              </div>
            </div>

            {/* Weekly Schedule */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Weekly Schedule</h2>
              <div className="space-y-6">
                {availability.map(dayAvailability => (
                  <div key={dayAvailability.day_of_week} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={dayAvailability.is_available}
                          onChange={(e) => updateAvailabilityField(dayAvailability.day_of_week, 'is_available', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="font-medium text-gray-900 capitalize text-lg">
                          {dayAvailability.day_of_week}
                        </span>
                      </div>
                      {dayAvailability.is_available && (
                        <span className="text-sm text-gray-500">
                          {getAvailableTimeSlots(dayAvailability)} slots • 
                          ${((parseTime(dayAvailability.end_time) - parseTime(dayAvailability.start_time)) * dayAvailability.price_per_hour).toFixed(0)} potential
                        </span>
                      )}
                    </div>

                    {dayAvailability.is_available && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Start Time</label>
                          <input
                            type="time"
                            value={dayAvailability.start_time}
                            onChange={(e) => updateAvailabilityField(dayAvailability.day_of_week, 'start_time', e.target.value)}
                            className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">End Time</label>
                          <input
                            type="time"
                            value={dayAvailability.end_time}
                            onChange={(e) => updateAvailabilityField(dayAvailability.day_of_week, 'end_time', e.target.value)}
                            className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Slot Duration</label>
                          <select
                            value={dayAvailability.slot_duration_minutes}
                            onChange={(e) => updateAvailabilityField(dayAvailability.day_of_week, 'slot_duration_minutes', Number(e.target.value))}
                            className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value={30}>30 min</option>
                            <option value={60}>60 min</option>
                            <option value={90}>90 min</option>
                            <option value={120}>120 min</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Price/Hour</label>
                          <input
                            type="number"
                            value={dayAvailability.price_per_hour}
                            onChange={(e) => updateAvailabilityField(dayAvailability.day_of_week, 'price_per_hour', Number(e.target.value))}
                            min="0"
                            step="10"
                            className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Revenue Projection */}
          <div className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              Revenue Projections
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">${weeklyPotentialRevenue.toFixed(0)}</div>
                <div className="text-sm text-green-700">Weekly Potential</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{totalSlots}</div>
                <div className="text-sm text-blue-700">Available Slots</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{availability.filter(a => a.is_available).length}</div>
                <div className="text-sm text-purple-700">Working Days</div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSaveAvailability}
              disabled={saving}
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              ) : (
                <Save className="w-5 h-5 mr-3" />
              )}
              {saving ? 'Saving Changes...' : 'Save Availability'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsultantAvailability;