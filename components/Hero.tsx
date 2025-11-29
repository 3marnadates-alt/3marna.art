import React from 'react';

const Hero: React.FC = () => {
  
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Header height is 5rem (h-20) which is 80px. 
      // We add a bit of extra space (20px) so the section title isn't glued to the header.
      const headerOffset = 100; 
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div id="hero" className="relative bg-brand-900 overflow-hidden">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover opacity-30"
          src="https://a.top4top.io/p_3619fba5l1.png"
          alt="خلفية تمور"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/60 to-transparent"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
          <span className="block text-gold-400 mb-2">تمور العمارنة</span>
          <span className="block text-2xl sm:text-3xl font-medium text-brand-100 mt-4">أصالة الطعم.. وعراقة الماضي</span>
        </h1>
        <p className="mt-6 text-xl text-brand-200 max-w-3xl mx-auto leading-relaxed">
          ننتقي لكم أجود أنواع التمور العربية الفاخرة، معبأة بعناية وحب لتصل إليكم طازجة. 
          <br/>
          <span className="text-gold-400 font-bold text-2xl mt-4 block">"تمرة تستاهل تدخل دارك"</span>
        </p>
        <div className="mt-10 flex gap-4 justify-center">
          <a
            href="#products"
            onClick={(e) => scrollToSection(e, 'products')}
            className="px-8 py-3 border border-transparent text-base font-medium rounded-full text-brand-900 bg-gold-500 hover:bg-gold-400 md:py-4 md:text-lg md:px-10 transition-all shadow-lg hover:shadow-gold-500/50 cursor-pointer"
          >
            تصفح منتجاتنا
          </a>
          <a
            href="#ai-chef"
            onClick={(e) => scrollToSection(e, 'ai-chef')}
            className="px-8 py-3 border border-gold-500 text-base font-medium rounded-full text-gold-500 hover:bg-brand-800 md:py-4 md:text-lg md:px-10 transition-all cursor-pointer"
          >
            ابتكر وصفتك
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;