import React, { useState, useEffect } from 'react';
import { useAuth } from '@consulting19/shared';
import { Send, Plus, Users, Mail, MessageSquare, BookTemplate as Template, BarChart3, Clock, CheckCircle, AlertTriangle, X, Edit, Copy, Trash2, Play, Pause, Eye, Download, Filter, Search, Target, Zap, Globe } from 'lucide-react';
import { supabase } from '@consulting19/shared/src/lib/supabase';

interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  category: string;
  language_code: string;
  usage_count: number;
  last_used_at: string;
}

interface Campaign {
  id: string;
  name: string;
  subject: string;
  message: string;
  recipient_count: number;
  sent_count: number;
  delivered_count: number;
  read_count: number;
  status: string;
  priority: string;
  created_at: string;
  sent_at: string;
}

interface Client {
  id: string;
  profile_id: string;
  profile: {
    full_name: string;
    email: string;
    preferred_language: string;
  };
  company_name: string;
  status: string;
  tags?: string[];
}

interface MassCommunicationManagerProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedClients?: string[];
}

const MassCommunicationManager: React.FC<MassCommunicationManagerProps> = ({
  isOpen,
  onClose,
  preSelectedClients = []
}) => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('compose');
  
  // Templates
  const [templates, setTemplates] = useState<Template[]>([]);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    subject: '',
    body: '',
    category: 'general',
    language_code: 'en',
    variables: [] as string[]
  });
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  
  // Campaigns
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  
  // Campaign creation
  const [campaignData, setCampaignData] = useState({
    name: '',
    subject: '',
    message: '',
    target_criteria: 'selected',
    priority: 'medium',
    send_email: true,
    send_sms: false,
    auto_translate: true,
    schedule_later: false,
    scheduled_at: ''
  });
  
  // Client selection
  const [selectedClients, setSelectedClients] = useState<string[]>(preSelectedClients);
  const [availableClients, setAvailableClients] = useState<Client[]>([]);
  const [clientFilter, setClientFilter] = useState({
    status: 'all',
    tag: 'all',
    language: 'all',
    search: ''
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);

  const categories = ['general', 'onboarding', 'documents', 'payments', 'meetings', 'reminders'];
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  useEffect(() => {
    if (isOpen && user) {
      fetchTemplates();
      fetchCampaigns();
      fetchAvailableClients();
    }
  }, [isOpen, user]);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('message_templates')
        .select('*')
        .eq('consultant_id', user?.id)
        .order('usage_count', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (err) {
      console.error('Error fetching templates:', err);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('message_campaigns')
        .select('*')
        .eq('consultant_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
    }
  };

  const fetchAvailableClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          profile:user_profiles!clients_profile_id_fkey(full_name, email, preferred_language)
        `)
        .eq('assigned_consultant_id', user?.id)
        .eq('status', 'active');

      if (error) throw error;
      setAvailableClients(data || []);
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  };

  const createTemplate = async () => {
    if (!newTemplate.name.trim() || !newTemplate.body.trim()) {
      alert('Template name and body are required');
      return;
    }

    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('message_templates')
        .insert({
          consultant_id: user?.id,
          name: newTemplate.name,
          subject: newTemplate.subject,
          body: newTemplate.body,
          category: newTemplate.category,
          language_code: newTemplate.language_code,
          variables: newTemplate.variables
        });

      if (error) throw error;
      
      alert('Template created successfully!');
      setNewTemplate({
        name: '',
        subject: '',
        body: '',
        category: 'general',
        language_code: 'en',
        variables: []
      });
      
      fetchTemplates();
    } catch (err) {
      console.error('Error creating template:', err);
      alert('Failed to create template');
    } finally {
      setSaving(false);
    }
  };

  const createCampaign = async () => {
    if (!campaignData.name.trim() || !campaignData.message.trim() || selectedClients.length === 0) {
      alert('Campaign name, message, and client selection are required');
      return;
    }

    try {
      setSending(true);

      // Create campaign record
      const { data: campaign, error: campaignError } = await supabase
        .from('message_campaigns')
        .insert({
          consultant_id: user?.id,
          name: campaignData.name,
          subject: campaignData.subject,
          message: campaignData.message,
          template_id: selectedTemplate || null,
          target_criteria: { selected_clients: selectedClients },
          recipient_count: selectedClients.length,
          priority: campaignData.priority,
          send_email: campaignData.send_email,
          send_sms: campaignData.send_sms,
          auto_translate: campaignData.auto_translate,
          status: campaignData.schedule_later ? 'draft' : 'sending',
          scheduled_at: campaignData.schedule_later ? campaignData.scheduled_at : null
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // If not scheduled, send immediately
      if (!campaignData.schedule_later) {
        await sendCampaign(campaign.id);
      }

      alert(`Campaign ${campaignData.schedule_later ? 'scheduled' : 'sent'} successfully!`);
      setCampaignData({
        name: '',
        subject: '',
        message: '',
        target_criteria: 'selected',
        priority: 'medium',
        send_email: true,
        send_sms: false,
        auto_translate: true,
        schedule_later: false,
        scheduled_at: ''
      });
      setSelectedClients([]);
      
      fetchCampaigns();
    } catch (err) {
      console.error('Error creating campaign:', err);
      alert('Failed to create campaign');
    } finally {
      setSending(false);
    }
  };

  const sendCampaign = async (campaignId: string) => {
    try {
      // Send individual messages to each client
      const messagePromises = selectedClients.map(async (clientProfileId) => {
        const { data: messageData, error: messageError } = await supabase
          .from('messages')
          .insert({
            sender_id: user?.id,
            receiver_id: clientProfileId,
            content: campaignData.message,
            original_language: profile?.preferred_language || 'en',
            target_language: 'auto', // Will be auto-detected
            is_translated: false
          })
          .select()
          .single();

        if (messageError) throw messageError;

        // Log delivery
        await supabase
          .from('message_delivery_logs')
          .insert({
            campaign_id: campaignId,
            recipient_profile_id: clientProfileId,
            message_id: messageData.id,
            delivery_status: 'sent',
            delivery_channel: 'platform',
            sent_at: new Date().toISOString()
          });

        // Send notifications
        if (campaignData.send_email) {
          await supabase.functions.invoke('notify', {
            body: {
              recipient_id: clientProfileId,
              type: 'campaign_message',
              payload: {
                subject: campaignData.subject,
                consultant_name: profile?.full_name,
                priority: campaignData.priority,
                campaign_id: campaignId
              },
              email_notification: true
            }
          });
        }
      });

      await Promise.all(messagePromises);

      // Update campaign status
      await supabase
        .from('message_campaigns')
        .update({
          status: 'sent',
          sent_count: selectedClients.length,
          sent_at: new Date().toISOString()
        })
        .eq('id', campaignId);

    } catch (err) {
      console.error('Error sending campaign:', err);
      throw err;
    }
  };

  const loadTemplate = (template: Template) => {
    setCampaignData(prev => ({
      ...prev,
      subject: template.subject,
      message: template.body
    }));
    setSelectedTemplate(template.id);
  };

  const filteredClients = availableClients.filter(client => {
    const matchesSearch = 
      client.profile.full_name.toLowerCase().includes(clientFilter.search.toLowerCase()) ||
      client.company_name?.toLowerCase().includes(clientFilter.search.toLowerCase());
    
    const matchesStatus = clientFilter.status === 'all' || client.status === clientFilter.status;
    const matchesLanguage = clientFilter.language === 'all' || client.profile.preferred_language === clientFilter.language;
    
    return matchesSearch && matchesStatus && matchesLanguage;
  });

  const getCampaignStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'sending': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Mass Communication Center</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-6 mt-4">
            {[
              { id: 'compose', name: 'Compose Campaign', icon: Send },
              { id: 'templates', name: 'Templates', icon: Template },
              { id: 'campaigns', name: 'Campaigns', icon: BarChart3 },
              { id: 'analytics', name: 'Analytics', icon: Target }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {/* Compose Tab */}
          {activeTab === 'compose' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Campaign Setup */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Setup</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Campaign Name *
                        </label>
                        <input
                          type="text"
                          value={campaignData.name}
                          onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Monthly Document Reminder"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Use Template (Optional)
                        </label>
                        <select
                          value={selectedTemplate}
                          onChange={(e) => {
                            const template = templates.find(t => t.id === e.target.value);
                            if (template) loadTemplate(template);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select a template</option>
                          {templates.map((template) => (
                            <option key={template.id} value={template.id}>
                              {template.name} ({template.category})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subject/Title *
                        </label>
                        <input
                          type="text"
                          value={campaignData.subject}
                          onChange={(e) => setCampaignData(prev => ({ ...prev, subject: e.target.value }))}
                          placeholder="Message subject line"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message Content *
                        </label>
                        <textarea
                          value={campaignData.message}
                          onChange={(e) => setCampaignData(prev => ({ ...prev, message: e.target.value }))}
                          placeholder="Type your message that will be sent to all selected clients..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          rows={6}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                          <select
                            value={campaignData.priority}
                            onChange={(e) => setCampaignData(prev => ({ ...prev, priority: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={campaignData.send_email}
                              onChange={(e) => setCampaignData(prev => ({ ...prev, send_email: e.target.checked }))}
                              className="rounded border-gray-300 text-blue-600"
                            />
                            <span className="ml-2 text-sm">Email notification</span>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={campaignData.auto_translate}
                              onChange={(e) => setCampaignData(prev => ({ ...prev, auto_translate: e.target.checked }))}
                              className="rounded border-gray-300 text-blue-600"
                            />
                            <span className="ml-2 text-sm">Auto-translate</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Send Options */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-900 mb-3">Send Options</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-800">Selected Clients:</span>
                        <span className="font-bold text-blue-600">{selectedClients.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-800">Delivery Channels:</span>
                        <div className="flex space-x-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Platform</span>
                          {campaignData.send_email && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Email</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={createCampaign}
                    disabled={sending || !campaignData.message.trim() || selectedClients.length === 0}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-semibold"
                  >
                    {sending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                        {campaignData.schedule_later ? 'Scheduling...' : 'Sending...'}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2 inline" />
                        {campaignData.schedule_later ? `Schedule Campaign` : `Send to ${selectedClients.length} Clients`}
                      </>
                    )}
                  </button>
                </div>

                {/* Client Selection */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Select Recipients ({selectedClients.length})</h3>
                  </div>
                  
                  {/* Client Filters */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search clients..."
                          value={clientFilter.search}
                          onChange={(e) => setClientFilter(prev => ({ ...prev, search: e.target.value }))}
                          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <select
                        value={clientFilter.status}
                        onChange={(e) => setClientFilter(prev => ({ ...prev, status: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded text-sm"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <button
                        onClick={() => {
                          const allClientIds = filteredClients.map(c => c.profile_id);
                          setSelectedClients(
                            selectedClients.length === allClientIds.length ? [] : allClientIds
                          );
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        {selectedClients.length === filteredClients.length && filteredClients.length > 0 
                          ? 'Deselect All' : 'Select All'}
                      </button>
                      <span className="text-xs text-gray-500">{filteredClients.length} clients available</span>
                    </div>
                  </div>

                  {/* Client List */}
                  <div className="max-h-80 overflow-y-auto">
                    {filteredClients.map((client) => (
                      <div
                        key={client.id}
                        className="p-3 border-b border-gray-100 hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedClients.includes(client.profile_id)}
                            onChange={() => {
                              setSelectedClients(prev =>
                                prev.includes(client.profile_id)
                                  ? prev.filter(id => id !== client.profile_id)
                                  : [...prev, client.profile_id]
                              );
                            }}
                            className="rounded border-gray-300 text-blue-600"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">
                              {client.profile.full_name}
                            </h4>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{client.company_name}</span>
                              <span>{languages.find(l => l.code === client.profile.preferred_language)?.flag} {client.profile.preferred_language}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Message Templates</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2 inline" />
                  Create Template
                </button>
              </div>

              {templates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{template.name}</h4>
                          <p className="text-sm text-gray-600">{template.subject}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                            <span className="bg-gray-100 px-2 py-1 rounded">{template.category}</span>
                            <span>{languages.find(l => l.code === template.language_code)?.flag}</span>
                            <span>Used: {template.usage_count} times</span>
                          </div>
                        </div>
                        <button
                          onClick={() => loadTemplate(template)}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                        >
                          Use Template
                        </button>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {template.body.substring(0, 120)}...
                      </p>
                      
                      <div className="flex space-x-2">
                        <button className="flex-1 px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
                          <Edit className="w-3 h-3 mr-1 inline" />
                          Edit
                        </button>
                        <button className="flex-1 px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
                          <Copy className="w-3 h-3 mr-1 inline" />
                          Clone
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Template className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Templates Yet</h3>
                  <p className="text-gray-600 mb-4">Create your first message template</p>
                </div>
              )}
            </div>
          )}

          {/* Campaigns Tab */}
          {activeTab === 'campaigns' && (
            <div className="p-6 h-full overflow-y-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Campaign History</h3>

              {campaigns.length > 0 ? (
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg">{campaign.name}</h4>
                          <p className="text-gray-600">{campaign.subject}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                            <span>Created: {new Date(campaign.created_at).toLocaleDateString()}</span>
                            {campaign.sent_at && (
                              <span>Sent: {new Date(campaign.sent_at).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCampaignStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                      </div>

                      {/* Campaign Stats */}
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-xl font-bold text-blue-600">{campaign.recipient_count}</div>
                          <div className="text-xs text-blue-800">Recipients</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-xl font-bold text-green-600">{campaign.sent_count}</div>
                          <div className="text-xs text-green-800">Sent</div>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                          <div className="text-xl font-bold text-yellow-600">{campaign.delivered_count}</div>
                          <div className="text-xs text-yellow-800">Delivered</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-xl font-bold text-purple-600">{campaign.read_count}</div>
                          <div className="text-xs text-purple-800">Read</div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                          <Eye className="w-4 h-4 mr-1 inline" />
                          View Details
                        </button>
                        <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                          <Download className="w-4 h-4 mr-1 inline" />
                          Export Report
                        </button>
                        {campaign.status === 'draft' && (
                          <button className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                            <Play className="w-4 h-4 mr-1 inline" />
                            Send Now
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Campaigns Yet</h3>
                  <p className="text-gray-600">Your campaign history will appear here</p>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="p-6 h-full overflow-y-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Communication Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {campaigns.reduce((sum, c) => sum + c.sent_count, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-800 font-medium">Total Messages Sent</div>
                  <div className="text-xs text-blue-600 mt-1">Across all campaigns</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {campaigns.length > 0 
                      ? ((campaigns.reduce((sum, c) => sum + c.delivered_count, 0) / campaigns.reduce((sum, c) => sum + c.sent_count, 0)) * 100).toFixed(1)
                      : 0
                    }%
                  </div>
                  <div className="text-sm text-green-800 font-medium">Delivery Rate</div>
                  <div className="text-xs text-green-600 mt-1">Successfully delivered</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    {campaigns.length > 0 
                      ? ((campaigns.reduce((sum, c) => sum + c.read_count, 0) / campaigns.reduce((sum, c) => sum + c.delivered_count, 0)) * 100).toFixed(1)
                      : 0
                    }%
                  </div>
                  <div className="text-sm text-purple-800 font-medium">Open Rate</div>
                  <div className="text-xs text-purple-600 mt-1">Messages read</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">📊 Communication Insights</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Total Templates:</span>
                      <span className="font-bold text-gray-900">{templates.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Active Campaigns:</span>
                      <span className="font-bold text-blue-600">
                        {campaigns.filter(c => ['sending', 'sent'].includes(c.status)).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Languages Supported:</span>
                      <span className="font-bold text-purple-600">{languages.length}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Avg Campaign Size:</span>
                      <span className="font-bold text-gray-900">
                        {campaigns.length > 0 
                          ? Math.round(campaigns.reduce((sum, c) => sum + c.recipient_count, 0) / campaigns.length)
                          : 0
                        } clients
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Most Used Template:</span>
                      <span className="font-bold text-green-600">
                        {templates.sort((a, b) => b.usage_count - a.usage_count)[0]?.name || 'None'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Success Rate:</span>
                      <span className="font-bold text-yellow-600">
                        {campaigns.length > 0 
                          ? ((campaigns.filter(c => c.status === 'sent').length / campaigns.length) * 100).toFixed(1)
                          : 0
                        }%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MassCommunicationManager;