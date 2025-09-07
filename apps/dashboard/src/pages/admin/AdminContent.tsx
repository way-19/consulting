import React, { useState, useEffect } from 'react';
import { FileText, Plus, Edit, Trash2, Eye, Globe, ToggleLeft, ToggleRight } from 'lucide-react';
import { Card, Button } from '@consulting19/shared';
import { supabase } from '@consulting19/shared';
import { useI18n } from '../../hooks/useI18n';
import AdminLayout from '../../components/layouts/AdminLayout';
import TranslateButton from '../../components/TranslateButton';
import { Helmet } from 'react-helmet-async';

interface MarketingPage {
  id: string;
  page_key: string;
  content_en: any;
  content_tr: any;
  content_pt: any;
  meta_title_en: string;
  meta_description_en: string;
  meta_keywords_en: string;
  meta_title_tr: string;
  meta_description_tr: string;
  meta_keywords_tr: string;
  meta_title_pt: string;
  meta_description_pt: string;
  meta_keywords_pt: string;
  is_active: boolean;
  updated_at: string;
}

const AdminContent = () => {
  const { t, formatDateTime } = useI18n();
  const [pages, setPages] = useState<MarketingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pages');
  const [editingPage, setEditingPage] = useState<MarketingPage | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('marketing_pages')
        .select('*')
        .order('page_key');

      if (error) {
        console.error('Error fetching pages:', error);
      } else {
        setPages(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePageStatus = async (pageId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('marketing_pages')
        .update({ is_active: !currentStatus })
        .eq('id', pageId);

      if (error) {
        console.error('Error updating page status:', error);
      } else {
        fetchPages();
        
        // Log action
        await supabase.rpc('log_admin_action', {
          action_type: !currentStatus ? 'publish' : 'unpublish',
          resource_type: 'marketing_page',
          resource_id: pageId
        });

        // Log telemetry
        await supabase.rpc('log_telemetry_event', {
          event_type: 'page_published',
          event_data: { page_id: pageId, status: !currentStatus }
        });
      }
    } catch (error) {
      console.error('Error toggling page status:', error);
    }
  };

  const createNewPage = () => {
    setEditingPage({
      id: '',
      page_key: '',
      content_en: {},
      content_tr: {},
      content_pt: {},
      meta_title_en: '',
      meta_description_en: '',
      meta_keywords_en: '',
      meta_title_tr: '',
      meta_description_tr: '',
      meta_keywords_tr: '',
      meta_title_pt: '',
      meta_description_pt: '',
      meta_keywords_pt: '',
      is_active: false,
      updated_at: new Date().toISOString(),
    });
    setShowEditor(true);
  };

  const editPage = (page: MarketingPage) => {
    setEditingPage(page);
    setShowEditor(true);
  };

  const savePage = async (pageData: MarketingPage) => {
    try {
      if (pageData.id) {
        // Update existing page
        const { error } = await supabase
          .from('marketing_pages')
          .update({
            content_en: pageData.content_en,
            content_tr: pageData.content_tr,
            content_pt: pageData.content_pt,
            meta_title_en: pageData.meta_title_en,
            meta_description_en: pageData.meta_description_en,
            meta_keywords_en: pageData.meta_keywords_en,
            meta_title_tr: pageData.meta_title_tr,
            meta_description_tr: pageData.meta_description_tr,
            meta_keywords_tr: pageData.meta_keywords_tr,
            meta_title_pt: pageData.meta_title_pt,
            meta_description_pt: pageData.meta_description_pt,
            meta_keywords_pt: pageData.meta_keywords_pt,
          })
          .eq('id', pageData.id);

        if (error) throw error;

        await supabase.rpc('log_admin_action', {
          action_type: 'update',
          resource_type: 'marketing_page',
          resource_id: pageData.id
        });
      } else {
        // Create new page
        const { error } = await supabase
          .from('marketing_pages')
          .insert({
            page_key: pageData.page_key,
            content_en: pageData.content_en,
            content_tr: pageData.content_tr,
            content_pt: pageData.content_pt,
            meta_title_en: pageData.meta_title_en,
            meta_description_en: pageData.meta_description_en,
            meta_keywords_en: pageData.meta_keywords_en,
            meta_title_tr: pageData.meta_title_tr,
            meta_description_tr: pageData.meta_description_tr,
            meta_keywords_tr: pageData.meta_keywords_tr,
            meta_title_pt: pageData.meta_title_pt,
            meta_description_pt: pageData.meta_description_pt,
            meta_keywords_pt: pageData.meta_keywords_pt,
          });

        if (error) throw error;

        await supabase.rpc('log_admin_action', {
          action_type: 'create',
          resource_type: 'marketing_page',
          resource_id: pageData.page_key
        });
      }

      fetchPages();
      setShowEditor(false);
      setEditingPage(null);
    } catch (error) {
      console.error('Error saving page:', error);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Helmet>
          <title>{t('content.title')} - Consulting19</title>
        </Helmet>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (showEditor && editingPage) {
    return (
      <AdminLayout>
        <Helmet>
          <title>{editingPage.id ? t('common.edit') : t('common.add')} {t('content.pages')} - Consulting19</title>
        </Helmet>
        <PageEditor
          page={editingPage}
          onSave={savePage}
          onCancel={() => {
            setShowEditor(false);
            setEditingPage(null);
          }}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>{t('content.title')} - Consulting19</title>
      </Helmet>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('content.title')}</h1>
            <p className="text-gray-600">{t('content.subtitle')}</p>
          </div>
          <Button onClick={createNewPage} icon={Plus}>
            {t('content.addNew')}
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'pages', label: t('content.pages'), icon: FileText },
              { id: 'services', label: t('content.services'), icon: Globe },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Pages Tab */}
      {activeTab === 'pages' && (
        <div className="space-y-4">
          {pages.map((page) => (
            <Card key={page.id}>
              <Card.Body>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{page.page_key}</h3>
                      <button
                        onClick={() => togglePageStatus(page.id, page.is_active)}
                        className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                          page.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {page.is_active ? (
                          <ToggleRight className="w-3 h-3" />
                        ) : (
                          <ToggleLeft className="w-3 h-3" />
                        )}
                        <span>{page.is_active ? t('pages.active') : t('pages.inactive')}</span>
                      </button>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      {page.content_en?.page_title || page.meta_title_en || 'No title'}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {t('pages.lastUpdated')}: {formatDateTime(page.updated_at)}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Eye}
                      onClick={() => window.open(`http://localhost:5173/${page.page_key}`, '_blank')}
                    >
                      {t('content.viewLive')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Edit}
                      onClick={() => editPage(page)}
                    >
                      {t('content.edit')}
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}

          {pages.length === 0 && (
            <Card>
              <Card.Body className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('emptyStates.noContent')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('emptyStates.createFirst', { item: 'page' })}
                </p>
                <Button onClick={createNewPage} icon={Plus}>
                  {t('content.addNew')}
                </Button>
              </Card.Body>
            </Card>
          )}
        </div>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <Card>
          <Card.Body className="text-center py-12">
            <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('services.title')}
            </h3>
            <p className="text-gray-600 mb-6">
              Services management will be implemented here
            </p>
            <p className="text-sm text-orange-600">
              {t('services.lockSlugWarning')}
            </p>
          </Card.Body>
        </Card>
      )}
    </AdminLayout>
  );
};

// Page Editor Component
interface PageEditorProps {
  page: MarketingPage;
  onSave: (page: MarketingPage) => void;
  onCancel: () => void;
}

const PageEditor: React.FC<PageEditorProps> = ({ page, onSave, onCancel }) => {
  const { t } = useI18n();
  const [formData, setFormData] = useState(page);
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'tr' | 'pt'>('en');

  const handleContentChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [`content_${activeLanguage}`]: {
        ...prev[`content_${activeLanguage}` as keyof MarketingPage],
        [field]: value
      }
    }));
  };

  const handleMetaChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [`${field}_${activeLanguage}`]: value
    }));
  };

  const handleTranslate = (field: string, translatedText: string) => {
    if (activeLanguage === 'en') return;
    
    if (field.startsWith('meta_')) {
      handleMetaChange(field.replace('meta_', ''), translatedText);
    } else {
      handleContentChange(field, translatedText);
    }
  };

  const currentContent = formData[`content_${activeLanguage}` as keyof MarketingPage] as any || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {page.id ? t('common.edit') : t('common.add')} {t('content.pages')}
        </h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
          <Button onClick={() => onSave(formData)}>
            {t('common.save')}
          </Button>
        </div>
      </div>

      {/* Language Tabs */}
      <Card>
        <Card.Body>
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

          {/* Page Key (only for new pages) */}
          {!page.id && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('pages.pageKey')}
              </label>
              <input
                type="text"
                value={formData.page_key}
                onChange={(e) => setFormData(prev => ({ ...prev, page_key: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., about_page, contact_page"
              />
            </div>
          )}

          {/* Content Fields */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t('content.metaTitle')}
                </label>
                {activeLanguage !== 'en' && (
                  <TranslateButton
                    sourceText={formData.meta_title_en}
                    targetLang={activeLanguage}
                    onTranslated={(text) => handleTranslate('meta_title', text)}
                  />
                )}
              </div>
              <input
                type="text"
                value={formData[`meta_title_${activeLanguage}` as keyof MarketingPage] as string || ''}
                onChange={(e) => handleMetaChange('meta_title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Meta title in ${activeLanguage.toUpperCase()}`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t('content.metaDescription')}
                </label>
                {activeLanguage !== 'en' && (
                  <TranslateButton
                    sourceText={formData.meta_description_en}
                    targetLang={activeLanguage}
                    onTranslated={(text) => handleTranslate('meta_description', text)}
                  />
                )}
              </div>
              <textarea
                value={formData[`meta_description_${activeLanguage}` as keyof MarketingPage] as string || ''}
                onChange={(e) => handleMetaChange('meta_description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Meta description in ${activeLanguage.toUpperCase()}`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Page Title
                </label>
                {activeLanguage !== 'en' && (
                  <TranslateButton
                    sourceText={currentContent.page_title || ''}
                    targetLang={activeLanguage}
                    onTranslated={(text) => handleTranslate('page_title', text)}
                  />
                )}
              </div>
              <input
                type="text"
                value={currentContent.page_title || ''}
                onChange={(e) => handleContentChange('page_title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Page title in ${activeLanguage.toUpperCase()}`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Hero Description
                </label>
                {activeLanguage !== 'en' && (
                  <TranslateButton
                    sourceText={currentContent.hero_description || ''}
                    targetLang={activeLanguage}
                    onTranslated={(text) => handleTranslate('hero_description', text)}
                  />
                )}
              </div>
              <textarea
                value={currentContent.hero_description || ''}
                onChange={(e) => handleContentChange('hero_description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Hero description in ${activeLanguage.toUpperCase()}`}
              />
            </div>
          </div>

          {/* SEO Preview */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">{t('content.seoPreview')}</h3>
            <div className="space-y-2">
              <div className="text-blue-600 text-lg">
                {formData[`meta_title_${activeLanguage}` as keyof MarketingPage] as string || 'Page Title'}
              </div>
              <div className="text-green-600 text-sm">
                consulting19.com/{page.page_key}
              </div>
              <div className="text-gray-600 text-sm">
                {formData[`meta_description_${activeLanguage}` as keyof MarketingPage] as string || 'Page description'}
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminContent;