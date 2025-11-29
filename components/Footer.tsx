import React, { useState } from 'react';

interface FooterProps {
  isPrivacyOpen: boolean;
  setIsPrivacyOpen: (isOpen: boolean) => void;
  onOpenAdmin?: () => void;
}

const Footer: React.FC<FooterProps> = ({ isPrivacyOpen, setIsPrivacyOpen, onOpenAdmin }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  
  const openPrivacy = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPrivacyOpen(true);
  };

  const openContact = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsContactOpen(true);
    setFormStatus('idle');
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement> | null, id: string) => {
    if (e) e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xkglkljq", {
        method: "POST",
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setFormStatus('success');
        form.reset();
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      setFormStatus('error');
    }
  };

  const handleSuccessOk = () => {
    setIsContactOpen(false);
    setFormStatus('idle');
    // Redirect/Scroll to Home (Hero section)
    scrollToSection(null, 'hero');
  };

  return (
    <footer id="contact" className="bg-brand-100 text-brand-900 pt-16 pb-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand & Social */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-3xl font-bold text-brand-800 mb-4">تمور العمارنة</h2>
            <p className="text-brand-700 max-w-sm leading-relaxed mb-6">
              نحن لا نبيع مجرد تمور، بل نقدم لكم تجربة ضيافة عربية أصيلة. 
              نهتم بأدق التفاصيل من النخلة حتى مائدتكم.
            </p>
            <div className="flex gap-4">
              {/* Facebook */}
              <a 
                href="https://www.facebook.com/3marnaDates/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-brand-200 rounded-full flex items-center justify-center text-brand-800 hover:bg-gold-500 hover:text-white transition-colors cursor-pointer"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>

              {/* TikTok */}
              <a 
                href="https://www.tiktok.com/@user2610549486084?_r=1&_t=ZS-91mnettNEMm" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-brand-200 rounded-full flex items-center justify-center text-brand-800 hover:bg-gold-500 hover:text-white transition-colors cursor-pointer"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a 
                href="https://www.youtube.com/@3marnaDate" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-brand-200 rounded-full flex items-center justify-center text-brand-800 hover:bg-gold-500 hover:text-white transition-colors cursor-pointer"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M21.9 5.32a2.78 2.78 0 0 0-1.95-1.96C18.22 3 12 3 12 3s-6.22 0-7.95.36a2.78 2.78 0 0 0-1.95 1.96C1.75 7.08 1.75 12 1.75 12s0 4.92.35 6.68a2.78 2.78 0 0 0 1.95 1.96c1.73.36 7.95.36 7.95.36s6.22 0 7.95-.36a2.78 2.78 0 0 0 1.95-1.96C22.25 16.92 22.25 12 22.25 12s0-4.92-.35-6.68zM9.93 15.62v-7.24l6.33 3.62-6.33 3.62z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-brand-900 font-bold text-lg mb-6">روابط سريعة</h3>
            <ul className="space-y-3">
              <li><a href="#hero" onClick={(e) => scrollToSection(e, 'hero')} className="text-brand-700 hover:text-gold-600 transition-colors">الرئيسية</a></li>
              <li><a href="#products" onClick={(e) => scrollToSection(e, 'products')} className="text-brand-700 hover:text-gold-600 transition-colors">منتجاتنا</a></li>
              <li><a href="#ai-chef" onClick={(e) => scrollToSection(e, 'ai-chef')} className="text-brand-700 hover:text-gold-600 transition-colors">الشيف الذكي</a></li>
              <li><a href="#" onClick={openPrivacy} className="text-brand-700 hover:text-gold-600 transition-colors">سياسة الخصوصية</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-brand-900 font-bold text-lg mb-6">تواصل معنا</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gold-600 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-brand-700">المقطم - الهضبة الوسطى - القاهرة</span>
              </li>
              
              <li className="flex items-center gap-3">
                 <svg className="w-5 h-5 text-gold-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.894-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                 </svg>
                 <a href="https://wa.me/201001933502" target="_blank" rel="noopener noreferrer" className="text-brand-700 hover:text-gold-600 transition-colors">
                    عبر واتس آب
                 </a>
              </li>

              <li className="flex items-center gap-3">
                 <svg className="w-5 h-5 text-gold-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <button onClick={openContact} className="text-brand-700 hover:text-gold-600 transition-colors text-right">
                  عبر إرسال رسالة
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="border-t border-brand-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-brand-600 text-sm">
            © {new Date().getFullYear()} تمور العمارنة. جميع الحقوق محفوظة.
          </p>
          
          <div className="text-sm text-brand-600 flex flex-col md:flex-row items-center gap-2">
            <span>Development by:</span>
            <a href="https://www.hamzahilal.art/" target="_blank" rel="noopener noreferrer" className="font-bold text-gold-600 hover:text-gold-700 transition-colors">
              HAMZA Hilal
            </a>
          </div>

          <button 
            onClick={onOpenAdmin}
            className="text-brand-400 hover:text-brand-600 text-xs transition-colors"
          >
            الدخول كمسؤول
          </button>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {isPrivacyOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-brand-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-brand-900">سياسة الخصوصية</h2>
                <button 
                  onClick={() => setIsPrivacyOpen(false)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4 text-brand-700 leading-relaxed">
                 <p>مرحباً بكم في "تمور العمارنة". نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية.</p>
                 
                 <h3 className="font-bold text-brand-900 text-lg mt-4">1. المعلومات التي نجمعها</h3>
                 <p>قد نجمع معلومات مثل الاسم، رقم الهاتف، العنوان، والبريد الإلكتروني عند التواصل معنا أو إتمام طلب شراء، وذلك لغرض تحسين الخدمة وتوصيل المنتجات.</p>
                 
                 <h3 className="font-bold text-brand-900 text-lg mt-4">2. ملفات تعريف الارتباط (Cookies)</h3>
                 <p>يستخدم موقعنا ملفات تعريف الارتباط لتحسين تجربة المستخدم، تحليل الزيارات، وتذكر تفضيلاتك.</p>
                 
                 <h3 className="font-bold text-brand-900 text-lg mt-4">3. مشاركة البيانات</h3>
                 <p>نحن لا نبيع أو نؤجر بياناتك الشخصية لأطراف ثالثة. قد نشارك المعلومات فقط مع شركاء التوصيل لضمان وصول طلبك.</p>
                 
                 <h3 className="font-bold text-brand-900 text-lg mt-4">4. الأمان</h3>
                 <p>نتخذ كافة التدابير الأمنية المناسبة لحماية بياناتك من الوصول غير المصرح به.</p>

                 <p className="mt-6 text-sm text-gray-500">آخر تحديث: {new Date().toLocaleDateString('ar-EG')}</p>
              </div>
              
              <div className="mt-8 text-center">
                <button 
                  onClick={() => setIsPrivacyOpen(false)}
                  className="bg-brand-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Form Modal */}
      {isContactOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-brand-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full relative overflow-hidden">
             
             {formStatus === 'success' ? (
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-brand-900 mb-2">شكراً لتواصلكم!</h3>
                    <p className="text-brand-600 mb-6">شكراً على تواصلكم مع تمور العمارنة.</p>
                    <button 
                        onClick={handleSuccessOk}
                        className="bg-gold-500 text-brand-900 px-8 py-2 rounded-lg font-bold hover:bg-gold-400 transition-colors"
                    >
                        OK
                    </button>
                </div>
             ) : (
                <div className="p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-brand-900">تواصل معنا</h2>
                        <button 
                            onClick={() => setIsContactOpen(false)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleContactSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-brand-700 mb-1">الاسم</label>
                            <input 
                                required
                                name="name"
                                type="text"
                                className="w-full border border-brand-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none bg-white text-black"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-700 mb-1">البريد الإلكتروني</label>
                            <input 
                                required
                                name="email"
                                type="email"
                                className="w-full border border-brand-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none bg-white text-black"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-700 mb-1">رقم الهاتف</label>
                            <input 
                                required
                                name="phone"
                                type="tel"
                                className="w-full border border-brand-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none bg-white text-black"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-700 mb-1">الرسالة</label>
                            <textarea 
                                required
                                name="message"
                                rows={4}
                                className="w-full border border-brand-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none bg-white text-black"
                            ></textarea>
                        </div>
                        
                        {formStatus === 'error' && (
                            <div className="text-red-500 text-sm text-center">حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.</div>
                        )}

                        <button 
                            type="submit"
                            disabled={formStatus === 'submitting'}
                            className="w-full bg-brand-800 text-white py-3 rounded-lg font-bold hover:bg-brand-900 transition-colors disabled:opacity-70 flex justify-center"
                        >
                            {formStatus === 'submitting' ? 'جاري الإرسال...' : 'إرسال'}
                        </button>
                    </form>
                </div>
             )}
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;