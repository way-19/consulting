import React, { useState, useEffect } from 'react';
import { FileText, Plus, Edit, Trash2, Eye, Globe, ToggleLeft, ToggleRight, Search, Filter } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { supabase } from '@consulting19/supabase';
import { useAuth } from '@consulting19/shared';
import { useI18n } from '../../hooks/useI18n';
import ConsultantLayout from '../../components/layouts/ConsultantLayout';
import { Helmet } from 'react-helmet-async';

interface BlogPost {
  id: string;
  title_i18n: any;
  excerpt_i18n: any;
  content_i18n: any;
  slug: string;
  category: string;
  tags: string[];
  featured_image_url: string;
  is_published: boolean;
  is_featured: boolean;
  published_at: string;
  country: {
    name: string;
    flag_emoji: string;
  } | null;
  created_at: string;
  updated_at: string;
}

interface FAQ {
  id: string;
  category: string;
  question_i18n: any;
  answer_i18n: any;
  sort_order: number;
  is_active: boolean;
  is_global: boolean;
  country: {
    name: string;
    flag_emoji: string;
  } | null;
  created_at: string;
  updated_at: string;
}

const ConsultantContent = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('blog');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchContent();
    }
  }, [user]);

  const fetchContent = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch blog posts
      const { data: blogData, error: blogError } = await supabase
        .from('blog_posts')
        .select(`
          *,
          country:countries(name, flag_emoji)
        `)
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      if (blogError) {
        console.error('Error fetching blog posts:', blogError);
      } else {
        setBlogPosts(blogData || []);
      }

      // Fetch FAQs
      const { data: faqData, error: faqError } = await supabase
        .from('faqs')
        .select(`
          *,
          country:countries(name, flag_emoji)
        `)
        .eq('consultant_id', user.id)
        .order('sort_order', { ascending: true });

      if (faqError) {
        console.error('Error fetching FAQs:', faqError);
      } else {
        setFaqs(faqData || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBlogStatus = async (postId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ is_published: !currentStatus })
        .eq('id', postId);

      if (error) {
        console.error('Error updating blog status:', error);
      } else {
        fetchContent();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const toggleFaqStatus = async (faqId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('faqs')
        .update({ is_active: !currentStatus })
        .eq('id', faqId);

      if (error) {
        console.error('Error updating FAQ status:', error);
      } else {
        fetchContent();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const getLocalizedContent = (content: any, field: string) => {
    if (!content || typeof content !== 'object') return '';
    return content.en || content.tr || content.pt || '';
  };

  const filteredBlogPosts = blogPosts.filter(post => {
    const matchesSearch = 
      getLocalizedContent(post.title_i18n, 'title').toLowerCase().includes(searchTerm.toLowerCase()) ||
      getLocalizedContent(post.excerpt_i18n, 'excerpt').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = 
      getLocalizedContent(faq.question_i18n, 'question').toLowerCase().includes(searchTerm.toLowerCase()) ||
      getLocalizedContent(faq.answer_i18n, 'answer').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || faq.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <ConsultantLayout>
        <Helmet>
          <title>Content Management - Consulting19</title>
        </Helmet>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-16 bg-gray-200 rounded-lg"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </ConsultantLayout>
    );
  }

  return (
    <ConsultantLayout>
      <Helmet>
        <title>Content Management - Consulting19</title>
      </Helmet>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
            <p className="text-gray-600">Manage your blog posts and FAQ content</p>
          </div>
          <Button icon={Plus}>
            Create Content
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'blog', label: 'Blog Posts', icon: FileText, count: blogPosts.length },
              { id: 'faq', label: 'FAQs', icon: Globe, count: faqs.length },
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
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <Card.Body>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="Company Formation">Company Formation</option>
              <option value="Tax Planning">Tax Planning</option>
              <option value="Banking">Banking</option>
              <option value="Legal">Legal</option>
              <option value="General">General</option>
            </select>
          </div>
        </Card.Body>
      </Card>

      {/* Blog Posts Tab */}
      {activeTab === 'blog' && (
        <div>
          {filteredBlogPosts.length > 0 ? (
            <div className="space-y-4">
              {filteredBlogPosts.map((post) => (
                <Card key={post.id}>
                  <Card.Body>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {getLocalizedContent(post.title_i18n, 'title')}
                          </h3>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {post.category}
                          </span>
                          <button
                            onClick={() => toggleBlogStatus(post.id, post.is_published)}
                            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                              post.is_published
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {post.is_published ? (
                              <ToggleRight className="w-3 h-3" />
                            ) : (
                              <ToggleLeft className="w-3 h-3" />
                            )}
                            <span>{post.is_published ? 'Published' : 'Draft'}</span>
                          </button>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {getLocalizedContent(post.excerpt_i18n, 'excerpt')}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Slug: {post.slug}</span>
                          {post.country && (
                            <span>{post.country.flag_emoji} {post.country.name}</span>
                          )}
                          <span>Updated: {new Date(post.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" icon={Eye}>
                          Preview
                        </Button>
                        <Button variant="outline" size="sm" icon={Edit}>
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          icon={Trash2}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <Card.Body className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Blog Posts Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Create your first blog post to share insights with potential clients
                </p>
                <Button icon={Plus}>
                  Create Blog Post
                </Button>
              </Card.Body>
            </Card>
          )}
        </div>
      )}

      {/* FAQs Tab */}
      {activeTab === 'faq' && (
        <div>
          {filteredFaqs.length > 0 ? (
            <div className="space-y-4">
              {filteredFaqs.map((faq) => (
                <Card key={faq.id}>
                  <Card.Body>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {getLocalizedContent(faq.question_i18n, 'question')}
                          </h3>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                            {faq.category}
                          </span>
                          {faq.is_global && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                              Global
                            </span>
                          )}
                          <button
                            onClick={() => toggleFaqStatus(faq.id, faq.is_active)}
                            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                              faq.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {faq.is_active ? (
                              <ToggleRight className="w-3 h-3" />
                            ) : (
                              <ToggleLeft className="w-3 h-3" />
                            )}
                            <span>{faq.is_active ? 'Active' : 'Inactive'}</span>
                          </button>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {getLocalizedContent(faq.answer_i18n, 'answer').substring(0, 150)}...
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Order: {faq.sort_order}</span>
                          {faq.country && (
                            <span>{faq.country.flag_emoji} {faq.country.name}</span>
                          )}
                          <span>Updated: {new Date(faq.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" icon={Edit}>
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          icon={Trash2}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <Card.Body className="text-center py-12">
                <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No FAQs Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Create FAQs to help clients understand your services better
                </p>
                <Button icon={Plus}>
                  Create FAQ
                </Button>
              </Card.Body>
            </Card>
          )}
        </div>
      )}

      {/* Content Stats */}
      <Card className="mt-8">
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-900">Content Statistics</h2>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{blogPosts.length}</div>
              <div className="text-sm text-gray-600">Total Blog Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {blogPosts.filter(p => p.is_published).length}
              </div>
              <div className="text-sm text-gray-600">Published Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{faqs.length}</div>
              <div className="text-sm text-gray-600">Total FAQs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {faqs.filter(f => f.is_active).length}
              </div>
              <div className="text-sm text-gray-600">Active FAQs</div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </ConsultantLayout>
  );
};

export default ConsultantContent;