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
        <meta name="description" content="Consulting19 hizmet şartları ve kullanım koşulları. Platformumuzu kullanırken uymanız gereken kurallar ve koşullar." />
      </Helmet>

      <Navbar />

      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hizmet Şartları</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Platformumuzu kullanırken uymanız gereken şartlar ve koşullar.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card>
          <Card.Body className="prose prose-lg max-w-none text-gray-700">
            <h2>Giriş</h2>
            <p>
              Bu Hizmet Şartları ("Şartlar"), Consulting19 web sitesi ve hizmetlerinin kullanımını düzenler. Web sitemizi ziyaret ederek veya hizmetlerimizi kullanarak, bu şartları kabul etmiş sayılırsınız. Bu şartları kabul etmiyorsanız, lütfen hizmetlerimizi kullanmayın.
            </p>

            <h2>Hizmet Tanımı</h2>
            <p>
              Consulting19, uluslararası danışmanlık hizmetleri sunan bir platformdur. Hizmetlerimiz şunları içerir:
            </p>
            <ul>
              <li>Şirket kuruluş danışmanlığı</li>
              <li>Vergi optimizasyonu danışmanlığı</li>
              <li>Vize ve oturum izni danışmanlığı</li>
              <li>Bankacılık çözümleri</li>
              <li>Yasal uyumluluk danışmanlığı</li>
              <li>Varlık koruma stratejileri</li>
              <li>Yatırım danışmanlığı</li>
              <li>Pazar araştırması</li>
            </ul>

            <h2>Kullanıcı Hesapları</h2>
            <p>
              Hizmetlerimizin bazılarını kullanmak için bir hesap oluşturmanız gerekebilir. Hesap oluştururken:
            </p>
            <ul>
              <li>Doğru, güncel ve eksiksiz bilgiler sağlamalısınız</li>
              <li>Hesap güvenliğinizi korumakla yükümlüsünüz</li>
              <li>Hesabınızda gerçekleşen tüm faaliyetlerden sorumlusunuz</li>
              <li>Hesap bilgilerinizi başkalarıyla paylaşmamalısınız</li>
              <li>Şüpheli aktivite durumunda derhal bizi bilgilendirmelisiniz</li>
            </ul>

            <h2>Kabul Edilebilir Kullanım</h2>
            <p>
              Hizmetlerimizi kullanırken aşağıdaki kurallara uymalısınız:
            </p>
            <ul>
              <li>Yürürlükteki tüm yasalara ve düzenlemelere uygun hareket etmek</li>
              <li>Başkalarının haklarını ihlal etmemek</li>
              <li>Yanıltıcı veya yanlış bilgi vermemek</li>
              <li>Sistemi kötüye kullanmamak veya zarar vermemek</li>
              <li>Spam veya istenmeyen içerik göndermemek</li>
              <li>Fikri mülkiyet haklarını ihlal etmemek</li>
            </ul>

            <h2>Ödeme ve Faturalandırma</h2>
            <p>
              Ücretli hizmetler için:
            </p>
            <ul>
              <li>Tüm ücretler önceden belirtilir ve onayınız alınır</li>
              <li>Ödemeler güvenli ödeme işlemcileri aracılığıyla yapılır</li>
              <li>İade politikamız hizmet türüne göre değişiklik gösterebilir</li>
              <li>Ödeme yapılmayan hizmetler askıya alınabilir</li>
              <li>Fiyat değişiklikleri önceden bildirilir</li>
            </ul>

            <h2>Fikri Mülkiyet</h2>
            <p>
              Web sitemiz ve hizmetlerimizle ilgili tüm içerik, tasarım, logo, marka ve diğer fikri mülkiyet unsurları Consulting19'a aittir ve telif hakkı yasalarıyla korunmaktadır. Bu içerikleri izin almadan kopyalayamaz, dağıtamaz veya ticari amaçlarla kullanamazsınız.
            </p>

            <h2>Gizlilik</h2>
            <p>
              Kişisel verilerinizin toplanması, kullanılması ve korunması Gizlilik Politikamızda detaylandırılmıştır. Bu şartları kabul ederek, Gizlilik Politikamızı da kabul etmiş olursunuz.
            </p>

            <h2>Hizmet Reddi</h2>
            <p>
              Aşağıdaki durumlarda hizmet vermeyi reddetme hakkımızı saklı tutarız:
            </p>
            <ul>
              <li>Bu şartları ihlal eden kullanıcılar</li>
              <li>Yasal olmayan faaliyetlerde bulunan kişi veya kuruluşlar</li>
              <li>Yanlış veya eksik bilgi sağlayan müşteriler</li>
              <li>Hizmet kalitemizi olumsuz etkileyebilecek durumlar</li>
            </ul>

            <h2>Sorumluluk Sınırlaması</h2>
            <p>
              Consulting19, hizmetlerinin kesintisiz, hatasız veya güvenli olacağını garanti etmez. Hizmetlerimizin kullanımından doğabilecek doğrudan veya dolaylı zararlardan sorumlu değiliz. Sorumluluğumuz, ödediğiniz hizmet bedeliyle sınırlıdır.
            </p>

            <h2>Hizmet Değişiklikleri</h2>
            <p>
              Hizmetlerimizi önceden haber vermeksizin değiştirme, askıya alma veya sonlandırma hakkımızı saklı tutarız. Önemli değişiklikler için mümkün olduğunca önceden bildirimde bulunmaya çalışırız.
            </p>

            <h2>Şartlarda Değişiklikler</h2>
            <p>
              Bu Hizmet Şartları'nı zaman zaman güncelleyebiliriz. Değişiklikler web sitemizde yayınlandığı anda yürürlüğe girer. Önemli değişiklikler için e-posta yoluyla bildirim gönderebiliriz.
            </p>

            <h2>Fesih</h2>
            <p>
              Bu anlaşmayı herhangi bir zamanda feshedebilirsiniz. Şartları ihlal etmeniz durumunda hesabınızı askıya alabilir veya sonlandırabiliriz.
            </p>

            <h2>Uygulanacak Hukuk</h2>
            <p>
              Bu şartlar Türkiye Cumhuriyeti yasalarına tabidir. Herhangi bir uyuşmazlık durumunda Türkiye mahkemeleri yetkilidir.
            </p>

            <h2>İletişim</h2>
            <p>
              Bu Hizmet Şartları hakkında sorularınız varsa, lütfen bizimle iletişime geçin:
            </p>
            <p>
              E-posta: support@consulting19.com
            </p>
            <p>
              Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
            </p>
          </Card.Body>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default TermsPage;