import React from 'react';

interface OrderSuccessProps {
  onReturnHome: () => void;
  orderNumber: string;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ onReturnHome, orderNumber }) => {
  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="bg-brand-900 h-32 relative flex items-center justify-center">
            <div className="absolute inset-0 opacity-10">
                 <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="pattern_success" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(45)">
                            <line x1="0" y1="0" x2="0" y2="40" stroke="#FFFFFF" strokeWidth="2" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#pattern_success)" />
                </svg>
            </div>
            <div className="w-20 h-20 bg-gold-500 rounded-full flex items-center justify-center shadow-lg transform translate-y-10 border-4 border-white z-10">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
            </div>
        </div>
        
        <div className="pt-16 pb-10 px-8 text-center">
          <h2 className="text-3xl font-extrabold text-brand-900 mb-2">تم استلام طلبك بنجاح!</h2>
          <p className="text-brand-600 mb-8">
            شكراً لثقتك بتمور العمارنة. <br/>
            رقم الطلب: <span className="font-mono font-bold text-brand-800">#{orderNumber}</span>
          </p>

          <div className="bg-brand-50 rounded-xl p-4 mb-8 text-right">
              <h3 className="text-sm font-bold text-brand-800 mb-2">الخطوات القادمة:</h3>
              <ul className="text-sm text-brand-600 space-y-2 list-disc list-inside">
                  <li>سيتم التواصل معك لتأكيد العنوان وموعد التوصيل.</li>
                  <li>تجهيز الطلب يستغرق عادة 24 ساعة.</li>
                  <li>الدفع سيكون عند الاستلام.</li>
              </ul>
          </div>

          <button 
            onClick={onReturnHome}
            className="w-full bg-brand-800 text-white py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;