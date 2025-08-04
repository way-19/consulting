import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  X, 
  Mail, 
  Phone, 
  MessageSquare, 
  Send,
  Clock,
  MapPin,
  Globe,
  Headphones
} from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

const ContactModal: React.FC<ContactModalProps> = ({ 
  isOpen, 
  onClose, 
  userId 
}) => {
  const [activeTab, setActiveTab] = useState('contact');
  const [loading, setLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    priority: 'normal',
    contact_method: 'email'
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create a support ticket/message
      const { error } = await supabase
        .from('user_notifications')
        .insert({
          user_id: userId,
          title: `Destek Talebi: ${contactForm.subject}`,
          message: `Kullanıcı mesajı: ${contactForm.message}\n\nTercih edilen iletişim: ${contactForm.contact_method}\nÖncelik: ${contactForm.priority}`,
          type: 'support',
          priority: contactForm.priority
        });

      if (error) throw error;

      setMessageSent(true);
      setContactForm({
        subject: '',
        message: '',
        priority: 'normal',
        contact_method: 'email'
      });

      setTimeout(() => {
        setMessageSent(false);
        onClose();
      }, 3000);

    } catch (error) {
      console.error('Error sending support message:', error);
      alert('❌ Mesaj gönderilirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Headphones className="h-6 w-6 mr-3 text-blue-600" />
              Destek & İletişim
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {messageSent ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mesajınız Gönderildi!</h3>
              <p className="text-gray-600">
                Destek ekibimiz en kısa sürede size dönüş yapacak.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">İletişim Bilgileri</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">E-posta</p>
                        <p className="text-sm text-gray-600">support@consulting19.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Telefon</p>
                        <p className="text-sm text-gray-600">+1 (555) CONSULT</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Çalışma Saatleri</p>
                        <p className="text-sm text-gray-600">24/7 Destek</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Dil Desteği</p>
                        <p className="text-sm text-gray-600">TR, EN, AR, FR, DE</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Hızlı Yardım</h3>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                      <p className="font-medium text-gray-900">📚 Yardım Merkezi</p>
                      <p className="text-sm text-gray-600">Sık sorulan sorular ve rehberler</p>
                    </button>
                    
                    <button className="w-full text-left p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                      <p className="font-medium text-gray-900">💬 Canlı Sohbet</p>
                      <p className="text-sm text-gray-600">Anında destek alın</p>
                    </button>
                    
                    <button className="w-full text-left p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                      <p className="font-medium text-gray-900">📞 Telefon Desteği</p>
                      <p className="text-sm text-gray-600">Doğrudan konuşun</p>
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Destek Talebi Gönder</h3>
                
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Konu *
                    </label>
                    <input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Sorun veya talebinizi özetleyin"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Öncelik
                      </label>
                      <select
                        value={contactForm.priority}
                        onChange={(e) => setContactForm({...contactForm, priority: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="low">Düşük</option>
                        <option value="normal">Normal</option>
                        <option value="high">Yüksek</option>
                        <option value="urgent">Acil</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tercih Edilen İletişim
                      </label>
                      <select
                        value={contactForm.contact_method}
                        onChange={(e) => setContactForm({...contactForm, contact_method: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="email">E-posta</option>
                        <option value="phone">Telefon</option>
                        <option value="chat">Canlı Sohbet</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mesaj *
                    </label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      required
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Sorununuzu veya talebinizi detaylı olarak açıklayın..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !contactForm.subject || !contactForm.message}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    <span>{loading ? 'Gönderiliyor...' : 'Destek Talebi Gönder'}</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;