import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowLeft, Share2, BookOpen } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { getBlogPostById, getLatestBlogPosts } from '../data/mockBlogPosts';

const BlogPostPage = () => {
  const { postId } = useParams();

  // Get blog post from data
  const blogPost = getBlogPostById(postId || '');
  
  if (!blogPost) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-0 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 mb-6">The requested blog post could not be found.</p>
          <Link to="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get related posts (other posts from same country, excluding current post)
  const relatedPosts = getLatestBlogPosts(4)
    .filter(post => post.id !== blogPost.id && post.countryId === blogPost.countryId)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/blog">
            <Button variant="ghost" icon={ArrowLeft} iconPosition="left">
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <Card className="mb-12">
          <div className="h-64 md:h-80 overflow-hidden rounded-t-xl">
            <img 
              src={blogPost.image} 
              alt={blogPost.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <Card.Body>
            <div className="mb-4">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
                {blogPost.category}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {blogPost.title}
            </h1>
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-6 text-gray-500">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{blogPost.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{blogPost.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{blogPost.readTime}</span>
                </div>
              </div>
              
              <Button variant="outline" size="sm" icon={Share2}>
                Share
              </Button>
            </div>

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: blogPost.content }}
            />
          </Card.Body>
        </Card>

        {/* Author Bio */}
        <Card className="mb-12">
          <Card.Body>
            <div className="flex items-start space-x-4">
              <img 
                src={blogPost.authorImage}
                alt={blogPost.author}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{blogPost.author}</h3>
                <p className="text-blue-600 font-medium mb-2">{blogPost.authorRole}</p>
                <p className="text-gray-600 leading-relaxed">{blogPost.authorBio}</p>
              </div>
              <Button variant="outline" size="sm">
                View Profile
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Related Articles</h2>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.id}`} className="group">
                    <div className="flex space-x-4">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </h3>
                        <div className="flex items-center mt-2 text-blue-600 text-sm">
                          <BookOpen className="w-4 h-4 mr-1" />
                          Read Article
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BlogPostPage;