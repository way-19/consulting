```typescript
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card } from '../lib/ui';

const CookiePolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Çerez Politikası - Consulting19</title>
        <meta name="description" content="Consulting19'un çerez politikası hakkında bilgi edinin. Çerezleri nasıl kullandığımızı ve tercihlerinizi nasıl yönetebileceğinizi öğrenin." />
      </Helmet>

      <Navbar />

      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Çerez Politikası</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Web sitemizde çerezleri nasıl kullandığımızı öğrenin.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card>
          <Card.Body className="prose prose-lg max-w-none text-gray-700">
            <h2>Giriş</h2>
            <p>
              Bu Çerez Politikası, Consulting19 ("biz", "bize" veya "bizim") tarafından işletilen web sitesi (consulting19.com) üzerinde çerezlerin ve benzer teknolojilerin nasıl kullanıldığını açıklamaktadır. Web sitemizi kullanarak, bu Çerez Politikası'nda belirtilen çerezlerin kullanımını kabul etmiş olursunuz.
            </p>

            <h2>Çerez Nedir?</h2>
            <p>
              Çerezler, bir web sitesini ziyaret ettiğinizde bilgisayarınıza veya mobil cihazınıza yerleştirilen küçük metin dosyalarıdır. Web sitesinin sizi hatırlamasını, tercihlerinizi (örneğin, oturum açma bilgileri, dil) kaydetmesini ve size daha kişiselleştirilmiş bir deneyim sunmasını sağlar.
            </p>

            <h2>Çerezleri Nasıl Kullanıyoruz?</h2>
            <p>
              Çerezleri çeşitli amaçlar için kullanırız:
            </p>
            <ul>
              <li><strong>Kesinlikle Gerekli Çerezler:</strong> Web sitesinin temel işlevselliği için gereklidir. Örneğin, oturum açma bilgilerinizi hatırlamak veya alışveriş sepetinizi yönetmek. Bu çerezler olmadan web sitesi düzgün çalışmayabilir.</li>
              <li><strong>Performans Çerezleri:</strong> Web sitesinin nasıl kullanıldığı hakkında bilgi toplarız (örneğin, hangi sayfaların en çok ziyaret edildiği, hata mesajları). Bu çerezler, web sitesinin performansını ve kullanıcı deneyimini iyileştirmemize yardımcı olur.</li>
              <li><strong>İşlevsellik Çerezleri:</strong> Web sitesinin tercihlerinizi (örneğin, dil seçimi, bölge) hatırlamasını sağlar ve gelişmiş, daha kişisel özellikler sunar.</li>
              <li><strong>Hedefleme/Reklam Çerezleri:</strong> İlgi alanlarınıza daha uygun reklamlar sunmak için kullanılır. Ayrıca, bir reklamı kaç kez gördüğünüzü sınırlamak ve reklam kampanyalarının etkinliğini ölçmek için de kullanılırlar.</li>
            </ul>

            <h2>Üçüncü Taraf Çerezleri</h2>
            <p>
              Web sitemizi ziyaret ettiğinizde, cihazınıza üçüncü taraf hizmet sağlayıcılar tarafından da çerezler yerleştirilebilir. Örneğin, Google Analytics gibi analitik hizmetleri veya sosyal medya platformları kendi çerezlerini kullanabilir. Bu çerezlerin kullanımı, ilgili üçüncü tarafın gizlilik politikalarına tabidir.
            </p>

            <h2>Çerez Tercihlerinizi Yönetme</h2>
            <p>
              Çerezleri kontrol etme ve yönetme seçeneğiniz vardır. Çoğu web tarayıcısı, çerezleri kabul etme veya reddetme, çerezleri silme veya çerez gönderildiğinde sizi uyarma seçenekleri sunar. Ancak, çerezleri devre dışı bırakırsanız, web sitemizin bazı bölümleri düzgün çalışmayabilir veya bazı özelliklere erişemeyebilirsiniz.
            </p>
            <p>
              Tarayıcınızın ayarlarını değiştirerek çerez tercihlerinizi yönetebilirsiniz. Daha fazla bilgi için tarayıcınızın yardım menüsüne bakın.
            </p>

            <h2>Bu Politikadaki Değişiklikler</h2>
            <p>
              Bu Çerez Politikası'nı zaman zaman güncelleyebiliriz. Herhangi bir değişiklik durumunda, güncellenmiş politikayı web sitemizde yayınlayarak sizi bilgilendireceğiz. Değişiklikler yayınlandığı anda yürürlüğe girer.
            </p>

            <h2>Bize Ulaşın</h2>
            <p>
              Bu Çerez Politikası hakkında herhangi bir sorunuz varsa, lütfen bizimle iletişime geçin:
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

export default CookiePolicyPage;
```