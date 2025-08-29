import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Calendar, User } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

const BlogManagement = () => {
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'UAE Business Setup Guide 2025: Everything You Need to Know',
      excerpt: 'Complete guide to setting up your business in the UAE, including new regulations and tax benefits.',
      content: '<h2>Why Choose UAE for Your Business?</h2><p>The United Arab Emirates has become one of the world\'s most attractive destinations...</p>',
      category: 'Company Formation',
      featured: true,
      published: true,
      created_at: '2025-01-20',
      updated_at: '2025-01-20',
    },
    {
      id: '2',
      title: 'UAE Banking Solutions: Complete Guide',
      excerpt: 'Everything you need to know about opening corporate bank accounts in the UAE.',
      content: '<h2>UAE Banking Landscape</h2><p>The UAE offers excellent banking infrastructure...</p>',
      category: 'Banking',
      featured: false,
      published: false,
      created_at: '2025-01-18',
      updated_at: '2025-01-18',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const handleDeletePost = (postId: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      setPosts(prev => prev.filter(p => p.id !== postId));
    }
  };

  const togglePublished = (postId: string) => {
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, published: !p.published } : p
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Management</h1>
                <p className="text-gray-600">Create and manage blog posts for your country</p>
              </div>
              <Button 
                icon={Plus} 
                iconPosition="left"
                onClick={() => setShowAddModal(true)}
              >
                New Blog Post
              </Button>
            </div>
          </div>

          {/* Blog Posts List */}
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} hover>
                <Card.Body>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {post.title}
                        </h3>
                        {post.featured && (
                          <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded">
                            Featured
                          </span>
                        )}
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          post.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{post.excerpt}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {post.created_at}
                        </div>
                        <div className="flex items-center">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {post.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        icon={Eye}
                      >
                        Preview
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        icon={Edit}
                        onClick={() => setEditingPost(post)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => togglePublished(post.id)}
                        className={post.published ? 'text-orange-600' : 'text-green-600'}
                      >
                        {post.published ? 'Unpublish' : 'Publish'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        icon={Trash2}
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>

          {/* Add/Edit Blog Post Modal */}
          {(showAddModal || editingPost) && (
            <BlogPostModal 
              post={editingPost}
              onClose={() => {
                setShowAddModal(false);
                setEditingPost(null);
              }}
              onSave={(postData) => {
                if (editingPost) {
                  setPosts(prev => prev.map(p => 
                    p.id === editingPost.id ? { ...postData, id: editingPost.id } : p
                  ));
                } else {
                  setPosts(prev => [...prev, { ...postData, id: Date.now().toString() }]);
                }
                setShowAddModal(false);
                setEditingPost(null);
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
};

// Blog Post Modal Component
interface BlogPostModalProps {
  post?: BlogPost;
  onClose: () => void;
  onSave: (post: Omit<BlogPost, 'id'>) => void;
}

const BlogPostModal: React.FC<BlogPostModalProps> = ({ post, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    category: post?.category || 'Company Formation',
    featured: post?.featured || false,
    published: post?.published || false,
  });

  const categories = [
    'Company Formation',
    'Tax Planning',
    'Banking',
    'Legal Compliance',
    'Investment',
    'Immigration',
    'Market Research',
    'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString().split('T')[0];
    onSave({
      ...formData,
      created_at: post?.created_at || now,
      updated_at: now,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {post ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content (HTML)
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={12}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="<h2>Your heading</h2><p>Your content...</p>"
              required
            />
          </div>

          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Featured Post</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Publish Immediately</span>
            </label>
          </div>

          <div className="flex space-x-4 pt-6">
            <Button type="submit" className="flex-1">
              {post ? 'Update Post' : 'Create Post'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogManagement;