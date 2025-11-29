import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

const Products: React.FC = () => {
  const { products } = useStore();
  const [addedProduct, setAddedProduct] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    // Add to global cart context
    addToCart(product);

    // Set active product for button feedback
    setAddedProduct(product.id);
    
    // Set toast message
    setToastMessage(`تم إضافة "${product.name}" إلى السلة`);

    // Reset button state after 1.5 seconds
    setTimeout(() => {
      setAddedProduct(null);
    }, 1500);

    // Clear toast message after 3 seconds
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div id="products" className="bg-brand-50 py-20 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-brand-900/95 backdrop-blur text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-3 transition-all duration-300 animate-bounce">
          <svg className="w-6 h-6 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium text-sm md:text-base">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-brand-900 sm:text-4xl">
            منتجاتنا المميزة
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-brand-600">
            تشكيلة مختارة من أجود محاصيل القصيم والمدينة، نضمن لك الجودة والطعم الأصيل.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-brand-100 flex flex-col">
              {/* Image Container with Animation */}
              <div className="aspect-w-4 aspect-h-3 bg-brand-200 overflow-hidden relative h-64">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Badge (Optional) */}
                {product.category === 'luxury' && (
                  <span className="absolute top-4 right-4 bg-gold-500 text-brand-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    فاخر
                  </span>
                )}
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                   <h3 className="text-xl font-bold text-brand-900">
                      <a href="#">
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </a>
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold-400/20 text-gold-700">
                      {product.price}
                    </span>
                </div>
                <p className="mt-2 text-sm text-brand-600 line-clamp-3 mb-4 flex-grow">
                  {product.description}
                </p>
                <div className="mt-auto relative z-10">
                    <button 
                        onClick={() => handleAddToCart(product)}
                        className={`w-full py-2.5 px-4 rounded-lg transition-all duration-300 font-semibold shadow-sm flex items-center justify-center gap-2 cursor-pointer
                          ${addedProduct === product.id 
                              ? 'bg-green-600 text-white hover:bg-green-700' 
                              : 'bg-brand-800 text-white group-hover:bg-gold-500 group-hover:text-brand-900'
                          }`}
                    >
                        {addedProduct === product.id ? (
                            <>
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              تمت الإضافة
                            </>
                        ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              أضف للسلة
                            </>
                        )}
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;