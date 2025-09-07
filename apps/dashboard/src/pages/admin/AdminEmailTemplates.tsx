import React, { useState, useEffect } from 'react';
import { Mail, Plus, Edit, Send, Eye, Copy } from 'lucide-react';
import { Card, Button } from '@consulting19/shared';
import { supabase } from '@consulting19/shared';
import { useI18n } from '@consulting19/shared';
import AdminLayout from '../../components/layouts/AdminLayout';
import TranslateButton from '../../components/TranslateButton';
import { Helmet } from 'react-helmet-async';

interface EmailTemplate {
  id: string;
  template_key: string;
  category: string;
  name: string;
  subject_en: string;
  subject_tr: string;
  subject_pt: string;
  body_en: string;
  body_tr: string;
  body_pt: string;
  variables: string[];
  is_active: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

const AdminEmailTemplates = () => {
  const { t } = useI18n();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [testEmail, setTestEmail] = useState('');
  const [sendingTest, setSendingTest] = useState(false);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'system', label: t('emailTemplates.categories.system') },
    { value: 'onboarding', label: t('emailTemplates.categories.onboarding') },
    { value: 'documents', label: t('emailTemplates.categories.documents') },
    { value: 'services', label: t('emailTemplates.categories.services') },
    { value: 'invoices', label: t('emailTemplates.categories.invoices') },
    { value: 'notifications', label: t('emailTemplates.categories.notifications') },
  ];

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching templates:', error);
      } else {
        setTemplates(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewTemplate = () => {
    setEditingTemplate({
      id: '',
      template_key: '',
      category: 'system',
      name: '',
      subject_en: '',
      subject_tr: '',
      subject_pt: '',
      body_en: '',
      body_tr: '',
      body_pt: '',
      variables: [],
      is_active: true,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setShowEditor(true);
  };

  const editTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setShowEditor(true);
  };

  const saveTemplate = async (templateData: EmailTemplate) => {
    try {
      if (templateData.id) {
        // Update existing template
        const { error } = await supabase
          .from('email_templates')
          .update({
            name: templateData.name,
            category: templateData.category,
            subject_en: templateData.subject_en,
            subject_tr: templateData.subject_tr,
            subject_pt: templateData.subject_pt,
            body_en: templateData.body_en,
            body_tr: templateData.body_tr,
            body_pt: templateData.body_pt,
            variables: templateData.variables,
            is_active: templateData.is_active,
            version: templateData.version + 1,
          })
          .eq('id', templateData.id);

        if (error) throw error;

        // Create version history
        await supabase
          .from('email_template_versions')
          .insert({
            template_id: templateData.id,
            version: templateData.version + 1,
            subject_en: templateData.subject_en,
            subject_tr: templateData.subject_tr,
            subject_pt: templateData.subject_pt,
            body_en: templateData.body_en,
            body_tr: templateData.body_tr,
            body_pt: templateData.body_pt,
            variables: templateData.variables,
          });

        await supabase.rpc('log_admin_action', {
          action_type: 'update',
          resource_type: 'email_template',
          resource_id: templateData.id
        });
      } else {
        // Create new template
        const { error } = await supabase
          .from('email_templates')
          .insert({
            template_key: templateData.template_key,
            name: templateData.name,
            category: templateData.category,
            subject_en: templateData.subject_en,
            subject_tr: templateData.subject_tr,
            subject_pt: templateData.subject_pt,
            body_en: templateData.body_en,
            body_tr: templateData.body_tr,
            body_pt: templateData.body_pt,
            variables: templateData.variables,
            is_active: templateData.is_active,
          });

        if (error) throw error;

        await supabase.rpc('log_admin_action', {
          action_type: 'create',
          resource_type: 'email_template',
          resource_id: templateData.template_key
        });
      }

      fetchTemplates();
      setShowEditor(false);
      setEditingTemplate(null);
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const sendTestEmail = async (template: EmailTemplate) => {
    if (!testEmail) return;

    setSendingTest(true);
    try {
      // This would integrate with your email service
      console.log('Sending test email:', {
        to: testEmail,
        template: template.template_key,
        subject: template.subject_en,
        body: template.body_en,
      });

      await supabase.rpc('log_telemetry_event', {
        event_type: 'email_template_sent_test',
        event_data: { template_id: template.id, recipient: testEmail }
      });

      alert(t('notifications.emailSent'));
    } catch (error) {
      console.error('Error sending test email:', error);
    } finally {
      setSendingTest(false);
    }
  };

  const filteredTemplates = templates.filter(template => 
    selectedCategory === 'all' || template.category === selectedCategory
  );

  if (loading) {
    return (
      <AdminLayout>
        <Helmet>
          <title>{t('emailTemplates.title')} - Consulting19</title>
        </Helmet>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (showEditor && editingTemplate) {
    return (
      <AdminLayout>
        <Helmet>
          <title>{editingTemplate.id ? t('common.edit') : t('common.add')} {t('emailTemplates.title')} - Consulting19</title>
        </Helmet>
        <EmailTemplateEditor
          template={editingTemplate}
          onSave={saveTemplate}
          onCancel={() => {
            setShowEditor(false);
            setEditingTemplate(null);
          }}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>{t('emailTemplates.title')} - Consulting19</title>
      </Helmet>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('emailTemplates.title')}</h1>
            <p className="text-gray-600">{t('emailTemplates.subtitle')}</p>
          </div>
          <Button onClick={createNewTemplate} icon={Plus}>
            {t('content.addNew')}
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <Card.Body>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                {t('common.filter')}:
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Templates List */}
      <div className="space-y-4">
        {filteredTemplates.map((template) => (
          <Card key={template.id}>
            <Card.Body>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {template.category}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      template.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      v{template.version}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Key:</strong> {template.template_key}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <strong>Subject:</strong> {template.subject_en}
                  </div>
                  
                  {template.variables.length > 0 && (
                    <div className="text-xs text-gray-500 mt-2">
                      <strong>Variables:</strong> {template.variables.join(', ')}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 mr-4">
                    <input
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="test@example.com"
                      className="px-2 py-1 text-xs border border-gray-300 rounded"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Send}
                      onClick={() => sendTestEmail(template)}
                      disabled={!testEmail || sendingTest}
                      loading={sendingTest}
                    >
                      {t('emailTemplates.testSend')}
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Eye}
                  >
                    {t('content.preview')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Edit}
                    onClick={() => editTemplate(template)}
                  >
                    {t('content.edit')}
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}

        {filteredTemplates.length === 0 && (
          <Card>
            <Card.Body className="text-center py-12">
              <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('emptyStates.noContent')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('emptyStates.createFirst', { item: 'template' })}
              </p>
              <Button onClick={createNewTemplate} icon={Plus}>
                {t('content.addNew')}
              </Button>
            </Card.Body>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

// Email Template Editor Component
interface EmailTemplateEditorProps {
  template: EmailTemplate;
  onSave: (template: EmailTemplate) => void;
  onCancel: () => void;
}

const EmailTemplateEditor: React.FC<EmailTemplateEditorProps> = ({ template, onSave, onCancel }) => {
  const { t } = useI18n();
  const [formData, setFormData] = useState(template);
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'tr' | 'pt'>('en');

  const handleChange = (field: string, value: string | string[] | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTranslate = (field: string, translatedText: string) => {
    if (activeLanguage === 'en') return;
    handleChange(`${field}_${activeLanguage}`, translatedText);
  };

  const sampleVariables = [
    '{{client_name}}', '{{consultant_name}}', '{{service_name}}', 
    '{{document_name}}', '{{amount}}', '{{due_date}}', '{{notes}}'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {template.id ? t('common.edit') : t('common.add')} {t('emailTemplates.title')}
        </h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
          <Button onClick={() => onSave(formData)}>
            {t('emailTemplates.saveVersion')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Body>
              {/* Basic Info */}
              <div className="space-y-4 mb-6">
                {!template.id && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('emailTemplates.templateKey')}
                    </label>
                    <input
                      type="text"
                      value={formData.template_key}
                      onChange={(e) => handleChange('template_key', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., document_requested"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.slice(1).map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Language Tabs */}
              <div className="flex space-x-4 mb-6">
                {[
                  { code: 'en', name: 'English', flag: '🇺🇸' },
                  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
                  { code: 'pt', name: 'Português', flag: '🇵🇹' },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setActiveLanguage(lang.code as 'en' | 'tr' | 'pt')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeLanguage === lang.code
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>

              {/* Subject */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('emailTemplates.subject')}
                  </label>
                  {activeLanguage !== 'en' && (
                    <TranslateButton
                      sourceText={formData.subject_en}
                      targetLang={activeLanguage}
                      onTranslated={(text) => handleTranslate('subject', text)}
                    />
                  )}
                </div>
                <input
                  type="text"
                  value={formData[`subject_${activeLanguage}` as keyof EmailTemplate] as string || ''}
                  onChange={(e) => handleChange(`subject_${activeLanguage}`, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Subject in ${activeLanguage.toUpperCase()}`}
                />
              </div>

              {/* Body */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('emailTemplates.body')}
                  </label>
                  {activeLanguage !== 'en' && (
                    <TranslateButton
                      sourceText={formData.body_en}
                      targetLang={activeLanguage}
                      onTranslated={(text) => handleTranslate('body', text)}
                    />
                  )}
                </div>
                <textarea
                  value={formData[`body_${activeLanguage}` as keyof EmailTemplate] as string || ''}
                  onChange={(e) => handleChange(`body_${activeLanguage}`, e.target.value)}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder={`Email body in ${activeLanguage.toUpperCase()}`}
                />
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Variables */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">{t('emailTemplates.variablesHelp')}</h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-2">
                {sampleVariables.map((variable) => (
                  <button
                    key={variable}
                    onClick={() => {
                      const textarea = document.querySelector(`textarea`) as HTMLTextAreaElement;
                      if (textarea) {
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const currentValue = formData[`body_${activeLanguage}` as keyof EmailTemplate] as string || '';
                        const newValue = currentValue.substring(0, start) + variable + currentValue.substring(end);
                        handleChange(`body_${activeLanguage}`, newValue);
                      }
                    }}
                    className="flex items-center space-x-2 w-full px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    <span className="font-mono">{variable}</span>
                  </button>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Preview */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">{t('content.preview')}</h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Subject:</div>
                  <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                    {formData[`subject_${activeLanguage}` as keyof EmailTemplate] as string || 'No subject'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Body:</div>
                  <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded max-h-32 overflow-y-auto">
                    <div dangerouslySetInnerHTML={{ 
                      __html: (formData[`body_${activeLanguage}` as keyof EmailTemplate] as string || 'No content')
                        .replace(/\n/g, '<br>')
                        .replace(/{{(\w+)}}/g, '<span class="bg-yellow-200 px-1 rounded">$1</span>')
                    }} />
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminEmailTemplates;