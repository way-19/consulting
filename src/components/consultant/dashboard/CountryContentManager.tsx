import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import {
  RefreshCw,
  Edit,
  Save,
  Plus,
  Trash2,
  FileText,
  Settings,
  Newspaper,
  Globe
} from 'lucide-react';

interface CountryContentManagerProps {
  consultantId: string;
}

const languages = ['tr', 'en'];

const metaPages = [
  { key: 'home', label: 'Home' },
  { key: 'services', label: 'Services' },
  { key: 'faqs', label: 'FAQs' },
  { key: 'blog', label: 'Blog' }
];

const CountryContentManager: React.FC<CountryContentManagerProps> = ({ consultantId }) => {
  const [assignedCountries, setAssignedCountries] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('services');
  const [activeLanguage, setActiveLanguage] = useState('tr');

  const [services, setServices] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({});

  const [editingItem, setEditingItem] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    image_url: '',
    features: [''],
    slug: ''
  });

  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    order_index: 0
  });

  const [postForm, setPostForm] = useState({
    title: '',
    slug: '',
    cover_image: '',
    excerpt: '',
    content: '',
    status: 'draft'
  });

  useEffect(() => {
    loadAssignedCountries();
  }, [consultantId]);

  useEffect(() => {
    if (selectedCountry) {
      loadCountryContent();
    }
  }, [selectedCountry, activeLanguage]);

  const loadAssignedCountries = async () => {
    try {
      const { data } = await supabase
        .from('consultant_country_assignments')
        .select(`countries(id, name, flag_emoji, slug)`)
        .eq('consultant_id', consultantId)
        .eq('status', true);

      const countries = data?.map((a: any) => a.countries).filter(Boolean) || [];
      setAssignedCountries(countries);
      if (countries.length > 0 && !selectedCountry) {
        setSelectedCountry(countries[0]);
      }
    } catch (err) {
      console.error('Error loading assigned countries:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCountryContent = async () => {
    if (!selectedCountry) return;
    try {
      const { data: servicesData } = await supabase
        .from('country_services')
        .select('*')
        .eq('country_id', selectedCountry.id)
        .eq('consultant_id', consultantId)
        .eq('language', activeLanguage)
        .order('created_at', { ascending: false });

      const { data: faqsData } = await supabase
        .from('country_faqs')
        .select('*')
        .eq('country_id', selectedCountry.id)
        .eq('consultant_id', consultantId)
        .eq('language', activeLanguage)
        .order('order_index', { ascending: true });

      const { data: postsData } = await supabase
        .from('country_news')
        .select('*')
        .eq('country_id', selectedCountry.id)
        .eq('consultant_id', consultantId)
        .eq('language', activeLanguage)
        .order('created_at', { ascending: false });

      const { data: metaRows } = await supabase
        .from('country_meta')
        .select('*')
        .eq('country_id', selectedCountry.id)
        .eq('consultant_id', consultantId);

      setServices(servicesData || []);
      setFaqs(faqsData || []);
      setPosts(postsData || []);

      const mapped: any = {};
      metaPages.forEach((p) => {
        mapped[p.key] = {};
        languages.forEach((l) => {
          mapped[p.key][l] = {
            meta_title: '',
            meta_description: '',
            meta_keywords: ''
          };
        });
      });

      metaRows?.forEach((row: any) => {
        if (!mapped[row.page]) mapped[row.page] = {};
        mapped[row.page][row.language] = {
          meta_title: row.meta_title || '',
          meta_description: row.meta_description || '',
          meta_keywords: row.meta_keywords || ''
        };
      });
      setMeta(mapped);
    } catch (err) {
      console.error('Error loading country content:', err);
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const serviceData = {
        country_id: selectedCountry.id,
        consultant_id: consultantId,
        language: activeLanguage,
        title: serviceForm.title,
        description: serviceForm.description,
        image_url: serviceForm.image_url,
        features: serviceForm.features.filter((f) => f.trim() !== ''),
        slug:
          serviceForm.slug || serviceForm.title.toLowerCase().replace(/\s+/g, '-')
      };

      let error;
      if (editingItem) {
        ({ error } = await supabase
          .from('country_services')
          .update(serviceData)
          .eq('id', editingItem.id));
      } else {
        ({ error } = await supabase
          .from('country_services')
          .insert(serviceData));
      }
      if (error) throw error;

      resetServiceForm();
      loadCountryContent();
      alert(editingItem ? 'Hizmet güncellendi!' : 'Yeni hizmet eklendi!');
    } catch (err) {
      console.error('Error saving service:', err);
      alert('Hizmet kaydedilirken hata oluştu.');
    }
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const faqData = {
        country_id: selectedCountry.id,
        consultant_id: consultantId,
        language: activeLanguage,
        question: faqForm.question,
        answer: faqForm.answer,
        order_index: faqForm.order_index
      };

      let error;
      if (editingItem) {
        ({ error } = await supabase
          .from('country_faqs')
          .update(faqData)
          .eq('id', editingItem.id));
      } else {
        ({ error } = await supabase.from('country_faqs').insert(faqData));
      }
      if (error) throw error;

      resetFaqForm();
      loadCountryContent();
      alert(editingItem ? 'SSS güncellendi!' : 'Yeni SSS eklendi!');
    } catch (err) {
      console.error('Error saving FAQ:', err);
      alert('SSS kaydedilirken hata oluştu.');
    }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const postData = {
        country_id: selectedCountry.id,
        consultant_id: consultantId,
        language: activeLanguage,
        title: postForm.title,
        slug: postForm.slug || postForm.title.toLowerCase().replace(/\s+/g, '-'),
        cover_image: postForm.cover_image,
        excerpt: postForm.excerpt,
        content: postForm.content,
        status: postForm.status
      };

      let error;
      if (editingItem) {
        ({ error } = await supabase
          .from('country_news')
          .update(postData)
          .eq('id', editingItem.id));
      } else {
        ({ error } = await supabase.from('country_news').insert(postData));
      }
      if (error) throw error;

      resetPostForm();
      loadCountryContent();
      alert(editingItem ? 'Yazı güncellendi!' : 'Yeni yazı eklendi!');
    } catch (err) {
      console.error('Error saving post:', err);
      alert('Yazı kaydedilirken hata oluştu.');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) return;
    const { error } = await supabase
      .from('country_services')
      .delete()
      .eq('id', id);
    if (!error) loadCountryContent();
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm("Bu SSS'yi silmek istediğinizden emin misiniz?")) return;
    const { error } = await supabase
      .from('country_faqs')
      .delete()
      .eq('id', id);
    if (!error) loadCountryContent();
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) return;
    const { error } = await supabase
      .from('country_news')
      .delete()
      .eq('id', id);
    if (!error) loadCountryContent();
  };

  const resetServiceForm = () => {
    setServiceForm({
      title: '',
      description: '',
      image_url: '',
      features: [''],
      slug: ''
    });
    setEditingItem(null);
    setShowAddForm(false);
  };

  const resetFaqForm = () => {
    setFaqForm({ question: '', answer: '', order_index: 0 });
    setEditingItem(null);
    setShowAddForm(false);
  };

  const resetPostForm = () => {
    setPostForm({
      title: '',
      slug: '',
      cover_image: '',
      excerpt: '',
      content: '',
      status: 'draft'
    });
    setEditingItem(null);
    setShowAddForm(false);
  };

  const handleEditService = (service: any) => {
    setServiceForm({
      title: service.title,
      description: service.description,
      image_url: service.image_url || '',
      features: service.features || [''],
      slug: service.slug || ''
    });
    setEditingItem(service);
    setActiveTab('services');
    setShowAddForm(true);
  };

  const handleEditFaq = (faq: any) => {
    setFaqForm({
      question: faq.question,
      answer: faq.answer,
      order_index: faq.order_index
    });
    setEditingItem(faq);
    setActiveTab('faqs');
    setShowAddForm(true);
  };

  const handleEditPost = (post: any) => {
    setPostForm({
      title: post.title,
      slug: post.slug,
      cover_image: post.cover_image || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      status: post.status || 'draft'
    });
    setEditingItem(post);
    setActiveTab('posts');
    setShowAddForm(true);
  };

  const addFeatureField = () => {
    setServiceForm({
      ...serviceForm,
      features: [...serviceForm.features, '']
    });
  };

  const updateFeature = (index: number, value: string) => {
    const features = [...serviceForm.features];
    features[index] = value;
    setServiceForm({ ...serviceForm, features });
  };

  const removeFeature = (index: number) => {
    const features = serviceForm.features.filter((_, i) => i !== index);
    setServiceForm({ ...serviceForm, features });
  };

  const updateMetaField = (
    page: string,
    lang: string,
    field: string,
    value: string
  ) => {
    setMeta((prev: any) => ({
      ...prev,
      [page]: {
        ...(prev[page] || {}),
        [lang]: {
          ...(prev[page]?.[lang] || {}),
          [field]: value
        }
      }
    }));
  };

  const handleSaveMeta = async () => {
    const rows: any[] = [];
    metaPages.forEach((p) => {
      languages.forEach((l) => {
        const d = meta[p.key]?.[l] || {
          meta_title: '',
          meta_description: '',
          meta_keywords: ''
        };
        rows.push({
          country_id: selectedCountry.id,
          consultant_id: consultantId,
          page: p.key,
          language: l,
          meta_title: d.meta_title,
          meta_description: d.meta_description,
          meta_keywords: d.meta_keywords
        });
      });
    });
    const { error } = await supabase.from('country_meta').upsert(rows);
    if (!error) {
      alert('Meta verileri kaydedildi!');
    } else {
      alert('Meta verileri kaydedilemedi.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Ülke İçerik Yönetimi
        </h2>
        <p className="text-gray-600">
          Atandığınız ülkelerin frontend içeriğini yönetin
        </p>
      </div>

      {/* Country Selection */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Atandığınız Ülkeler
        </h3>
        {assignedCountries.length === 0 ? (
          <p className="text-gray-600">
            No countries assigned to you yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assignedCountries.map((country) => (
              <button
                key={country.id}
                onClick={() => setSelectedCountry(country)}
                className={`p-4 border rounded-xl text-left transition-colors ${
                  selectedCountry?.id === country.id
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{country.flag_emoji}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {country.name}
                    </h4>
                    <p className="text-sm text-gray-600">İçerik yönetimi</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content Management */}
      {selectedCountry && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <span className="text-2xl mr-3">{selectedCountry.flag_emoji}</span>
              {selectedCountry.name} İçerik Yönetimi
            </h3>
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setActiveLanguage(lang);
                      setShowAddForm(false);
                      setEditingItem(null);
                    }}
                    className={`px-3 py-1 rounded-md text-sm ${
                      activeLanguage === lang
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
              <button
                onClick={loadCountryContent}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {[
                { key: 'services', label: 'Hizmetler', icon: Settings },
                { key: 'faqs', label: 'SSS', icon: FileText },
                { key: 'posts', label: 'Haberler & Blog', icon: Newspaper },
                { key: 'seo', label: 'SEO & Meta', icon: Globe }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setShowAddForm(false);
                    setEditingItem(null);
                  }}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'services' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {selectedCountry.name} Hizmetleri ({services.length})
                  </h4>
                  <button
                    onClick={() => {
                      setShowAddForm(!showAddForm);
                      setEditingItem(null);
                      resetServiceForm();
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Yeni Hizmet</span>
                  </button>
                </div>

                {showAddForm && (
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <h5 className="text-md font-semibold text-gray-900 mb-4">
                      {editingItem ? 'Hizmeti Düzenle' : 'Yeni Hizmet Ekle'}
                    </h5>
                    <form onSubmit={handleSaveService} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hizmet Başlığı *
                          </label>
                          <input
                            type="text"
                            value={serviceForm.title}
                            onChange={(e) =>
                              setServiceForm({ ...serviceForm, title: e.target.value })
                            }
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Slug (URL)
                          </label>
                          <input
                            type="text"
                            value={serviceForm.slug}
                            onChange={(e) =>
                              setServiceForm({ ...serviceForm, slug: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Otomatik oluşturulacak"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Açıklama *
                        </label>
                        <textarea
                          value={serviceForm.description}
                          onChange={(e) =>
                            setServiceForm({ ...serviceForm, description: e.target.value })
                          }
                          required
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Görsel URL
                        </label>
                        <input
                          type="url"
                          value={serviceForm.image_url}
                          onChange={(e) =>
                            setServiceForm({ ...serviceForm, image_url: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://images.pexels.com/..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Özellikler
                        </label>
                        {serviceForm.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 mb-2"
                          >
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => updateFeature(index, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Özellik açıklaması"
                            />
                            {serviceForm.features.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeFeature(index)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addFeatureField}
                          className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Özellik Ekle</span>
                        </button>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                          <Save className="h-4 w-4" />
                          <span>{editingItem ? 'Güncelle' : 'Kaydet'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={resetServiceForm}
                          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          İptal
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {services.length === 0 ? (
                    <div className="col-span-2 text-center py-8">
                      <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Henüz hizmet eklenmemiş.</p>
                    </div>
                  ) : (
                    services.map((service) => (
                      <div
                        key={service.id}
                        className="border border-gray-200 rounded-xl p-6"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900 mb-2">
                              {service.title}
                            </h5>
                            <p className="text-sm text-gray-600 mb-3">
                              {service.description}
                            </p>
                            {service.features && service.features.length > 0 && (
                              <ul className="space-y-1">
                                {service.features
                                  .slice(0, 3)
                                  .map((feature: string, idx: number) => (
                                    <li
                                      key={idx}
                                      className="text-xs text-gray-500 flex items-center"
                                    >
                                      <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                                      {feature}
                                    </li>
                                  ))}
                              </ul>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditService(service)}
                              className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteService(service.id)}
                              className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'faqs' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {selectedCountry.name} SSS ({faqs.length})
                  </h4>
                  <button
                    onClick={() => {
                      setShowAddForm(!showAddForm);
                      setEditingItem(null);
                      resetFaqForm();
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Yeni SSS</span>
                  </button>
                </div>

                {showAddForm && (
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <h5 className="text-md font-semibold text-gray-900 mb-4">
                      {editingItem ? 'SSS Düzenle' : 'Yeni SSS Ekle'}
                    </h5>
                    <form onSubmit={handleSaveFaq} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Soru *
                        </label>
                        <input
                          type="text"
                          value={faqForm.question}
                          onChange={(e) =>
                            setFaqForm({ ...faqForm, question: e.target.value })
                          }
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cevap *
                        </label>
                        <textarea
                          value={faqForm.answer}
                          onChange={(e) =>
                            setFaqForm({ ...faqForm, answer: e.target.value })
                          }
                          required
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sıra
                        </label>
                        <input
                          type="number"
                          value={faqForm.order_index}
                          onChange={(e) =>
                            setFaqForm({
                              ...faqForm,
                              order_index: Number(e.target.value)
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                          <Save className="h-4 w-4" />
                          <span>{editingItem ? 'Güncelle' : 'Kaydet'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={resetFaqForm}
                          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          İptal
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="space-y-4">
                  {faqs.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Henüz SSS eklenmemiş.</p>
                    </div>
                  ) : (
                    faqs.map((faq) => (
                      <div
                        key={faq.id}
                        className="border border-gray-200 rounded-xl p-6 flex justify-between items-start"
                      >
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2">
                            {faq.question}
                          </h5>
                          <p className="text-sm text-gray-600">{faq.answer}</p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleEditFaq(faq)}
                            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteFaq(faq.id)}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'posts' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {selectedCountry.name} Haberler & Blog ({posts.length})
                  </h4>
                  <button
                    onClick={() => {
                      setShowAddForm(!showAddForm);
                      setEditingItem(null);
                      resetPostForm();
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Yeni Yazı</span>
                  </button>
                </div>

                {showAddForm && (
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <h5 className="text-md font-semibold text-gray-900 mb-4">
                      {editingItem ? 'Yazıyı Düzenle' : 'Yeni Yazı Ekle'}
                    </h5>
                    <form onSubmit={handleSavePost} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Başlık *
                          </label>
                          <input
                            type="text"
                            value={postForm.title}
                            onChange={(e) =>
                              setPostForm({ ...postForm, title: e.target.value })
                            }
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Slug
                          </label>
                          <input
                            type="text"
                            value={postForm.slug}
                            onChange={(e) =>
                              setPostForm({ ...postForm, slug: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kapak Görseli URL
                        </label>
                        <input
                          type="text"
                          value={postForm.cover_image}
                          onChange={(e) =>
                            setPostForm({ ...postForm, cover_image: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Özet
                        </label>
                        <textarea
                          value={postForm.excerpt}
                          onChange={(e) =>
                            setPostForm({ ...postForm, excerpt: e.target.value })
                          }
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          İçerik
                        </label>
                        <textarea
                          value={postForm.content}
                          onChange={(e) =>
                            setPostForm({ ...postForm, content: e.target.value })
                          }
                          rows={6}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">
                          Yayınla
                        </label>
                        <input
                          type="checkbox"
                          checked={postForm.status === 'published'}
                          onChange={(e) =>
                            setPostForm({
                              ...postForm,
                              status: e.target.checked ? 'published' : 'draft'
                            })
                          }
                        />
                      </div>

                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                          <Save className="h-4 w-4" />
                          <span>{editingItem ? 'Güncelle' : 'Kaydet'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={resetPostForm}
                          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          İptal
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="space-y-4">
                  {posts.length === 0 ? (
                    <div className="text-center py-8">
                      <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Henüz yazı eklenmemiş.</p>
                    </div>
                  ) : (
                    posts.map((post) => (
                      <div
                        key={post.id}
                        className="border border-gray-200 rounded-xl p-6 flex justify-between items-start"
                      >
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 mb-1">
                            {post.title}
                          </h5>
                          <p className="text-sm text-gray-600 mb-2">
                            {post.excerpt}
                          </p>
                          <p className="text-xs text-gray-500">
                            Durum: {post.status}
                          </p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleEditPost(post)}
                            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-8">
                {metaPages.map((page) => (
                  <div key={page.key} className="bg-gray-50 rounded-xl p-6">
                    <h5 className="font-semibold text-gray-900 mb-4">
                      {page.label}
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {languages.map((lang) => (
                        <div key={lang} className="space-y-4">
                          <h6 className="text-sm font-medium text-gray-700">
                            Dil: {lang.toUpperCase()}
                          </h6>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Meta Başlık
                            </label>
                            <input
                              type="text"
                              value={meta[page.key]?.[lang]?.meta_title || ''}
                              onChange={(e) =>
                                updateMetaField(
                                  page.key,
                                  lang,
                                  'meta_title',
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Meta Açıklama
                            </label>
                            <textarea
                              value={
                                meta[page.key]?.[lang]?.meta_description || ''
                              }
                              onChange={(e) =>
                                updateMetaField(
                                  page.key,
                                  lang,
                                  'meta_description',
                                  e.target.value
                                )
                              }
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Meta Anahtar Kelimeler
                            </label>
                            <input
                              type="text"
                              value={meta[page.key]?.[lang]?.meta_keywords || ''}
                              onChange={(e) =>
                                updateMetaField(
                                  page.key,
                                  lang,
                                  'meta_keywords',
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleSaveMeta}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Kaydet</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryContentManager;

