import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/db';
import { BlogPost } from '../types';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft,
  Share2,
  Eye,
  Tag
} from 'lucide-react';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;

      try {
        const [postData, relatedData] = await Promise.all([
          db.getBlogPostBySlug(slug),
          db.getBlogPosts(3) // Get 3 latest posts for related section
        ]);

        if (postData) {
          setPost(postData);
          // Increment view count
          await db.incrementBlogViews(slug);
          
          // Filter related posts (same category, exclude current post)
          const related = relatedData?.filter(p => 
            p.category === postData.category && p.id !== postData.id
          ).slice(0, 3) || [];
          
          setRelatedPosts(related);
        } else {
          setError('Blog post not found');
        }
      } catch (error) {
        console.error('Error loading blog post:', error);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
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

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="container py-16">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded-2xl mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Blog post not found'}
          </h1>
          <Link
            to="/blog"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Article Header */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Link
              to="/blog"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>

            <div className="mb-6">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)} mb-4`}>
                {post.category}
              </span>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-3xl mr-4">{post.author?.countries?.flag_emoji || '🌍'}</span>
                  <div>
                    <div className="text-lg font-medium text-gray-900">
                      {post.author?.first_name} {post.author?.last_name}
                    </div>
                    <div className="text-gray-600">
                      Consultant • {post.author?.countries?.name}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(post.published_at)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{post.read_time} min read</span>
                  </div>
                  {post.views && (
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      <span>{post.views} views</span>
                    </div>
                  )}
                  <button
                    onClick={handleShare}
                    className="flex items-center hover:text-primary-600 transition-colors"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>

            {post.featured_image && (
              <div className="mb-12">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-96 object-cover rounded-2xl shadow-xl"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center flex-wrap gap-2">
                  <Tag className="h-4 w-4 text-gray-500 mr-2" />
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Related Articles
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <article
                    key={relatedPost.id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={relatedPost.featured_image || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-6">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(relatedPost.category)} mb-3`}>
                        {relatedPost.category}
                      </span>

                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300">
                        {relatedPost.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatDate(relatedPost.published_at)}</span>
                        <span>{relatedPost.read_time} min read</span>
                      </div>

                      <Link
                        to={`/blog/${relatedPost.slug}`}
                        className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm mt-4"
                      >
                        Read More
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPostPage;