```typescript
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card } from '../lib/ui';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Hizmet Şartları - Consulting19</title>
        <meta name="description" content="Consulting19'un hizmet şartları hakkında bilgi edinin. Platformumuzu kullanırken geçerli olan kuralları ve koşulları öğrenin." />
      </Helmet>

      <Navbar />

      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hizmet Şartları</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Platformumuzu kullanırken geçerli olan kurallar ve koşullar.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card>
          <Card.Body className="prose prose-lg max-w-none text-gray-700">
            <h2>Giriş</h2>
            <p>
              Consulting19'a hoş geldiniz. Bu Hizmet Şartları ("Şartlar"), Consulting19 tarafından sunulan web sitesi ve hizmetlerin kullanımını düzenler. Hizmetlerimize erişerek veya bunları kullanarak, bu Şartlara ve Gizlilik Politikamıza uymayı kabul etmiş olursunuz. Bu Şartları kabul etmiyorsanız, hizmetlerimizi kullanmamalısınız.
            </p>

            <h2>Hizmetlerin Tanımı</h2>
            <p>
              Consulting19, girişimcileri 19'dan fazla ülkedeki uzman iş danışmanlarıyla bir araya getiren yapay zeka destekli bir platformdur. Hizmetlerimiz şirket kuruluşu, vergi optimizasyonu, bankacılık çözümleri ve yasal uyumluluk gibi uluslararası iş genişletme hizmetlerini içerir.
            </p>

            <h2>Kullanıcı Hesapları</h2>
            <ul>
              <li><strong>Hesap Oluşturma:</strong> Hizmetlerimizin belirli özelliklerine erişmek için bir hesap oluşturmanız gerekebilir. Hesap oluştururken doğru ve güncel bilgiler sağlamayı kabul edersiniz.</li>
              <li><strong>Hesap Sorumluluğu:</strong> Hesabınızın ve şifrenizin gizliliğini korumaktan siz sorumlusunuz. Hesabınız altında gerçekleşen tüm faaliyetlerden siz sorumlusunuz.</li>
              <li><strong>Güvenlik:</strong> Hesabınızın yetkisiz kullanımını veya herhangi bir güvenlik ihlalini derhal bize bildirmeyi kabul edersiniz.</li>
            </ul>

            <h2>Kullanıcı Davranışı</h2>
            <p>
              Hizmetlerimizi kullanırken aşağıdaki davranış kurallarına uymayı kabul edersiniz:
            </p>
            <ul>
              <li>Yasalara ve düzenlemelere uymak.</li>
              <li>Platformu kötüye kullanmamak veya zarar vermemek.</li>
              <li>Diğer kullanıcıların haklarını ihlal etmemek.</li>
              <li>Yanlış veya yanıltıcı bilgi sağlamamak.</li>
              <li>Platforma virüs veya kötü amaçlı yazılım yüklememek.</li>
            </ul>

            <h2>Fikri Mülkiyet</h2>
            <p>
              Consulting19 platformu ve içeriği (metinler, grafikler, logolar, yazılım vb.) Consulting19'a veya lisans verenlerine aittir ve telif hakkı, ticari marka ve diğer fikri mülkiyet yasalarıyla korunmaktadır. Hizmetlerimizi kullanarak, bu fikri mülkiyet haklarını ihlal etmemeyi kabul edersiniz.
            </p>

            <h2>Ödeme ve Faturalandırma</h2>
            <p>
              Hizmetlerimiz için ödeme yapmanız gerekebilir. Tüm ücretler ve ödeme koşulları, ilgili hizmetin açıklamasında belirtilecektir. Tüm ödemelerin zamanında yapılmasından siz sorumlusunuz.
            </p>

            <h2>Feragatnameler</h2>
            <p>
              Hizmetlerimiz "olduğu gibi" ve "mevcut olduğu gibi" sağlanmaktadır. Consulting19, hizmetlerin kesintisiz, hatasız veya güvenli olacağına dair herhangi bir garanti vermez. Danışmanlık hizmetleri, genel bilgi amaçlıdır ve yasal, finansal veya vergi tavsiyesi olarak yorumlanmamalıdır.
            </p>

            <h2>Sorumluluğun Sınırlandırılması</h2>
            <p>
              Yürürlükteki yasaların izin verdiği en geniş ölçüde, Consulting19, hizmetlerin kullanımından kaynaklanan herhangi bir doğrudan, dolaylı, arızi, özel, sonuç olarak ortaya çıkan veya cezai zararlardan sorumlu olmayacaktır.
            </p>

            <h2>Tazminat</h2>
            <p>
              Bu Şartları ihlal etmeniz veya hizmetleri kullanmanızdan kaynaklanan herhangi bir iddia, zarar, yükümlülük, maliyet veya giderden (makul avukatlık ücretleri dahil) Consulting19'u tazmin etmeyi ve zararsız tutmayı kabul edersiniz.
            </p>

            <h2>Geçerli Yasa ve Anlaşmazlık Çözümü</h2>
            <p>
              Bu Şartlar, kanunlar ihtilafı hükümlerine bakılmaksızın [Ülke/Eyalet Adı] yasalarına göre yönetilecektir. Hizmetlerle ilgili herhangi bir anlaşmazlık, [Şehir/Bölge Adı] mahkemelerinin münhasır yargı yetkisine tabi olacaktır.
            </p>

            <h2>Şartlarda Değişiklikler</h2>
            <p>
              Bu Hizmet Şartlarını zaman zaman kendi takdirimize bağlı olarak güncelleyebiliriz. Herhangi bir değişiklik durumunda, güncellenmiş Şartları web sitemizde yayınlayarak sizi bilgilendireceğiz. Değişiklikler yayınlandığı anda yürürlüğe girer.
            </p>

            <h2>Fesih</h2>
            <p>
              Bu Şartları ihlal etmeniz durumunda, hesabınızı veya hizmetlere erişiminizi derhal feshetme hakkımızı saklı tutarız.
            </p>

            <h2>Bize Ulaşın</h2>
            <p>
              Bu Hizmet Şartları hakkında herhangi bir sorunuz varsa, lütfen bizimle iletişime geçin:
            </p>
            <p>
              E-posta: support@consulting19.com
            </p>
          </Card.Body>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default TermsPage;
```