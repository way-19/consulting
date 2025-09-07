import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Globe, Save } from 'lucide-react';
import { Card, Button } from '@consulting19/shared';
import { supabase } from '@consulting19/shared';
import { useTranslation } from '../../hooks/useTranslation';
import ConsultantLayout from '../../components/layouts/ConsultantLayout';

interface AvailabilityData {
  consultant_profile_id: string;
  timezone: string;
  calendar_url: string;
  weekly: {
    [key: string]: {
      enabled: boolean;
      morning: boolean;
      afternoon: boolean;
      evening: boolean;
    };
  };
}

const ConsultantAvailability = () => {
  const { t } = useTranslation();
  const [availability, setAvailability] = useState<AvailabilityData>({
    consultant_profile_id: '',
    timezone: 'UTC',
    calendar_url: '',
    weekly: {
      monday: { enabled: true, morning: true, afternoon: true, evening: false },
      tuesday: { enabled: true, morning: true, afternoon: true, evening: false },
      wednesday: { enabled: true, morning: true, afternoon: true, evening: false },
      thursday: { enabled: true, morning: true, afternoon: true, evening: false },
      friday: { enabled: true, morning: true, afternoon: true, evening: false },
      saturday: { enabled: false, morning: false, afternoon: false, evening: false },
      sunday: { enabled: false, morning: false, afternoon: false, evening: false },
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('consultant_availability')
        .select('*')
        .eq('consultant_profile_id', user.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching availability:', error);
      } else if (data) {
        setAvailability(data);
      } else {
        // Set default consultant_profile_id for new records
        setAvailability(prev => ({
          ...prev,
          consultant_profile_id: user.user.id
        }));
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveAvailability = async () => {
    try {
      setSaving(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { error } = await supabase
        .from('consultant_availability')
        .upsert({
          consultant_profile_id: user.user.id,
          timezone: availability.timezone,
          calendar_url: availability.calendar_url,
          weekly: availability.weekly,
        });

      if (error) {
        console.error('Error saving availability:', error);
      } else {
        // Success feedback could be added here
        console.log('Availability saved successfully');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateDayAvailability = (day: string, field: string, value: boolean) => {
    setAvailability(prev => ({
      ...prev,
      weekly: {
        ...prev.weekly,
        [day]: {
          ...prev.weekly[day],
          [field]: value,
        }
      }
    }));
  };

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
    'Australia/Sydney',
  ];

  const days = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];

  if (loading) {
    return (
      <ConsultantLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </ConsultantLayout>
    );
  }

  return (
    <ConsultantLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('availability.title')}</h1>
        <p className="text-gray-600">{t('availability.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Settings */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">General Settings</h2>
          </Card.Header>
          <Card.Body className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('availability.timezone')}
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={availability.timezone}
                  onChange={(e) => setAvailability(prev => ({ ...prev, timezone: e.target.value }))}
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
                {t('availability.calendarUrl')}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="url"
                  value={availability.calendar_url}
                  onChange={(e) => setAvailability(prev => ({ ...prev, calendar_url: e.target.value }))}
                  placeholder="https://calendar.google.com/..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Optional: Link to your Google Calendar or Outlook for automatic sync
              </p>
            </div>
          </Card.Body>
        </Card>

        {/* Weekly Schedule */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">{t('availability.weeklyHours')}</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              {days.map(day => (
                <div key={day} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={availability.weekly[day]?.enabled || false}
                      onChange={(e) => updateDayAvailability(day, 'enabled', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium text-gray-900 capitalize">
                      {t(`availability.days.${day}`)}
                    </span>
                  </div>
                  
                  {availability.weekly[day]?.enabled && (
                    <div className="flex space-x-2">
                      <label className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          checked={availability.weekly[day]?.morning || false}
                          onChange={(e) => updateDayAvailability(day, 'morning', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">Morning</span>
                      </label>
                      <label className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          checked={availability.weekly[day]?.afternoon || false}
                          onChange={(e) => updateDayAvailability(day, 'afternoon', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">Afternoon</span>
                      </label>
                      <label className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          checked={availability.weekly[day]?.evening || false}
                          onChange={(e) => updateDayAvailability(day, 'evening', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">Evening</span>
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <Button
          onClick={saveAvailability}
          loading={saving}
          icon={Save}
          size="lg"
        >
          {saving ? 'Saving...' : t('common.save')}
        </Button>
      </div>
    </ConsultantLayout>
  );
};

export default ConsultantAvailability;