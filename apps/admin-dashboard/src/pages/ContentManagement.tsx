import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Upload, 
  Eye, 
  Languages, 
  Loader, 
  Plus, 
  Edit, 
  Trash2, 
  Image as ImageIcon,
  X,
  FileText,
  Globe
} from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { deepLTranslator, useAuth } from '@consulting19/shared';
import { supabase } from '@consulting19/supabase';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

interface MarketingPage {
  id: string;
  page_key: string;
  content_en: Record<string, any>;
  content_tr?: Record<string, any>;
  content_pt?: Record<string, any>;
  meta_title_en?: string;
  meta_description_en?: string;
  meta_keywords_en?: string;
  meta_title_tr?: string;
  meta_description_tr?: string;
  meta_keywords_tr?: string;
  meta_title_pt?: string;
  meta_description_pt?: string;
  meta_keywords_pt?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

const ContentManagement = () => {
  const { user } = useAuth();
  const [pages, setPages] = useState<MarketingPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<MarketingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form data for editing
  const [formData, setFormData] = useState({
    page_key: '',
    content_en: '{\n  "page_title": "",\n  "hero_title": "",\n  "hero_description": "",\n  "sections": []\n}',
    content_tr: '{\n  "page_title": "",\n  "hero_title": "",\n  "hero_description": "",\n  "sections": []\n}',
    content_pt: '{\n  "page_title": "",\n  "hero_title": "",\n  "hero_description": "",\n  "sections": []\n}',
    meta_title_en: '',
    meta_description_en: '',
    meta_keywords_en: '',
    meta_title_tr: '',
    meta_description_tr: '',
    meta_keywords_tr: '',
    meta_title_pt: '',
    meta_description_pt: '',
    meta_keywords_pt: '',
    image_url: '',
  });

  // List of pages that admin can manage
  const manageablePageKeys = [
    'homepage_hero',
    'services_overview',
    'about_page',
    'contact_page',
    'compliance_page',
    'privacy_page',
    'cookies_page',
    'terms_page',
    'faq_page', // Added FAQ page for management
    'ai_assistant_page', // Added AI Assistant page for management
    'partners_page', // Added Partners page for management
    'documentation_page', // Added Documentation page for management
  ];

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('marketing_pages')
        .select('*')
        .in('page_key', manageablePageKeys) // Fetch only manageable pages
        .order('page_key', { ascending: true });

      if (error) {
        console.error('Error fetching pages:', error);
      } else {
        setPages(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPage = (page: MarketingPage) => {
    setSelectedPage(page);
    
    // Ensure content fields have valid JSON structure
    const ensureValidJson = (content: any) => {
      if (!content || Object.keys(content).length === 0) {
        return {}; // Return empty object for empty/invalid JSON
      }
      return content;
    };
    
    setFormData({
      page_key: page.page_key,
      content_en: JSON.stringify(ensureValidJson(page.content_en), null, 2),
      content_tr: JSON.stringify(ensureValidJson(page.content_tr), null, 2),
      content_pt: JSON.stringify(ensureValidJson(page.content_pt), null, 2),
      meta_title_en: page.meta_title_en || '',
      meta_description_en: page.meta_description_en || '',
      meta_keywords_en: page.meta_keywords_en || '',
      meta_title_tr: page.meta_title_tr || '',
      meta_description_tr: page.meta_description_tr || '',
      meta_keywords_tr: page.meta_keywords_tr || '',
      meta_title_pt: page.meta_title_pt || '',
      meta_description_pt: page.meta_description_pt || '',
      meta_keywords_pt: page.meta_keywords_pt || '',
      image_url: page.image_url || '',
    });
  };

  const handleSave = async () => {
    if (!selectedPage) return;

    try {
      setSaving(true);

      // Parse JSON content
      let contentEn, contentTr, contentPt;
      try {
        contentEn = JSON.parse(formData.content_en);
        contentTr = formData.content_tr ? JSON.parse(formData.content_tr) : {};
        contentPt = formData.content_pt ? JSON.parse(formData.content_pt) : {};
      } catch (parseError) {
        alert('Invalid JSON format in content fields');
        return;
      }

      const { error } = await supabase
        .from('marketing_pages')
        .update({
          content_en: contentEn,
          content_tr: contentTr,
          content_pt: contentPt,
          meta_title_en: formData.meta_title_en || null,
          meta_description_en: formData.meta_description_en || null,
          meta_keywords_en: formData.meta_keywords_en || null,
          meta_title_tr: formData.meta_title_tr || null,
          meta_description_tr: formData.meta_description_tr || null,
          meta_keywords_tr: formData.meta_keywords_tr || null,
          meta_title_pt: formData.meta_title_pt || null,
          meta_description_pt: formData.meta_description_pt || null,
          meta_keywords_pt: formData.meta_keywords_pt || null,
          image_url: formData.image_url || null,
        })
        .eq('id', selectedPage.id);

      if (error) {
        console.error('Error saving page:', error);
        alert('Error saving page');
      } else {
        alert('Page saved successfully!');
        fetchPages(); // Re-fetch pages to update the list
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleTranslate = async () => {
    if (!formData.content_en.trim() && !formData.meta_title_en.trim()) {
      alert('Please fill in the English content or meta title first for translation.');
      return;
    }

    setIsTranslating(true);
    try {
      const contentEn = JSON.parse(formData.content_en);
      
      // Translate to Turkish
      const turkishResult = await deepLTranslator.translateMarketingContent({
        content_en: contentEn,
        meta_title_en: formData.meta_title_en,
        meta_description_en: formData.meta_description_en,
        meta_keywords_en: formData.meta_keywords_en,
      }, 'TR');

      // Translate to Portuguese
      const portugueseResult = await deepLTranslator.translateMarketingContent({
        content_en: contentEn,
        meta_title_en: formData.meta_title_en,
        meta_description_en: formData.meta_description_en,
        meta_keywords_en: formData.meta_keywords_en,
      }, 'PT');

      setFormData(prev => ({
        ...prev,
        content_tr: JSON.stringify(turkishResult.content, null, 2),
        content_pt: JSON.stringify(portugueseResult.content, null, 2),
        meta_title_tr: turkishResult.meta_title,
        meta_description_tr: turkishResult.meta_description,
        meta_keywords_tr: turkishResult.meta_keywords,
        meta_title_pt: portugueseResult.meta_title,
        meta_description_pt: portugueseResult.meta_description,
        meta_keywords_pt: portugueseResult.meta_keywords,
      }));

      alert('Translation completed successfully!');
    } catch (error) {
      console.error('Translation error:', error);
      alert('Translation failed. Please check your content format and try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('marketing-images')
        .upload(fileName, file);

      if (error) {
        console.error('Upload error:', error);
        alert('Failed to upload image');
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('marketing-images')
        .getPublicUrl(fileName);

      setFormData(prev => ({
        ...prev,
        image_url: urlData.publicUrl
      }));

      alert('Image uploaded successfully!');
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      const { error } = await supabase
        .from('marketing_pages')
        .delete()
        .eq('id', pageId);

      if (error) {
        console.error('Error deleting page:', error);
        alert('Error deleting page');
      } else {
        alert('Page deleted successfully!');
        setSelectedPage(null);
        fetchPages();
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading marketing content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management</h1>
                <p className="text-gray-600">Manage marketing pages content, SEO, and translations</p>
              </div>
              {/* Removed "Add New Page" button as pages are pre-defined */}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pages List */}
            <div className="lg:col-span-1">
              <Card>
                <Card.Header>
                  <h2 className="text-lg font-semibold text-gray-900">Marketing Pages</h2>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-2">
                    {pages.map((page) => (
                      <div
                        key={page.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedPage?.id === page.id
                            ? 'bg-blue-100 border border-blue-300'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        onClick={() => handleSelectPage(page)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {page.page_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </h3>
                            <p className="text-xs text-gray-500">
                              Updated: {new Date(page.updated_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-1">
                            {page.content_tr && Object.keys(page.content_tr).length > 0 && (
                              <span className="w-2 h-2 bg-red-500 rounded-full" title="Turkish content available"></span>
                            )}
                            {page.content_pt && Object.keys(page.content_pt).length > 0 && (
                              <span className="w-2 h-2 bg-green-500 rounded-full" title="Portuguese content available"></span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </div>

            {/* Content Editor */}
            <div className="lg:col-span-2">
              {selectedPage ? (
                <div className="space-y-6">
                  {/* Header */}
                  <Card>
                    <Card.Header>
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-900">
                          Editing: {selectedPage.page_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h2>
                        <div className="flex space-x-2">
                          <Button
                            icon={Languages}
                            iconPosition="left"
                            onClick={handleTranslate}
                            disabled={isTranslating || (!formData.content_en.trim() && !formData.meta_title_en.trim())}
                            loading={isTranslating}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            {isTranslating ? 'Translating...' : 'Translate All'}
                          </Button>
                          <Button
                            icon={Save}
                            iconPosition="left"
                            onClick={handleSave}
                            loading={saving}
                          >
                            {saving ? 'Saving...' : 'Save Changes'}
                          </Button>
                          {/* Removed delete button for pre-defined pages */}
                        </div>
                      </div>
                    </Card.Header>
                  </Card>

                  {/* Image Upload (only for pages that have image_url) */}
                  {(selectedPage.page_key === 'homepage_hero' || selectedPage.page_key === 'about_page') && (
                    <Card>
                      <Card.Header>
                        <h3 className="text-lg font-semibold text-gray-900">Featured Image</h3>
                      </Card.Header>
                      <Card.Body>
                        <div className="space-y-4">
                          {formData.image_url && (
                            <div className="relative">
                              <img
                                src={formData.image_url}
                                alt="Featured"
                                className="w-full h-48 object-cover rounded-lg"
                              />
                              <button
                                onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-4">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              id="image-upload"
                            />
                            <label htmlFor="image-upload">
                              <Button
                                as="span"
                                icon={Upload}
                                iconPosition="left"
                                loading={uploadingImage}
                                disabled={uploadingImage}
                              >
                                {uploadingImage ? 'Uploading...' : 'Upload Image'}
                              </Button>
                            </label>
                            
                            <input
                              type="url"
                              value={formData.image_url}
                              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                              placeholder="Or paste image URL..."
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  )}

                  {/* SEO Meta Data */}
                  <Card>
                    <Card.Header>
                      <h3 className="text-lg font-semibold text-gray-900">SEO Meta Data</h3>
                    </Card.Header>
                    <Card.Body>
                      <div className="space-y-6">
                        {/* English Meta */}
                        <div className="border-b border-gray-200 pb-6">
                          <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="mr-2">🇺🇸</span>
                            English Meta Data
                          </h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Title
                              </label>
                              <input
                                type="text"
                                value={formData.meta_title_en}
                                onChange={(e) => setFormData(prev => ({ ...prev, meta_title_en: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="SEO title for search engines"
                                maxLength={60}
                              />
                              <div className="text-xs text-gray-500 mt-1">
                                {formData.meta_title_en.length}/60 characters
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Description
                              </label>
                              <textarea
                                value={formData.meta_description_en}
                                onChange={(e) => setFormData(prev => ({ ...prev, meta_description_en: e.target.value }))}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Brief description for search engines"
                                maxLength={160}
                              />
                              <div className="text-xs text-gray-500 mt-1">
                                {formData.meta_description_en.length}/160 characters
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Keywords
                              </label>
                              <input
                                type="text"
                                value={formData.meta_keywords_en}
                                onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords_en: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="keyword1, keyword2, keyword3"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Turkish Meta */}
                        <div className="border-b border-gray-200 pb-6">
                          <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="mr-2">🇹🇷</span>
                            Turkish Meta Data
                          </h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Title (Turkish)
                              </label>
                              <input
                                type="text"
                                value={formData.meta_title_tr}
                                onChange={(e) => setFormData(prev => ({ ...prev, meta_title_tr: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Türkçe SEO başlığı"
                                maxLength={60}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Description (Turkish)
                              </label>
                              <textarea
                                value={formData.meta_description_tr}
                                onChange={(e) => setFormData(prev => ({ ...prev, meta_description_tr: e.target.value }))}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Türkçe kısa açıklama"
                                maxLength={160}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Keywords (Turkish)
                              </label>
                              <input
                                type="text"
                                value={formData.meta_keywords_tr}
                                onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords_tr: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="anahtar1, anahtar2, anahtar3"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Portuguese Meta */}
                        <div>
                          <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="mr-2">🇵🇹</span>
                            Portuguese Meta Data
                          </h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Title (Portuguese)
                              </label>
                              <input
                                type="text"
                                value={formData.meta_title_pt}
                                onChange={(e) => setFormData(prev => ({ ...prev, meta_title_pt: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Título SEO em português"
                                maxLength={60}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Description (Portuguese)
                              </label>
                              <textarea
                                value={formData.meta_description_pt}
                                onChange={(e) => setFormData(prev => ({ ...prev, meta_description_pt: e.target.value }))}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Breve descrição em português"
                                maxLength={160}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Keywords (Portuguese)
                              </label>
                              <input
                                type="text"
                                value={formData.meta_keywords_pt}
                                onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords_pt: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="palavra1, palavra2, palavra3"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>

                  {/* Content Editor */}
                  <Card>
                    <Card.Header>
                      <h3 className="text-lg font-semibold text-gray-900">Page Content (JSON)</h3>
                    </Card.Header>
                    <Card.Body>
                      <div className="space-y-6">
                        {isTranslating && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center">
                              <Loader className="w-5 h-5 text-blue-600 animate-spin mr-3" />
                              <span className="text-blue-800">Translating content using DeepL AI...</span>
                            </div>
                          </div>
                        )}

                        {/* English Content */}
                        <div className="border-b border-gray-200 pb-6">
                          <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="mr-2">🇺🇸</span>
                            English Content (Primary)
                          </h4>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Content JSON
                            </label>
                            <textarea
                              value={formData.content_en}
                              onChange={(e) => setFormData(prev => ({ ...prev, content_en: e.target.value }))}
                              rows={15}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                              placeholder='{\n  "page_title": "Page Title",\n  "hero_title": "Hero Title",\n  "hero_description": "Hero description",\n  "sections": []\n}'
                            />
                          </div>
                        </div>

                        {/* Turkish Content */}
                        <div className="border-b border-gray-200 pb-6">
                          <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="mr-2">🇹🇷</span>
                            Turkish Content
                          </h4>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Content JSON (Turkish)
                            </label>
                            <textarea
                              value={formData.content_tr}
                              onChange={(e) => setFormData(prev => ({ ...prev, content_tr: e.target.value }))}
                              rows={12}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                              placeholder='{\n  "page_title": "Sayfa Başlığı",\n  "hero_title": "Ana Başlık",\n  "hero_description": "Ana açıklama",\n  "sections": []\n}'
                            />
                          </div>
                        </div>

                        {/* Portuguese Content */}
                        <div>
                          <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="mr-2">🇵🇹</span>
                            Portuguese Content
                          </h4>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Content JSON (Portuguese)
                            </label>
                            <textarea
                              value={formData.content_pt}
                              onChange={(e) => setFormData(prev => ({ ...prev, content_pt: e.target.value }))}
                              rows={12}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                              placeholder='{\n  "page_title": "Título da Página",\n  "hero_title": "Título Principal",\n  "hero_description": "Descrição principal",\n  "sections": []\n}'
                            />
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ) : (
                <Card>
                  <Card.Body className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Select a Page to Edit
                    </h3>
                    <p className="text-gray-600">
                      Choose a marketing page from the list to start editing its content and SEO settings.
                    </p>
                    {/* Removed "Create New Page" button */}
                  </Card.Body>
                </Card>
              )}
            </div>
          </div>

          {/* Removed Add New Page Modal */}
        </main>
      </div>
    </div>
  );
};

export default ContentManagement;
