import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  User, 
  Tag,
  Search,
  Filter,
  ArrowRight,
  FileText,
  TrendingUp,
  Globe
} from 'lucide-react';

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Simulated blog posts from consultants
  const consultantBlogs = [
    {
      id: 1,
      title: 'Estonia E-Residency Program Reaches 120,000 Digital Residents',
      excerpt: 'Estonia announces major milestone as digital residency program attracts entrepreneurs from 180+ countries, with new blockchain-based services launching.',
      content: 'Estonia continues to lead the world in digital governance...',
      author: {
        name: 'Sarah Johnson',
        country: 'Estonia',
        flag: '🇪🇪',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      category: 'Company Formation',
      tags: ['Estonia', 'e-Residency', 'Digital Innovation', 'Blockchain'],
      publishedAt: '2024-01-15',
      readTime: 8,
      views: 1247,
      featured: true,
      image: 'https://images.pexels.com/photos/9816335/pexels-photo-9816335.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
    },
    {
      id: 2,
      title: 'US Federal Reserve Announces New Foreign Investment Guidelines',
      excerpt: 'New regulations affect international business formation in Delaware and other US states, creating opportunities for strategic restructuring.',
      content: 'The investment landscape is rapidly evolving...',
      author: {
        name: 'Michael Chen',
        country: 'USA',
        flag: '🇺🇸',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      category: 'Regulatory Updates',
      tags: ['USA', 'Federal Reserve', 'Investment Rules', 'Delaware'],
      publishedAt: '2024-01-12',
      readTime: 12,
      views: 892,
      featured: true,
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
    },
    {
      id: 3,
      title: 'Malta Introduces New Digital Nomad Visa with EU Benefits',
      excerpt: 'Malta launches innovative digital nomad visa program allowing remote workers to access EU markets while maintaining tax advantages.',
      content: 'Malta has updated its Golden Visa program...',
      author: {
        name: 'Antonio Rucci',
        country: 'Malta',
        flag: '🇲🇹',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      category: 'Visa & Immigration',
      tags: ['Malta', 'Digital Nomad', 'EU Access', 'Remote Work'],
      publishedAt: '2024-01-10',
      readTime: 6,
      views: 634,
      featured: false,
      image: 'https://images.pexels.com/photos/9816335/pexels-photo-9816335.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
    },
    {
      id: 4,
      title: 'Georgia Becomes Regional Fintech Hub with New Banking Laws',
      excerpt: 'Georgia passes progressive fintech legislation, attracting international financial services companies with streamlined licensing.',
      content: 'Georgia offers one of the most attractive tax systems...',
      author: {
        name: 'Nino Kvaratskhelia',
        country: 'Georgia',
        flag: '🇬🇪',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      category: 'Financial Services',
      tags: ['Georgia', 'Fintech', 'Banking Laws', 'Licensing'],
      publishedAt: '2024-01-08',
      readTime: 10,
      views: 756,
      featured: false,
      image: 'https://images.pexels.com/photos/12461213/pexels-photo-12461213.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
    },
    {
      id: 5,
      title: 'Portugal Expands Golden Visa Program to Include Tech Investments',
      excerpt: 'Portugal announces new investment categories for Golden Visa, focusing on technology startups and innovation hubs.',
      content: 'Portugal\'s D7 visa has become increasingly popular...',
      author: {
        name: 'Elena Rodriguez',
        country: 'Portugal',
        flag: '🇵🇹',
        avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      category: 'Investment Programs',
      tags: ['Portugal', 'Golden Visa', 'Tech Investment', 'Innovation'],
      publishedAt: '2024-01-05',
      readTime: 9,
      views: 1123,
      featured: true,
      image: 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
    },
    {
      id: 6,
      title: 'UAE Announces New Corporate Tax Exemptions for Green Energy',
      excerpt: 'UAE introduces comprehensive tax incentives for renewable energy companies, positioning itself as a sustainable business hub.',
      content: 'The UAE continues to attract international businesses...',
      author: {
        name: 'Ahmed Hassan',
        country: 'UAE',
        flag: '🇦🇪',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      category: 'Tax Incentives',
      tags: ['UAE', 'Green Energy', 'Tax Exemptions', 'Sustainability'],
      publishedAt: '2024-01-03',
      readTime: 11,
      views: 945,
      featured: false,
      image: 'https://images.pexels.com/photos/512453979798-5ea266f8880c/pexels-photo-512453979798-5ea266f8880c.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
    },
    {
      id: 7,
      title: 'Switzerland Introduces New Fintech Regulations for 2024',
      excerpt: 'Switzerland updates its fintech framework to attract more international blockchain and cryptocurrency companies.',
      content: 'Switzerland continues to position itself as a global fintech hub...',
      author: {
        name: 'Klaus Weber',
        country: 'Switzerland',
        flag: '🇨🇭',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      category: 'Financial Services',
      tags: ['Switzerland', 'Fintech', 'Blockchain', 'Cryptocurrency'],
      publishedAt: '2024-01-01',
      readTime: 9,
      views: 1156,
      featured: false,
      image: 'https://images.pexels.com/photos/9816335/pexels-photo-9816335.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
    },
    {
      id: 8,
      title: 'Spain Launches New Startup Visa Program for International Entrepreneurs',
      excerpt: 'Spain introduces innovative startup visa program targeting international entrepreneurs and digital nomads.',
      content: 'Spain\'s new startup visa program aims to attract global talent...',
      author: {
        name: 'Carlos Rodriguez',
        country: 'Spain',
        flag: '🇪🇸',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      category: 'Visa & Immigration',
      tags: ['Spain', 'Startup Visa', 'Entrepreneurs', 'Digital Nomads'],
      publishedAt: '2023-12-28',
      readTime: 7,
      views: 823,
      featured: false,
      image: 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
    }
  ];

  useEffect(() => {
    // Simulate loading blog posts
    setTimeout(() => {
      setBlogPosts(consultantBlogs);
      const uniqueCategories = [...new Set(consultantBlogs.map(post => post.category))];
      setCategories(uniqueCategories);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Visa & Immigration': 'bg-blue-100 text-blue-700',
      'Company Formation': 'bg-green-100 text-green-700',
      'Regulatory Updates': 'bg-purple-100 text-purple-700',
      'Financial Services': 'bg-orange-100 text-orange-700',
      'Investment Programs': 'bg-cyan-100 text-cyan-700',
      'Tax Incentives': 'bg-yellow-100 text-yellow-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-64 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-full mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Latest News from Our 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"> Global Consultants</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay informed about regulatory changes, market developments, and business opportunities 
              from our expert consultants across 8 strategic jurisdictions.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Breaking News</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group hover:-translate-y-2"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                        {post.category}
                      </span>
                    </div>

                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Breaking
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          <span className="mr-2">{post.author.flag}</span>
                          {post.author.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Consultant • {post.author.country}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{post.readTime} min read</span>
                      </div>
                    </div>

                    <Link
                      to={`/blog/${post.id}`}
                      className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm group-hover:translate-x-1 transition-all duration-300"
                    >
                      Read More
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {selectedCategory === 'all' ? 'All Articles' : selectedCategory}
            </h2>
            <div className="text-gray-600">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                        {post.category}
                      </span>
                    </div>

                    {post.featured && (
                      <div className="absolute top-4 right-4 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Breaking
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          <span className="mr-2">{post.author.flag}</span>
                          {post.author.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {post.author.country}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{post.readTime} min read</span>
                      </div>
                    </div>

                    <Link
                      to={`/blog/${post.id}`}
                      className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm"
                    >
                      Read News
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Stay Updated with Global Business News
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Get the latest regulatory updates and market news from our expert consultants delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;