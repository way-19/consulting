import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { useLanguage } from '@consulting19/shared';
import { Card, Button } from '@consulting19/ui';
import { getLatestBlogPosts } from '../../data/mockBlogPosts';

const BlogSliderSection = () => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const blogPosts = getLatestBlogPosts(8); // Get more posts for better rotation

  // Auto-play functionality - slower movement
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % blogPosts.length);
    }, 4000); // 4 seconds per slide for better readability

    return () => clearInterval(interval);
  }, [isAutoPlaying, blogPosts.length]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Show message if no blog posts available
  if (blogPosts.length === 0) {
    return (
      <section className="py-10 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {t('blogNewsTitle')}
            </h2>
            <p className="text-gray-600">Blog posts are being prepared by our consultants.</p>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-10 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {t('blogNewsTitle')}
          </h2>
        </div>

        {/* Horizontal Blog Carousel */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            className="flex transition-transform duration-1000 ease-linear gap-6"
            style={{ 
              transform: `translateX(-${currentIndex * (100 / 4)}%)`,
              width: `${(blogPosts.length * 100) / 4}%`
            }}
          >
            {blogPosts.map((post, index) => (
              <div key={post.id} className="flex-shrink-0" style={{ width: `${100 / blogPosts.length}%` }}>
                <Card hover className="h-full max-w-xs">
                  <div className="h-20 overflow-hidden rounded-t-xl">
                    <img
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  
                  <Card.Body className="h-full flex flex-col p-4">
                    <div className="mb-1">
                      <span className="bg-gradient-to-r from-blue-500 to-teal-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                    
                    <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 text-xs leading-relaxed mb-2 flex-1 line-clamp-1">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center mr-1">
                          <User className="w-2 h-2 text-white" />
                        </div>
                        <span className="truncate text-xs">{post.author.split(' ')[0]}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                        <span className="text-xs">{new Date(post.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                      </div>
                    </div>
                    
                    <Link to={`/blog/${post.id}`} className="mt-1">
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="w-full text-xs py-1.5 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 border-0"
                      >
                        Read
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* View All Blog Posts CTA */}
        <div className="text-center mt-6">
          <Link to="/blog">
            <Button 
              size="md" 
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white border-0 px-8 py-3"
              icon={ArrowRight} 
              iconPosition="right"
            >
              {t('viewAllPosts') || 'View All Posts'}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSliderSection;