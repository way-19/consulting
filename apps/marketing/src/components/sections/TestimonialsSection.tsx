import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Card } from '../../lib/ui';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      title: 'CEO, TechStart Inc.',
      country: 'Singapore',
      rating: 5,
      text: 'Consulting19 made our expansion into Asia seamless. The AI recommendations were spot-on, and our advisor guided us through every step of the Singapore incorporation process.',
      avatar: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=200',
    },
    {
      name: 'Marco Rodriguez',
      title: 'Founder, Digital Nomad LLC',
      country: 'Estonia',
      rating: 5,
      text: 'The e-Residency process in Estonia was complex, but Consulting19\'s expert made it simple. Now we have full EU access for our digital business.',
      avatar: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=200',
    },
    {
      name: 'Amara Okafor',
      title: 'Managing Director, Global Trading Co.',
      country: 'UAE',
      rating: 5,
      text: 'The tax savings we achieved through their UAE setup recommendations paid for the consulting fees within the first quarter. Exceptional service.',
      avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=200',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of entrepreneurs who have successfully expanded their businesses globally with our expert guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="h-full">
              <Card.Body className="h-full flex flex-col relative">
                <Quote className="w-8 h-8 text-blue-600 opacity-20 absolute top-4 right-4" />
                
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-600 leading-relaxed mb-6 flex-1 italic">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.title}</div>
                    <div className="text-xs text-blue-600 font-medium">{testimonial.country}</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;