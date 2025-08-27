import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Search, Filter } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blogPosts = [
    {
      id: 'uae-business-setup-2025',
      title: 'UAE Business Setup Guide 2025: Everything You Need to Know',
      excerpt: 'Complete guide to setting up your business in the UAE, including new regulations and tax benefits.',
      author: 'Ahmed Al-Rashid',
      authorRole: 'UAE Business Specialist',
      date: '2025-01-20',
      category: 'Company Formation',
      readTime: '8 min read',
      image: 'https://images.pexels.com/photos/1769606/pexels-photo-1769606.jpeg?auto=compress&cs=tinysrgb&w=600',
      featured: true,
    },
    {
      id: 'estonia-e-residency-guide',
      title: 'Estonia e-Residency: Digital Nomad\'s Complete Guide',
      excerpt: 'How to become an Estonian e-Resident and run your EU business 100% online.',
      author: 'Maria Kask',
      authorRole: 'Estonia Digital Business Expert',
      date: '2025-01-18',
      category: 'Digital Business',
      readTime: '6 min read',
      image: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=600',
      featured: false,
    },
    {
      id: 'georgia-small-business-status',
      title: 'Georgia\'s Small Business Status: 1% Tax Rate Explained',
      excerpt: 'Everything about Georgia\'s incredibly attractive small business tax regime.',
      author: 'Giorgi Meskhi',
      authorRole: 'Georgia Business Formation Specialist',
      date: '2025-01-12',
      category: 'Tax Planning',
      readTime: '5 min read',
      image: 'https://images.pexels.com/photos/5137987/pexels-photo-5137987.jpeg?auto=compress&cs=tinysrgb&w=600',
      featured: false,
    },
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Company Formation', label: 'Company Formation' },
    { value: 'Tax Planning', label: 'Tax Planning' },
    { value: 'Digital Business', label: 'Digital Business' },
    { value: 'Banking', label: 'Banking' },
    { value: 'Legal', label: 'Legal' },
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = filteredPosts.find(post => post.featured);
  const otherPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            International Business Insights
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Expert insights, guides, and updates from our global network of business advisors.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Article</h2>
            <Card hover>
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title}
                    className="w-full h-64 md:h-full object-cover rounded-l-xl"
                  />
                </div>
                <Card.Body className="md:w-2/3">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                      {featuredPost.category}
                    </span>
                    <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded">
                      FEATURED
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {featuredPost.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {featuredPost.date}
                      </div>
                      <span>{featuredPost.readTime}</span>
                    </div>
                    
                    <Link to={`/blog/${featuredPost.id}`}>
                      <Button variant="primary" icon={ArrowRight} iconPosition="right">
                        Read More
                      </Button>
                    </Link>
                  </div>
                </Card.Body>
              </div>
            </Card>
          </div>
        )}

        {/* Other Posts */}
        {otherPosts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherPosts.map((post) => (
                <Card key={post.id} hover className="h-full">
                  <div className="h-48 overflow-hidden rounded-t-xl">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <Card.Body className="h-full flex flex-col">
                    <div className="mb-4">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                        {post.category}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex-1">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>{post.author}</span>
                      <span>{post.readTime}</span>
                    </div>
                    
                    <Link to={`/blog/${post.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        Read Article
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        )}

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;