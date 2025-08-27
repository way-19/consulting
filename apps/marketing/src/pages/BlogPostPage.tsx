import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowLeft, Share2, BookOpen } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';

const BlogPostPage = () => {
  const { postId } = useParams();

  // Mock blog post data - in real app this would be fetched from Supabase
  const blogPost = {
    id: 'uae-business-setup-2025',
    title: 'UAE Business Setup Guide 2025: Everything You Need to Know',
    content: `
      <h2>Why Choose UAE for Your Business?</h2>
      <p>The United Arab Emirates has become one of the world's most attractive destinations for international business expansion. With its strategic location, modern infrastructure, and business-friendly policies, the UAE offers unique advantages for entrepreneurs looking to establish a global presence.</p>
      
      <h3>Key Benefits of UAE Business Formation</h3>
      <ul>
        <li><strong>Zero Corporate Tax:</strong> Many free zones offer 0% corporate tax for up to 50 years</li>
        <li><strong>100% Foreign Ownership:</strong> Most business activities allow full foreign ownership</li>
        <li><strong>No Personal Income Tax:</strong> Individuals pay no personal income tax</li>
        <li><strong>Strategic Location:</strong> Gateway between East and West markets</li>
      </ul>
      
      <h3>Types of Business Entities</h3>
      <p>The UAE offers several business formation options, each with distinct advantages:</p>
      
      <h4>1. Free Zone Companies</h4>
      <p>Free zone companies offer the most tax benefits and are ideal for businesses that don't need to operate directly in the UAE mainland market. Popular free zones include:</p>
      <ul>
        <li>Dubai International Financial Centre (DIFC)</li>
        <li>Abu Dhabi Global Market (ADGM)</li>
        <li>Dubai Multi Commodities Centre (DMCC)</li>
      </ul>
      
      <h4>2. Mainland Companies</h4>
      <p>For businesses that need to operate directly in the UAE market or require a local physical presence, mainland companies offer flexibility and market access.</p>
      
      <h3>Step-by-Step Setup Process</h3>
      <p>Setting up a business in the UAE typically involves these key steps:</p>
      <ol>
        <li>Choose your business activity and structure</li>
        <li>Select the appropriate jurisdiction (free zone vs. mainland)</li>
        <li>Reserve your company name</li>
        <li>Prepare and submit required documentation</li>
        <li>Obtain necessary licenses and permits</li>
        <li>Open a corporate bank account</li>
      </ol>
      
      <h3>Required Documentation</h3>
      <p>The documentation requirements vary by jurisdiction, but typically include:</p>
      <ul>
        <li>Passport copies of shareholders and directors</li>
        <li>No Objection Certificate (if applicable)</li>
        <li>Bank statements or financial references</li>
        <li>Business plan (for certain activities)</li>
      </ul>
      
      <h3>Banking in the UAE</h3>
      <p>Opening a corporate bank account is crucial for business operations. The UAE's banking sector is well-developed, with both local and international banks offering corporate banking services. Requirements typically include:</p>
      <ul>
        <li>Trade license</li>
        <li>Memorandum and Articles of Association</li>
        <li>Emirates ID for authorized signatories</li>
        <li>Salary certificates or business bank statements</li>
      </ul>
      
      <h3>Ongoing Compliance</h3>
      <p>Maintaining good standing requires ongoing compliance with UAE regulations:</p>
      <ul>
        <li>Annual license renewal</li>
        <li>Filing of annual returns</li>
        <li>Maintaining registered office address</li>
        <li>Corporate tax filings (where applicable)</li>
      </ul>
      
      <h3>Conclusion</h3>
      <p>The UAE continues to be an exceptional choice for international business expansion. With proper guidance and planning, entrepreneurs can take advantage of the UAE's business-friendly environment to grow their operations globally.</p>
      
      <p>For personalized assistance with your UAE business setup, our expert advisors are ready to help you navigate the entire process efficiently.</p>
    `,
    author: 'Ahmed Al-Rashid',
    authorRole: 'UAE Business Specialist',
    authorBio: 'Ahmed has over 10 years of experience helping international businesses establish operations in the UAE. He specializes in free zone company formation and banking solutions.',
    authorImage: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=200',
    date: '2025-01-20',
    category: 'Company Formation',
    readTime: '8 min read',
    image: 'https://images.pexels.com/photos/1769606/pexels-photo-1769606.jpeg?auto=compress&cs=tinysrgb&w=800',
  };

  const relatedPosts = [
    {
      id: 'estonia-e-residency-guide',
      title: 'Estonia e-Residency Complete Guide',
      image: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
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
      </div>
    </div>
  );
};

export default BlogPostPage;