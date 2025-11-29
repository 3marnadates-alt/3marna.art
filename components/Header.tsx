import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  onNavigate: (page: 'home' | 'cart') => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    onNavigate('home'); // Ensure we are on home page first
    setIsMenuOpen(false);
    
    // We need a slight timeout to allow the 'home' view to render if we were on 'cart'
    setTimeout(() => {
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
    }, 100);
  };

  return (
    <nav className="bg-brand-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
             {/* Logo Image */}
             <img 
               src="https://e.top4top.io/p_3618y7ys01.png" 
               alt="شعار تمور العمارنة" 
               className="w-10 h-10 object-contain"
             />
            <div>
              <h1 className="text-2xl font-bold tracking-wider text-gold-400">تمور العمارنة</h1>
              <p className="text-xs text-brand-200">تمرة تستاهل تدخل دارك</p>
            </div>
          </div>
          
          <div className="hidden md:flex space-x-reverse space-x-8 items-center">
            <a href="#hero" onClick={(e) => scrollToSection(e, 'hero')} className="text-brand-100 hover:text-gold-400 transition-colors px-3 py-2 text-lg font-medium cursor-pointer">الرئيسية</a>
            <a href="#products" onClick={(e) => scrollToSection(e, 'products')} className="text-brand-100 hover:text-gold-400 transition-colors px-3 py-2 text-lg font-medium cursor-pointer">منتجاتنا</a>
            <a href="#ai-chef" onClick={(e) => scrollToSection(e, 'ai-chef')} className="text-brand-100 hover:text-gold-400 transition-colors px-3 py-2 text-lg font-medium cursor-pointer">الشيف الذكي</a>
            <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="text-brand-100 hover:text-gold-400 transition-colors px-3 py-2 text-lg font-medium cursor-pointer">اتصل بنا</a>
            
            {/* Cart Button */}
            <button 
                onClick={() => onNavigate('cart')}
                className="relative p-2 text-brand-100 hover:text-gold-400 transition-colors"
                aria-label="Shopping Cart"
            >
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalItems > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-brand-900 transform translate-x-1/4 -translate-y-1/4 bg-gold-500 rounded-full">
                        {totalItems}
                    </span>
                )}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-4">
             {/* Mobile Cart Button */}
            <button 
                onClick={() => onNavigate('cart')}
                className="relative p-1 text-brand-100 hover:text-gold-400 transition-colors"
            >
                 <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalItems > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-brand-900 transform translate-x-1/4 -translate-y-1/4 bg-gold-500 rounded-full">
                        {totalItems}
                    </span>
                )}
            </button>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gold-400 focus:outline-none"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-brand-800 border-t border-brand-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#hero" onClick={(e) => scrollToSection(e, 'hero')} className="block text-brand-100 hover:text-white px-3 py-2 text-base font-medium cursor-pointer">الرئيسية</a>
            <a href="#products" onClick={(e) => scrollToSection(e, 'products')} className="block text-brand-100 hover:text-white px-3 py-2 text-base font-medium cursor-pointer">منتجاتنا</a>
            <a href="#ai-chef" onClick={(e) => scrollToSection(e, 'ai-chef')} className="block text-brand-100 hover:text-white px-3 py-2 text-base font-medium cursor-pointer">الشيف الذكي</a>
            <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="block text-brand-100 hover:text-white px-3 py-2 text-base font-medium cursor-pointer">اتصل بنا</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;