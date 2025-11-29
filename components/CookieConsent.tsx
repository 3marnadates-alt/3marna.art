import React, { useState, useEffect } from 'react';

interface CookieConsentProps {
  onOpenPrivacy: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onOpenPrivacy }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-brand-900 text-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-[60] border-t border-brand-700 animate-slideUp">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-brand-100 text-center sm:text-right flex-1">
          <p>
            نستخدم ملفات تعريف الارتباط (Cookies) لنمنحك أفضل تجربة مستخدم ممكنة على موقعنا. استمرارك في التصفح يعني موافقتك على ذلك.
            <button 
              onClick={onOpenPrivacy} 
              className="underline hover:text-gold-400 mr-1 transition-colors font-medium bg-transparent border-none cursor-pointer p-0"
            >
              اقرأ سياسة الخصوصية
            </button>
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button 
            onClick={handleAccept}
            className="bg-gold-500 text-brand-900 hover:bg-gold-400 px-6 py-2 rounded-full text-sm font-bold transition-colors shadow-lg hover:shadow-gold-500/20"
          >
            موافق
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;