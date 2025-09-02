```typescript
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card } from '../lib/ui';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Gizlilik Politikası - Consulting19</title>
        <meta name="description" content="Consulting19'un gizlilik politikası hakkında bilgi edinin. Verilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu öğrenin." />
      </Helmet>

      <Navbar />

      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Gizlilik Politikası</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Verilerinizin güvenliği ve gizliliği bizim için önceliktir.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card>
          <Card.Body className="prose prose-lg max-w-none text-gray-700">
            <h2>Giriş</h2>
            <p>
              Consulting19 olarak, web sitemizi ve hizmetlerimizi kullanırken gizliliğinizin korunmasına büyük önem veriyoruz. Bu Gizlilik Politikası, kişisel verilerinizi nasıl topladığımızı, kullandığımızı, işlediğimizi ve koruduğumuzu açıklamaktadır. Hizmetlerimizi kullanarak, bu politikada açıklanan uygulamaları kabul etmiş olursunuz.
            </p>

            <h2>Topladığımız Bilgiler</h2>
            <p>
              Hizmetlerimizi sunarken ve iyileştirirken çeşitli türde bilgiler toplarız:
            </p>
            <ul>
              <li><strong>Kişisel Tanımlayıcı Bilgiler:</strong> Adınız, e-posta adresiniz, telefon numaranız, şirket adınız, ülkeniz ve diğer iletişim bilgileriniz gibi doğrudan sizi tanımlayan bilgiler. Bu bilgiler genellikle hesap oluşturma, hizmet talebinde bulunma veya bizimle iletişime geçme sırasında sağlanır.</li>
              <li><strong>Kullanım Verileri:</strong> Web sitemizle nasıl etkileşim kurduğunuz hakkında bilgiler. Bu, IP adresiniz, tarayıcı türünüz, ziyaret ettiğiniz sayfalar, sitemizde geçirdiğiniz süre ve referans URL'ler gibi verileri içerebilir.</li>
              <li><strong>Finansal Bilgiler:</strong> Ödeme işlemleri için gerekli olan fatura adresleri gibi bilgiler. Kredi kartı numaraları gibi hassas finansal bilgiler doğrudan tarafımızca saklanmaz, güvenli ödeme işlemcileri aracılığıyla işlenir.</li>
            </ul>

            <h2>Bilgilerinizi Nasıl Kullanıyoruz?</h2>
            <p>
              Topladığımız bilgileri aşağıdaki amaçlar doğrultusunda kullanırız:
            </p>
            <ul>
              <li>Hizmetlerimizi sunmak, işletmek ve sürdürmek.</li>
              <li>Hesabınızı yönetmek ve size teknik destek sağlamak.</li>
              <li>Sorularınıza ve taleplerinize yanıt vermek.</li>
              <li>Hizmetlerimizi iyileştirmek ve yeni özellikler geliştirmek.</li>
              <li>Size pazarlama ve tanıtım materyalleri göndermek (onayınızla).</li>
              <li>Yasal yükümlülüklere uymak ve dolandırıcılığı önlemek.</li>
              <li>Web sitesi kullanımını analiz etmek ve trendleri izlemek.</li>
            </ul>

            <h2>Bilgilerinizi Nasıl Paylaşıyoruz?</h2>
            <p>
              Kişisel verilerinizi aşağıdaki durumlarda üçüncü taraflarla paylaşabiliriz:
            </p>
            <ul>
              <li><strong>Hizmet Sağlayıcılar:</strong> Hizmetlerimizi sunmamıza yardımcı olan üçüncü taraf şirketlerle (örneğin, ödeme işlemcileri, barındırma hizmetleri, analitik sağlayıcılar).</li>
              <li><strong>İş Ortakları:</strong> Size ilgili hizmetler veya teklifler sunmak için iş ortaklarımızla.</li>
              <li><strong>Yasal Gereklilikler:</strong> Yasal bir yükümlülüğe uymak, mahkeme celbine yanıt vermek veya yasal süreçlere uymak için.</li>
              <li><strong>İş Transferleri:</strong> Birleşme, satın alma veya varlık satışı gibi durumlarda.</li>
              <li><strong>Onayınızla:</strong> Açık rızanızla diğer durumlar.</li>
            </ul>

            <h2>Veri Saklama</h2>
            <p>
              Kişisel verilerinizi, bu Gizlilik Politikası'nda belirtilen amaçları yerine getirmek için gerekli olduğu sürece veya yasal olarak gerekli olduğu sürece saklarız.
            </p>

            <h2>Haklarınız</h2>
            <p>
              Kişisel verilerinizle ilgili belirli haklara sahipsiniz:
            </p>
            <ul>
              <li><strong>Erişim Hakkı:</strong> Hakkınızda tuttuğumuz kişisel verilere erişim talep etme.</li>
              <li><strong>Düzeltme Hakkı:</strong> Yanlış veya eksik kişisel verilerinizi düzeltme talep etme.</li>
              <li><strong>Silme Hakkı:</strong> Belirli koşullar altında kişisel verilerinizin silinmesini talep etme.</li>
              <li><strong>İşlemeyi Kısıtlama Hakkı:</strong> Belirli koşullar altında kişisel verilerinizin işlenmesini kısıtlama talep etme.</li>
              <li><strong>Veri Taşınabilirliği Hakkı:</strong> Kişisel verilerinizi yapılandırılmış, yaygın olarak kullanılan ve makine tarafından okunabilir bir formatta alma hakkı.</li>
              <li><strong>İtiraz Hakkı:</strong> Kişisel verilerinizin işlenmesine itiraz etme hakkı.</li>
            </ul>
            <p>
              Bu haklarınızı kullanmak için lütfen aşağıdaki iletişim bilgilerini kullanarak bizimle iletişime geçin.
            </p>

            <h2>Veri Güvenliği</h2>
            <p>
              Kişisel verilerinizi yetkisiz erişim, kullanım veya ifşadan korumak için uygun güvenlik önlemleri alırız. Ancak, internet üzerinden hiçbir veri aktarımının veya elektronik depolama yönteminin %100 güvenli olduğu garanti edilemez.
            </p>

            <h2>Uluslararası Veri Transferleri</h2>
            <p>
              Bilgileriniz, ikamet ettiğiniz ülke dışındaki sunucularda saklanabilir ve işlenebilir. Verilerinizin bu Gizlilik Politikası'na uygun olarak korunmasını sağlamak için gerekli adımları atarız.
            </p>

            <h2>Çocukların Gizliliği</h2>
            <p>
              Hizmetlerimiz 18 yaşın altındaki kişilere yönelik değildir. Bilerek 18 yaşın altındaki çocuklardan kişisel bilgi toplamayız.
            </p>

            <h2>Bu Politikadaki Değişiklikler</h2>
            <p>
              Bu Gizlilik Politikası'nı zaman zaman güncelleyebiliriz. Herhangi bir değişiklik durumunda, güncellenmiş politikayı web sitemizde yayınlayarak sizi bilgilendireceğiz. Değişiklikler yayınlandığı anda yürürlüğe girer.
            </p>

            <h2>Bize Ulaşın</h2>
            <p>
              Bu Gizlilik Politikası veya veri uygulamalarımız hakkında herhangi bir sorunuz varsa, lütfen bizimle iletişime geçin:
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

export default PrivacyPage;
```