import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, Users, Clock } from 'lucide-react';

interface CountryPageProps {
  country: string;
  language: 'en' | 'tr';
}

const CountryPage: React.FC<CountryPageProps> = ({ country, language }) => {
  const countryData = {
    georgia: {
      name: 'Georgia',
      flag: '🇬🇪',
      capital: 'Tbilisi',
      image: 'https://images.pexels.com/photos/12461213/pexels-photo-12461213.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      en: {
        title: 'Start Your Business in Georgia',
        subtitle: 'Easy company formation with significant tax advantages and strategic location',
        keyAdvantage: '0% Tax on Foreign Income',
        description: 'Georgia offers one of the most business-friendly environments in the world with its unique tax system, strategic location between Europe and Asia, and simplified company formation process.',
        advantages: [
          '0% tax on foreign-sourced income',
          'Strategic location between Europe and Asia',
          'Simple 3-day company formation process',
          'Banking-friendly environment',
          'No currency restrictions',
          'Strong legal framework'
        ],
        stats: {
          setupTime: '3-5 days',
          clients: '1,247',
          rating: '4.9'
        }
      },
      tr: {
        title: 'Gürcistan\'da İşinizi Kurun',
        subtitle: 'Önemli vergi avantajları ve stratejik konum ile kolay şirket kuruluşu',
        keyAdvantage: 'Yabancı Gelirde %0 Vergi',
        description: 'Gürcistan, benzersiz vergi sistemi, Avrupa ve Asya arasındaki stratejik konumu ve basitleştirilmiş şirket kuruluş süreci ile dünyanın en iş dostu ortamlarından birini sunuyor.',
        advantages: [
          'Yabancı kaynaklı gelirde %0 vergi',
          'Avrupa ve Asya arasında stratejik konum',
          'Basit 3 günlük şirket kuruluş süreci',
          'Bankacılık dostu ortam',
          'Döviz kısıtlaması yok',
          'Güçlü hukuki çerçeve'
        ],
        stats: {
          setupTime: '3-5 gün',
          clients: '1.247',
          rating: '4,9'
        }
      }
    },
    usa: {
      name: 'United States',
      flag: '🇺🇸',
      capital: 'Delaware',
      image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      en: {
        title: 'Start Your Business in USA',
        subtitle: 'Delaware LLC formation providing access to the world\'s largest economy',
        keyAdvantage: 'Global Market Access',
        description: 'The United States offers unparalleled access to global markets, advanced financial systems, and the world\'s most sophisticated business infrastructure.',
        advantages: [
          'Access to world\'s largest economy',
          'Delaware business-friendly laws',
          'Global credibility and recognition',
          'Advanced banking and financial systems',
          'Strong intellectual property protection',
          'Extensive business networks'
        ],
        stats: {
          setupTime: '1-2 days',
          clients: '892',
          rating: '4.8'
        }
      },
      tr: {
        title: 'ABD\'de İşinizi Kurun',
        subtitle: 'Dünyanın en büyük ekonomisine erişim sağlayan Delaware LLC kuruluşu',
        keyAdvantage: 'Küresel Pazar Erişimi',
        description: 'Amerika Birleşik Devletleri, küresel pazarlara eşsiz erişim, gelişmiş finansal sistemler ve dünyanın en sofistike iş altyapısını sunuyor.',
        advantages: [
          'Dünyanın en büyük ekonomisine erişim',
          'Delaware iş dostu yasaları',
          'Küresel güvenilirlik ve tanınırlık',
          'Gelişmiş bankacılık ve finansal sistemler',
          'Güçlü fikri mülkiyet koruması',
          'Kapsamlı iş ağları'
        ],
        stats: {
          setupTime: '1-2 gün',
          clients: '892',
          rating: '4,8'
        }
      }
    },
    montenegro: {
      name: 'Montenegro',
      flag: '🇲🇪',
      capital: 'Podgorica',
      image: 'https://images.pexels.com/photos/15031396/pexels-photo-15031396.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      en: {
        title: 'Start Your Business in Montenegro',
        subtitle: 'EU candidacy status with investment opportunities and residency programs',
        keyAdvantage: 'EU Candidate Benefits',
        description: 'Montenegro offers unique opportunities as an EU candidate country with attractive investment programs, beautiful Adriatic location, and growing economy.',
        advantages: [
          'EU candidate country status',
          'Residency by investment programs',
          'Low corporate tax rates',
          'Strategic Adriatic location',
          'Growing tourism industry',
          'English-speaking business environment'
        ],
        stats: {
          setupTime: '5-7 days',
          clients: '634',
          rating: '4.7'
        }
      },
      tr: {
        title: 'Karadağ\'da İşinizi Kurun',
        subtitle: 'Yatırım fırsatları ve ikamet programları ile AB aday ülke statüsü',
        keyAdvantage: 'AB Aday Ülke Avantajları',
        description: 'Karadağ, AB aday ülkesi olarak cazip yatırım programları, güzel Adriyatik konumu ve büyüyen ekonomisi ile benzersiz fırsatlar sunuyor.',
        advantages: [
          'AB aday ülkesi statüsü',
          'Yatırımla ikamet programları',
          'Düşük kurumlar vergisi oranları',
          'Stratejik Adriyatik konumu',
          'Büyüyen turizm endüstrisi',
          'İngilizce konuşulan iş ortamı'
        ],
        stats: {
          setupTime: '5-7 gün',
          clients: '634',
          rating: '4,7'
        }
      }
    },
    estonia: {
      name: 'Estonia',
      flag: '🇪🇪',
      capital: 'Tallinn',
      image: 'https://images.pexels.com/photos/9816335/pexels-photo-9816335.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      en: {
        title: 'Start Your Business in Estonia',
        subtitle: 'e-Residency program and digital-first approach for modern businesses',
        keyAdvantage: 'Digital Nomad Paradise',
        description: 'Estonia leads the world in digital innovation with its e-Residency program, allowing you to run an EU company entirely online from anywhere in the world.',
        advantages: [
          'World-famous e-Residency program',
          'Fully digital government services',
          'EU membership benefits',
          'Tech-friendly regulatory environment',
          'No corporate tax on retained earnings',
          'Advanced digital infrastructure'
        ],
        stats: {
          setupTime: '1 day',
          clients: '1,156',
          rating: '4.9'
        }
      },
      tr: {
        title: 'Estonya\'da İşinizi Kurun',
        subtitle: 'Modern işletmeler için e-İkamet programı ve dijital öncelikli yaklaşım',
        keyAdvantage: 'Dijital Göçebe Cenneti',
        description: 'Estonya, e-İkamet programı ile dijital inovasyonda dünyaya öncülük ediyor ve dünyanın herhangi bir yerinden tamamen online AB şirketi işletmenize olanak tanıyor.',
        advantages: [
          'Dünyaca ünlü e-İkamet programı',
          'Tamamen dijital devlet hizmetleri',
          'AB üyelik avantajları',
          'Teknoloji dostu düzenleyici ortam',
          'Dağıtılmayan kazançlarda kurumlar vergisi yok',
          'Gelişmiş dijital altyapı'
        ],
        stats: {
          setupTime: '1 gün',
          clients: '1.156',
          rating: '4,9'
        }
      }
    },
    portugal: {
      name: 'Portugal',
      flag: '🇵🇹',
      capital: 'Lisbon',
      image: 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      en: {
        title: 'Start Your Business in Portugal',
        subtitle: 'EU membership benefits with Golden Visa program and favorable tax regime',
        keyAdvantage: 'Golden Visa Gateway',
        description: 'Portugal combines EU membership benefits with attractive investment programs, excellent quality of life, and favorable tax regimes for international businesses.',
        advantages: [
          'Golden Visa investment program',
          'Full EU membership benefits',
          'NHR tax regime for residents',
          'Excellent quality of life',
          'Strategic Atlantic location',
          'Growing startup ecosystem'
        ],
        stats: {
          setupTime: '7-10 days',
          clients: '789',
          rating: '4.8'
        }
      },
      tr: {
        title: 'Portekiz\'de İşinizi Kurun',
        subtitle: 'Altın Vize programı ve uygun vergi rejimi ile AB üyelik avantajları',
        keyAdvantage: 'Altın Vize Kapısı',
        description: 'Portekiz, AB üyelik avantajlarını cazip yatırım programları, mükemmel yaşam kalitesi ve uluslararası işletmeler için uygun vergi rejimleri ile birleştiriyor.',
        advantages: [
          'Altın Vize yatırım programı',
          'Tam AB üyelik avantajları',
          'Mukimler için NHR vergi rejimi',
          'Mükemmel yaşam kalitesi',
          'Stratejik Atlantik konumu',
          'Büyüyen startup ekosistemi'
        ],
        stats: {
          setupTime: '7-10 gün',
          clients: '789',
          rating: '4,8'
        }
      }
    },
    malta: {
      name: 'Malta',
      flag: '🇲🇹',
      capital: 'Valletta',
      image: 'https://images.pexels.com/photos/9816335/pexels-photo-9816335.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      en: {
        title: 'Start Your Business in Malta',
        subtitle: 'EU membership with sophisticated tax planning and financial services',
        keyAdvantage: 'EU Tax Optimization',
        description: 'Malta offers sophisticated tax planning opportunities within the EU framework, combined with a thriving financial services sector and English-speaking environment.',
        advantages: [
          'Advanced EU tax optimization',
          'Thriving financial services hub',
          'English-speaking environment',
          'Strategic Mediterranean location',
          'Strong regulatory framework',
          'Attractive holding company regime'
        ],
        stats: {
          setupTime: '5-7 days',
          clients: '567',
          rating: '4.7'
        }
      },
      tr: {
        title: 'Malta\'da İşinizi Kurun',
        subtitle: 'Sofistike vergi planlaması ve finansal hizmetler ile AB üyeliği',
        keyAdvantage: 'AB Vergi Optimizasyonu',
        description: 'Malta, AB çerçevesi içinde sofistike vergi planlama fırsatları, gelişen finansal hizmetler sektörü ve İngilizce konuşulan ortam sunuyor.',
        advantages: [
          'Gelişmiş AB vergi optimizasyonu',
          'Gelişen finansal hizmetler merkezi',
          'İngilizce konuşulan ortam',
          'Stratejik Akdeniz konumu',
          'Güçlü düzenleyici çerçeve',
          'Cazip holding şirketi rejimi'
        ],
        stats: {
          setupTime: '5-7 gün',
          clients: '567',
          rating: '4,7'
        }
      }
    },
    panama: {
      name: 'Panama',
      flag: '🇵🇦',
      capital: 'Panama City',
      image: 'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      en: {
        title: 'Start Your Business in Panama',
        subtitle: 'Premier offshore jurisdiction with strong banking and privacy laws',
        keyAdvantage: 'Offshore Finance Hub',
        description: 'Panama is a premier offshore jurisdiction offering strong banking privacy laws, no foreign tax obligations, and strategic location connecting the Americas.',
        advantages: [
          'Strong offshore advantages',
          'Banking privacy protection',
          'No tax on foreign income',
          'Strategic Americas location',
          'USD as official currency',
          'Established legal framework'
        ],
        stats: {
          setupTime: '3-5 days',
          clients: '445',
          rating: '4.6'
        }
      },
      tr: {
        title: 'Panama\'da İşinizi Kurun',
        subtitle: 'Güçlü bankacılık ve gizlilik yasaları ile önde gelen offshore yargı alanı',
        keyAdvantage: 'Offshore Finans Merkezi',
        description: 'Panama, güçlü bankacılık gizlilik yasaları, yabancı vergi yükümlülüğü olmaması ve Amerika kıtalarını birbirine bağlayan stratejik konumu ile önde gelen offshore yargı alanıdır.',
        advantages: [
          'Güçlü offshore avantajları',
          'Bankacılık gizlilik koruması',
          'Yabancı gelirde vergi yok',
          'Stratejik Amerika konumu',
          'Resmi para birimi USD',
          'Yerleşik hukuki çerçeve'
        ],
        stats: {
          setupTime: '3-5 gün',
          clients: '445',
          rating: '4,6'
        }
      }
    }
  };

  const data = countryData[country as keyof typeof countryData];
  if (!data) {
    return <div className="pt-16 min-h-screen flex items-center justify-center">Country not found</div>;
  }

  const content = data[language];

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <div className="flex items-center mb-4">
              <span className="text-6xl mr-4">{data.flag}</span>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{content.title}</h1>
                <p className="text-xl text-white/90">{content.subtitle}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Advantage Banner */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {content.keyAdvantage}
          </h2>
          <p className="text-white/90">
            {language === 'en' ? 'Key advantage of doing business in' : 'İş yapmanın temel avantajı'} {data.name}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Description */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {language === 'en' ? 'Why Choose' : 'Neden Seçmeli'} {data.name}?
              </h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {content.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="h-5 w-5 text-purple-600 mr-1" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{content.stats.setupTime}</div>
                  <div className="text-sm text-gray-600">
                    {language === 'en' ? 'Setup Time' : 'Kuruluş Süresi'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-5 w-5 text-purple-600 mr-1" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{content.stats.clients}</div>
                  <div className="text-sm text-gray-600">
                    {language === 'en' ? 'Happy Clients' : 'Mutlu Müşteri'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="h-5 w-5 text-purple-600 mr-1" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{content.stats.rating}</div>
                  <div className="text-sm text-gray-600">
                    {language === 'en' ? 'Rating' : 'Değerlendirme'}
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
                {language === 'en' ? 'Start Company Formation' : 'Şirket Kuruluşunu Başlat'}
                <ArrowRight className="ml-2 h-5 w-5 inline" />
              </button>
            </div>

            {/* Advantages List */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {language === 'en' ? 'Key Advantages' : 'Temel Avantajlar'}
              </h3>
              <div className="space-y-4">
                {content.advantages.map((advantage, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{advantage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            {language === 'en' ? 'Ready to Get Started?' : 'Başlamaya Hazır mısınız?'}
          </h3>
          <p className="text-xl text-gray-600 mb-8">
            {language === 'en' 
              ? `Contact our ${data.name} specialists for personalized guidance`
              : `Kişiselleştirilmiş rehberlik için ${data.name} uzmanlarımızla iletişime geçin`
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-xl">
              {language === 'en' ? 'Start Company Formation' : 'Şirket Kuruluşunu Başlat'}
            </button>
            <Link
              to="/contact"
              className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-purple-50 transition-all duration-300"
            >
              {language === 'en' ? 'Contact Expert' : 'Uzmanla İletişim'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CountryPage;