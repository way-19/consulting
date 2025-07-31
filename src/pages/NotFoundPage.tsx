import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  language: 'en' | 'tr';
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ language }) => {
  const content = {
    en: {
      title: '404 - Page Not Found',
      subtitle: 'The page you are looking for does not exist.',
      backHome: 'Back to Home',
      backPrevious: 'Go Back'
    },
    tr: {
      title: '404 - Sayfa Bulunamadı',
      subtitle: 'Aradığınız sayfa mevcut değil.',
      backHome: 'Ana Sayfaya Dön',
      backPrevious: 'Geri Git'
    }
  };

  const t = content[language];

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-9xl font-bold text-purple-600 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.title}</h1>
        <p className="text-xl text-gray-600 mb-8">{t.subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
          >
            <Home className="mr-2 h-5 w-5" />
            {t.backHome}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center bg-white text-purple-600 border-2 border-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-300"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            {t.backPrevious}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;