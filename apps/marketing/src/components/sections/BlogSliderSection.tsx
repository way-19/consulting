import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { getLatestBlogPosts } from '../../data/mockBlogPosts';

const BlogSliderSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const blogPosts = getLatestBlogPosts(10); // Get more posts for continuous sliding

  // Auto-play functionality - slower movement
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % blogPosts.length);
    }, 3000); // 3 seconds per slide

    return () => clearInterval(interval);
  }, [isAutoPlaying, blogPosts.length]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Latest Insights & Expert Guidance
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest trends, regulations, and opportunities in international business expansion.
          </p>
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
              transform: `translateX(-${currentIndex * (100 / 5)}%)`,
              width: `${(blogPosts.length * 100) / 5}%`
            }}
          >
            {blogPosts.map((post, index) => (
              <div key={post.id} className="flex-shrink-0" style={{ width: `${100 / blogPosts.length}%` }}>
                <Card hover className="h-full">
                  <div className="h-48 overflow-hidden rounded-t-xl">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <Card.Body className="h-full flex flex-col">
                    <div className="mb-3">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                        {post.category}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        <span className="truncate">{post.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <Link to={`/blog/${post.id}`}>
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        Read Article
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center space-x-2 mt-8">
          {Array.from({ length: Math.max(1, blogPosts.length - 4) }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoPlaying(false);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                Math.floor(currentIndex) === index 
                  ? 'bg-blue-600 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* View All Blog Posts CTA */}
        <div className="text-center mt-12">
          <Link to="/blog">
            <Button size="lg" variant="outline" icon={ArrowRight} iconPosition="right">
              View All Articles
            </Button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default BlogSliderSection;