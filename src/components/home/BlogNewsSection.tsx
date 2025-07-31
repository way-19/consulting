import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  User, 
  ArrowRight,
  Globe,
  TrendingUp,
  FileText,
  Clock
} from 'lucide-react';

// Mock data for blog posts
const mockBlogPosts = [
  {
    id: '1',
    title: 'New Investment Opportunities in Estonia',
    excerpt: 'Discover the latest digital nomad programs and e-Residency benefits for international entrepreneurs.',
    content: 'Estonia continues to lead in digital innovation...',
    slug: 'investment-opportunities-estonia',
    category: 'Investment',
    published_at: '2024-01-15T10:00:00Z',
    reading_time: 5,
    featured: true,
    author: {
      first_name: 'John',
      last_name: 'Doe',
      countries: {
        name: 'Estonia',
        flag_emoji: '🇪🇪'
      }
    }
  },
  {
    id: '2',
    title: 'UAE Company Formation Guide 2024',
    excerpt: 'Complete guide to setting up your business in Dubai and other Emirates with latest regulations.',
    content: 'The UAE remains one of the most attractive...',
    slug: 'uae-company-formation-guide-2024',
    category: 'Company Formation',
    published_at: '2024-01-12T14:30:00Z',
    reading_time: 8,
    featured: false,
    author: {
      first_name: 'Sarah',
      last_name: 'Ahmed',
      countries: {
        name: 'United Arab Emirates',
        flag_emoji: '🇦🇪'
      }
    }
  },
  {
    id: '3',
    title: 'Cyprus Visa Updates for 2024',
    excerpt: 'Latest changes in Cyprus immigration policy and new visa categories for investors.',
    content: 'Cyprus has introduced several new visa categories...',
    slug: 'cyprus-visa-updates-2024',
    category: 'Visa',
    published_at: '2024-01-10T09:15:00Z',
    reading_time: 6,
    featured: true,
    author: {
      first_name: 'Maria',
      last_name: 'Constantinou',
      countries: {
        name: 'Cyprus',
        flag_emoji: '🇨🇾'
      }
    }
  },
  {
    id: '4',
    title: 'Singapore Banking for International Businesses',
    excerpt: 'How to open corporate bank accounts in Singapore and navigate compliance requirements.',
    content: 'Singapore\'s banking sector offers excellent...',
    slug: 'singapore-banking-international-businesses',
    category: 'Banking',
    published_at: '2024-01-08T16:45:00Z',
    reading_time: 7,
    featured: false,
    author: {
      first_name: 'Wei',
      last_name: 'Chen',
      countries: {
        name: 'Singapore',
        flag_emoji: '🇸🇬'
      }
    }
  },
  {
    id: '5',
    title: 'Malta Golden Visa Program Changes',
    excerpt: 'Important updates to Malta\'s investor visa program and new application procedures.',
    content: 'Malta has recently updated its golden visa...',
    slug: 'malta-golden-visa-program-changes',
    category: 'Investment',
    published_at: '2024-01-05T11:20:00Z',
    reading_time: 4,
    featured: false,
    author: {
      first_name: 'Antonio',
      last_name: 'Rossi',
      countries: {
        name: 'Malta',
        flag_emoji: '🇲🇹'
      }
    }
  },
  {
    id: '6',
    title: 'UK Post-Brexit Business Setup',
    excerpt: 'Navigate the new requirements for setting up businesses in the UK after Brexit.',
    content: 'Post-Brexit UK offers unique opportunities...',
    slug: 'uk-post-brexit-business-setup',
    category: 'Company Formation',
    published_at: '2024-01-03T13:10:00Z',
    reading_time: 9,
    featured: true,
    author: {
      first_name: 'James',
      last_name: 'Thompson',
      countries: {
        name: 'United Kingdom',
        flag_emoji: '🇬🇧'
      }
    }
  }
];

export default function BlogSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [blogPosts, setBlogPosts] = useState(mockBlogPosts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay for better UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const postsPerSlide = 3;
  const totalSlides = Math.ceil(blogPosts.length / postsPerSlide);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentPosts = () => {
    const startIndex = currentSlide * postsPerSlide;
    return blogPosts.slice(startIndex, startIndex + postsPerSlide);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Visa & Immigration': 'bg-blue-100 text-blue-700',
      'Company Formation': 'bg-green-100 text-green-700',
      'Investment': 'bg-purple-100 text-purple-700',
      'Digital Services': 'bg-cyan-100 text-cyan-700',
      'Tax Planning': 'bg-orange-100 text-orange-700',
      'Citizenship': 'bg-pink-100 text-pink-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <section className="section-padding bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="container relative z-10">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-80 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-xl overflow-hidden animate-pulse">
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
      </section>
    );
  }

  if (blogPosts.length === 0) {
    return (
      <section className="section-padding bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="container relative z-10">
          <div className="text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Blog Posts Yet</h2>
            <p className="text-gray-600">Our consultants will be sharing insights soon!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 fade-in">
          <div className="inline-flex items-center bg-primary-50 border border-primary-200 rounded-full px-4 py-2 mb-6">
            <FileText className="h-4 w-4 text-primary-600 mr-2" />
            <span className="text-primary-700 text-sm font-medium">Latest Insights</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Expert Insights from Our 
            <span className="text-gradient"> Global Consultants</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest regulatory changes, market opportunities, 
            and expert analysis from our consultants across 8 strategic jurisdictions.
          </p>
        </div>

        {/* Blog Posts Slider */}
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts
                      .slice(slideIndex * postsPerSlide, (slideIndex + 1) * postsPerSlide)
                      .map((post, index) => (
                        <article
                          key={post.id}
                          className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group hover:-translate-y-2 scale-in"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          {/* Post Image */}
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={post.featured_image}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            {/* Category Badge */}
                            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                              {post.category}
                            </div>

                            {/* Featured Badge */}
                            {post.featured && (
                              <div className="absolute top-4 right-4 bg-accent-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                Featured
                              </div>
                            )}
                          </div>

                          {/* Post Content */}
                          <div className="p-6">
                            {/* Author Info */}
                            <div className="flex items-center mb-4">
                              <div className="flex items-center flex-1">
                                <span className="text-2xl mr-3">{post.author?.countries?.flag_emoji || '🌍'}</span>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {post.author?.first_name} {post.author?.last_name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Consultant • {post.author?.countries?.name}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Post Title */}
                            <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300">
                              {post.title}
                            </h3>

                            {/* Post Excerpt */}
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                              {post.excerpt}
                            </p>

                            {/* Post Meta */}
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>{formatDate(post.published_at)}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{post.read_time} min read</span>
                              </div>
                            </div>

                            {/* Read More Link */}
                            <Link
                              to={`/blog/${post.slug}`}
                              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm group-hover:translate-x-1 transition-all duration-300"
                            >
                              Read More
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                          </div>
                        </article>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-10"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-10"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-primary-600 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* View All Blog CTA */}
        <div className="text-center mt-12 fade-in">
          <Link
            to="/blog"
            className="inline-flex items-center bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-xl hover:scale-105 hover:shadow-2xl group"
          >
            <Globe className="mr-2 h-5 w-5" />
            View All Insights
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}