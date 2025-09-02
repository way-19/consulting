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
        <meta name="description" content="Consulting19'un çerez kullanım politikası. Web sitemizde kullandığımız çerezler ve amaçları hakkında bilgi edinin." />
      </Helmet>

      <Navbar />

      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Çerez Politikası</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Web sitemizde kullandığımız çerezler ve amaçları hakkında bilgi.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card>
          <Card.Body className="prose prose-lg max-w-none text-gray-700">
            <h2>Çerez Nedir?</h2>
            <p>
              Çerezler, web sitelerinin kullanıcıların cihazlarında (bilgisayar, tablet, telefon) sakladığı küçük metin dosyalarıdır. Bu dosyalar, web sitesinin daha iyi çalışmasını sağlar ve kullanıcı deneyimini iyileştirir. Çerezler, kişisel olarak tanımlanabilir bilgiler içermez ve zararsızdır.
            </p>

            <h2>Çerezleri Neden Kullanıyoruz?</h2>
            <p>
              Consulting19 olarak çerezleri aşağıdaki amaçlarla kullanırız:
            </p>
            <ul>
              <li><strong>Temel İşlevsellik:</strong> Web sitemizin düzgün çalışması için gerekli olan çerezler</li>
              <li><strong>Kullanıcı Deneyimi:</strong> Tercihlerinizi hatırlayarak daha kişiselleştirilmiş bir deneyim sunmak</li>
              <li><strong>Analitik:</strong> Web sitesi kullanımını analiz ederek hizmetlerimizi iyileştirmek</li>
              <li><strong>Güvenlik:</strong> Hesabınızın güvenliğini sağlamak ve dolandırıcılığı önlemek</li>
              <li><strong>Pazarlama:</strong> Size daha ilgili içerik ve reklamlar göstermek</li>
            </ul>

            <h2>Kullandığımız Çerez Türleri</h2>
            
            <h3>1. Zorunlu Çerezler</h3>
            <p>
              Bu çerezler web sitemizin temel işlevlerini yerine getirmesi için gereklidir ve devre dışı bırakılamazlar:
            </p>
            <ul>
              <li><strong>Oturum Çerezleri:</strong> Giriş durumunuzu ve oturum bilgilerinizi korur</li>
              <li><strong>Güvenlik Çerezleri:</strong> Hesabınızın güvenliğini sağlar ve saldırıları önler</li>
              <li><strong>Yük Dengeleme Çerezleri:</strong> Trafiği sunucular arasında dengeler</li>
            </ul>

            <h3>2. İşlevsel Çerezler</h3>
            <p>
              Bu çerezler web sitesinin gelişmiş özelliklerini ve kişiselleştirmesini sağlar:
            </p>
            <ul>
              <li><strong>Dil Tercihi:</strong> Seçtiğiniz dili hatırlar</li>
              <li><strong>Tema Tercihi:</strong> Açık/koyu tema seçiminizi saklar</li>
              <li><strong>Form Verileri:</strong> Doldurduğunuz formları geçici olarak saklar</li>
              <li><strong>Navigasyon Tercihleri:</strong> Menü ve sayfa tercihlerinizi hatırlar</li>
            </ul>

            <h3>3. Analitik Çerezler</h3>
            <p>
              Web sitesi performansını ve kullanımını anlamamıza yardımcı olur:
            </p>
            <ul>
              <li><strong>Google Analytics:</strong> Ziyaretçi istatistikleri ve davranış analizi</li>
              <li><strong>Sayfa Görüntüleme:</strong> En popüler sayfaları ve içerikleri belirler</li>
              <li><strong>Kullanıcı Yolculuğu:</strong> Sitede nasıl gezindiğinizi analiz eder</li>
              <li><strong>Performans Metrikleri:</strong> Sayfa yükleme süreleri ve hata oranları</li>
            </ul>

            <h3>4. Pazarlama Çerezleri</h3>
            <p>
              Size daha ilgili reklamlar ve içerikler göstermek için kullanılır:
            </p>
            <ul>
              <li><strong>Retargeting:</strong> Ziyaret ettiğiniz sayfalar temelinde ilgili reklamlar</li>
              <li><strong>Sosyal Medya:</strong> Sosyal medya platformlarıyla entegrasyon</li>
              <li><strong>E-posta Pazarlama:</strong> E-posta kampanyalarının etkinliğini ölçer</li>
              <li><strong>Dönüşüm Takibi:</strong> Pazarlama kampanyalarının başarısını ölçer</li>
            </ul>

            <h2>Üçüncü Taraf Çerezleri</h2>
            <p>
              Web sitemizde aşağıdaki üçüncü taraf hizmetlerinin çerezleri de kullanılabilir:
            </p>
            <ul>
              <li><strong>Google Analytics:</strong> Web sitesi analitikleri için</li>
              <li><strong>Google Ads:</strong> Reklam kampanyaları için</li>
              <li><strong>Facebook Pixel:</strong> Sosyal medya reklamları için</li>
              <li><strong>LinkedIn Insight:</strong> Profesyonel ağ reklamları için</li>
              <li><strong>Hotjar:</strong> Kullanıcı deneyimi analizi için</li>
              <li><strong>Intercom:</strong> Müşteri destek sistemi için</li>
            </ul>

            <h2>Çerez Yönetimi</h2>
            <p>
              Çerez tercihlerinizi aşağıdaki yollarla yönetebilirsiniz:
            </p>

            <h3>Tarayıcı Ayarları</h3>
            <p>
              Çoğu web tarayıcısı çerezleri otomatik olarak kabul eder, ancak tarayıcı ayarlarınızdan:
            </p>
            <ul>
              <li>Çerezleri tamamen devre dışı bırakabilirsiniz</li>
              <li>Çerezler kaydedilmeden önce uyarı alabilirsiniz</li>
              <li>Mevcut çerezleri silebilirsiniz</li>
              <li>Belirli web sitelerinden çerezleri engelleyebilirsiniz</li>
            </ul>

            <h3>Çerez Tercih Merkezi</h3>
            <p>
              Web sitemizin alt kısmında bulunan "Çerez Ayarları" bağlantısından çerez tercihlerinizi yönetebilirsiniz. Bu merkez üzerinden:
            </p>
            <ul>
              <li>Çerez kategorilerini ayrı ayrı açıp kapatabilirsiniz</li>
              <li>Hangi çerezlerin aktif olduğunu görebilirsiniz</li>
              <li>Tercihlerinizi istediğiniz zaman değiştirebilirsiniz</li>
            </ul>

            <h2>Çerez Süresi</h2>
            <p>
              Çerezlerimiz farklı sürelerde saklanır:
            </p>
            <ul>
              <li><strong>Oturum Çerezleri:</strong> Tarayıcıyı kapattığınızda silinir</li>
              <li><strong>Kalıcı Çerezler:</strong> Belirli bir süre (genellikle 1-2 yıl) saklanır</li>
              <li><strong>Güvenlik Çerezleri:</strong> Oturum süresince aktif kalır</li>
              <li><strong>Analitik Çerezler:</strong> 2 yıla kadar saklanabilir</li>
            </ul>

            <h2>Çerezleri Devre Dışı Bırakmanın Etkileri</h2>
            <p>
              Çerezleri devre dışı bırakırsanız:
            </p>
            <ul>
              <li>Web sitesinin bazı özellikleri düzgün çalışmayabilir</li>
              <li>Kişiselleştirilmiş deneyim alamayabilirsiniz</li>
              <li>Her ziyarette tekrar giriş yapmanız gerekebilir</li>
              <li>Tercihleriniz hatırlanmayabilir</li>
              <li>Bazı formlar ve özellikler kullanılamayabilir</li>
            </ul>

            <h2>Mobil Uygulamalar</h2>
            <p>
              Mobil uygulamalarımızda çerezler yerine benzer teknolojiler kullanılabilir:
            </p>
            <ul>
              <li><strong>Uygulama Verileri:</strong> Tercihlerinizi ve ayarlarınızı saklar</li>
              <li><strong>Cihaz Tanımlayıcıları:</strong> Güvenlik ve analitik amaçlarla</li>
              <li><strong>Push Bildirimleri:</strong> Size önemli güncellemeler göndermek için</li>
            </ul>

            <h2>Uluslararası Transferler</h2>
            <p>
              Çerezler aracılığıyla toplanan veriler, hizmet sağlayıcılarımızın bulunduğu ülkelere aktarılabilir. Bu transferler, uygun güvenlik önlemleriyle gerçekleştirilir.
            </p>

            <h2>Güncellemeler</h2>
            <p>
              Bu Çerez Politikası düzenli olarak gözden geçirilir ve gerektiğinde güncellenir. Önemli değişiklikler web sitemizde duyurulur.
            </p>

            <h2>İletişim</h2>
            <p>
              Çerez kullanımımız hakkında sorularınız varsa:
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

export default CookiePolicyPage;