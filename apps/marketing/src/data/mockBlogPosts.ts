export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  authorBio: string;
  authorImage: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
  featured: boolean;
  countryId: string;
}

export const mockBlogPosts: BlogPost[] = [
  {
    id: 'uae-business-setup-2025',
    title: 'UAE Business Setup Guide 2025: Everything You Need to Know',
    excerpt: 'Complete guide to setting up your business in the UAE, including new regulations and tax benefits.',
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
    image: 'https://images.pexels.com/photos/1769606/pexels-photo-1769606.jpeg?auto=compress&cs=tinysrgb&w=600',
    featured: true,
    countryId: 'uae',
  },
  {
    id: 'estonia-e-residency-guide',
    title: 'Estonia e-Residency: Digital Nomad\'s Complete Guide',
    excerpt: 'How to become an Estonian e-Resident and run your EU business 100% online.',
    content: `
      <h2>What is Estonia e-Residency?</h2>
      <p>Estonia e-Residency is a groundbreaking digital identity program that allows anyone, anywhere in the world, to become a digital resident of Estonia and access its advanced digital services. This program enables entrepreneurs to establish and manage an EU-based company entirely online.</p>
      
      <h3>Key Benefits of e-Residency</h3>
      <ul>
        <li><strong>100% Online Business Management:</strong> Manage your company entirely digitally</li>
        <li><strong>EU Market Access:</strong> Full access to the European Union market</li>
        <li><strong>Digital Banking:</strong> Open business bank accounts online</li>
        <li><strong>Low Bureaucracy:</strong> Minimal paperwork and streamlined processes</li>
        <li><strong>Tax Efficiency:</strong> Pay corporate tax only on distributed profits</li>
      </ul>
      
      <h3>How to Apply for e-Residency</h3>
      <p>The application process is straightforward and can be completed entirely online:</p>
      <ol>
        <li>Submit your application online at e-resident.gov.ee</li>
        <li>Pay the application fee (€100)</li>
        <li>Wait for approval (typically 3-8 weeks)</li>
        <li>Pick up your digital ID card at an Estonian embassy or consulate</li>
      </ol>
      
      <h3>Setting Up Your Estonian Company</h3>
      <p>Once you have your e-Residency digital ID, you can establish an Estonian company online:</p>
      <ul>
        <li>Minimum share capital: €2,500</li>
        <li>Company registration fee: €190</li>
        <li>State fee: €25</li>
        <li>Notary fee: approximately €50-100</li>
      </ul>
      
      <h3>Banking Solutions</h3>
      <p>Estonian e-Residents have access to various banking options:</p>
      <ul>
        <li>Traditional Estonian banks (LHV, Swedbank)</li>
        <li>European fintech solutions (Wise, Revolut Business)</li>
        <li>Digital-first banking platforms</li>
      </ul>
      
      <h3>Tax Advantages</h3>
      <p>Estonia's unique tax system offers significant advantages:</p>
      <ul>
        <li>0% corporate tax on retained earnings</li>
        <li>20% tax only on distributed profits</li>
        <li>No double taxation for most countries</li>
        <li>Simple tax reporting requirements</li>
      </ul>
      
      <h3>Ongoing Compliance</h3>
      <p>Maintaining your Estonian company requires minimal ongoing compliance:</p>
      <ul>
        <li>Annual report submission</li>
        <li>Tax declarations (if profits are distributed)</li>
        <li>Maintaining registered office address</li>
        <li>Keeping proper accounting records</li>
      </ul>
      
      <h3>Conclusion</h3>
      <p>Estonia e-Residency represents the future of digital entrepreneurship, offering unprecedented access to EU markets with minimal bureaucracy. For digital nomads and online entrepreneurs, it provides an ideal foundation for building a global business.</p>
    `,
    author: 'Maria Kask',
    authorRole: 'Estonia Digital Business Expert',
    authorBio: 'Maria has helped over 500 entrepreneurs become Estonian e-Residents and establish successful EU businesses. She specializes in digital business formation and compliance.',
    authorImage: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=200',
    date: '2025-01-18',
    category: 'Digital Business',
    readTime: '6 min read',
    image: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=600',
    featured: false,
    countryId: 'estonia',
  },
  {
    id: 'georgia-small-business-status',
    title: 'Georgia\'s Small Business Status: 1% Tax Rate Explained',
    excerpt: 'Everything about Georgia\'s incredibly attractive small business tax regime.',
    content: `
      <h2>Understanding Georgia's Small Business Status</h2>
      <p>Georgia offers one of the world's most attractive tax regimes for small businesses through its Small Business Status program. This innovative system allows qualifying businesses to pay just 1% tax on their turnover, making it an incredibly appealing destination for entrepreneurs and small business owners.</p>
      
      <h3>Key Benefits of Small Business Status</h3>
      <ul>
        <li><strong>1% Tax Rate:</strong> Pay only 1% tax on annual turnover up to 500,000 GEL</li>
        <li><strong>Simple Registration:</strong> Quick and straightforward business registration process</li>
        <li><strong>Minimal Bureaucracy:</strong> Reduced administrative requirements</li>
        <li><strong>Strategic Location:</strong> Gateway between Europe and Asia</li>
        <li><strong>Banking Access:</strong> Well-developed banking sector</li>
      </ul>
      
      <h3>Eligibility Requirements</h3>
      <p>To qualify for Small Business Status in Georgia, your business must meet these criteria:</p>
      <ul>
        <li>Annual turnover must not exceed 500,000 GEL (approximately $185,000)</li>
        <li>Cannot be engaged in certain restricted activities (banking, insurance, etc.)</li>
        <li>Must be registered as a Georgian entity</li>
        <li>Cannot have more than 20 employees</li>
      </ul>
      
      <h3>Business Registration Process</h3>
      <p>Setting up a business in Georgia is remarkably simple:</p>
      <ol>
        <li>Choose your business name and check availability</li>
        <li>Prepare required documents (passport, business plan)</li>
        <li>Submit application to the House of Justice or online</li>
        <li>Pay registration fee (200 GEL for LLC)</li>
        <li>Receive your business registration certificate</li>
      </ol>
      
      <h3>Tax Obligations</h3>
      <p>Small Business Status comes with simplified tax obligations:</p>
      <ul>
        <li>1% tax on turnover (paid monthly)</li>
        <li>No VAT registration required (unless voluntary)</li>
        <li>No profit tax</li>
        <li>Simplified reporting requirements</li>
      </ul>
      
      <h3>Banking and Financial Services</h3>
      <p>Georgia offers excellent banking services for businesses:</p>
      <ul>
        <li>Multiple international and local banks</li>
        <li>Online banking services</li>
        <li>Multi-currency accounts available</li>
        <li>Competitive business banking rates</li>
      </ul>
      
      <h3>Additional Advantages</h3>
      <p>Beyond the favorable tax regime, Georgia offers:</p>
      <ul>
        <li>Free trade agreements with EU, China, and others</li>
        <li>Visa-free travel for many nationalities</li>
        <li>English-speaking business environment</li>
        <li>Low cost of living and operations</li>
        <li>Growing startup ecosystem</li>
      </ul>
      
      <h3>Compliance Requirements</h3>
      <p>Maintaining Small Business Status requires:</p>
      <ul>
        <li>Monthly tax payments by the 15th of following month</li>
        <li>Annual turnover monitoring</li>
        <li>Proper record keeping</li>
        <li>Notification of any status changes</li>
      </ul>
      
      <h3>Conclusion</h3>
      <p>Georgia's Small Business Status represents one of the most entrepreneur-friendly tax regimes globally. With its 1% tax rate, simple procedures, and strategic location, Georgia is an excellent choice for small businesses looking to optimize their tax burden while maintaining operational flexibility.</p>
    `,
    author: 'Giorgi Meskhi',
    authorRole: 'Georgia Business Formation Specialist',
    authorBio: 'Giorgi has over 8 years of experience helping international entrepreneurs establish businesses in Georgia. He specializes in small business status applications and tax optimization.',
    authorImage: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=200',
    date: '2025-01-12',
    category: 'Tax Planning',
    readTime: '5 min read',
    image: 'https://images.pexels.com/photos/5137987/pexels-photo-5137987.jpeg?auto=compress&cs=tinysrgb&w=600',
    featured: false,
    countryId: 'georgia',
  },
];

export const getFeaturedBlogPosts = (): BlogPost[] => {
  return mockBlogPosts.filter(post => post.featured);
};

export const getLatestBlogPosts = (limit: number = 3): BlogPost[] => {
  return mockBlogPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};

export const getBlogPostsByCountry = (countryId: string): BlogPost[] => {
  return mockBlogPosts.filter(post => post.countryId === countryId);
};

export const getBlogPostById = (id: string): BlogPost | undefined => {
  return mockBlogPosts.find(post => post.id === id);
};