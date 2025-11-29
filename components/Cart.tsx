import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

interface CartProps {
  onContinueShopping: () => void;
  onCheckoutSuccess: (orderNumber: string) => void;
}

const Cart: React.FC<CartProps> = ({ onContinueShopping, onCheckoutSuccess }) => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { settings } = useStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'القاهرة'
  });

  // Calculate dynamic delivery fee
  const getDeliveryFee = () => {
    const rates = settings.deliveryRates;
    switch(formData.city) {
      case 'القاهرة': return rates.cairo;
      case 'الجيزة': return rates.giza;
      case '6 أكتوبر': return rates.october;
      case 'الهرم': return rates.haram;
      case 'مدينة الرحاب': return rates.rehab;
      case 'مدينتي': return rates.madinaty;
      case 'الإسماعيلية': return rates.ismailia;
      case 'الإسكندرية': return rates.alex;
      case 'طنطا': return rates.tanta;
      case 'المنصورة': return rates.mansoura;
      default: return rates.others;
    }
  };

  const deliveryFee = getDeliveryFee();
  
  // Calculate Discount
  const discountAmount = settings.isDiscountActive 
    ? (totalPrice * settings.discountPercentage / 100) 
    : 0;

  const finalTotal = totalPrice + deliveryFee - discountAmount;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Generate Order Number
    const orderNumber = (Math.floor(Math.random() * 90000) + 10000).toString(); // Generates 5 digit number like 12345

    // Construct Order Details String nicely formatted
    const orderItemsString = cartItems.map(item => 
      `- ${item.name} | الكمية: ${item.quantity} | السعر: ${item.price}`
    ).join('\n');

    // Use FormData for better compatibility with Formspree
    // Keys must be in English to ensure reliable delivery
    const submissionData = new FormData();
    submissionData.append("OrderNumber", `#${orderNumber}`);
    submissionData.append("CustomerName", formData.name);
    submissionData.append("Phone", formData.phone);
    submissionData.append("City", formData.city);
    submissionData.append("Address", formData.address);
    submissionData.append("Products", orderItemsString);
    submissionData.append("Subtotal", `${totalPrice} ج.م`);
    submissionData.append("DeliveryFee", `${deliveryFee} ج.م`);
    submissionData.append("Discount", `${discountAmount} ج.م`);
    submissionData.append("TotalAmount", `${finalTotal} ج.م`);
    submissionData.append("_subject", `طلب جديد #${orderNumber}: ${formData.name} - تمور العمارنة`);

    try {
      const response = await fetch("https://formspree.io/f/xkglkljq", {
        method: "POST",
        body: submissionData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        clearCart();
        onCheckoutSuccess(orderNumber);
      } else {
        const data = await response.json();
        console.error("Formspree Error:", data);
        alert("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.");
      }
    } catch (error) {
      console.error("Order submission error:", error);
      alert("حدث خطأ أثناء إرسال الطلب. تأكد من اتصالك بالإنترنت.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] bg-brand-50 pt-24 pb-12 flex flex-col items-center justify-center text-center px-4 animate-fadeIn">
        <div className="bg-white p-8 rounded-full shadow-lg mb-6">
          <svg className="w-16 h-16 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-brand-800 mb-2">سلة التسوق فارغة</h2>
        <p className="text-brand-600 mb-8">لم تقم بإضافة أي منتجات للسلة بعد.</p>
        <button 
          onClick={onContinueShopping}
          className="bg-gold-500 text-brand-900 px-8 py-3 rounded-full font-bold hover:bg-gold-400 transition-colors shadow-lg hover:shadow-gold-500/30"
        >
          تصفح المنتجات
        </button>
      </div>
    );
  }

  return (
    <div className="bg-brand-50 min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-brand-900 mb-8 border-r-4 border-gold-500 pr-4">سلة التسوق</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-brand-100 overflow-hidden">
            <ul className="divide-y divide-brand-100">
              {cartItems.map((item) => (
                <li key={item.id} className="p-6 flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-24 h-24 rounded-lg overflow-hidden bg-brand-50 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-brand-900">{item.name}</h3>
                        <p className="text-sm text-brand-500">{item.price}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-600 p-1"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                       <div className="flex items-center border border-brand-200 rounded-lg">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 text-brand-600 hover:bg-brand-50 disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-3 py-1 font-medium text-brand-900 min-w-[2rem] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 text-brand-600 hover:bg-brand-50"
                          >
                            +
                          </button>
                       </div>
                       <p className="font-bold text-brand-800">
                         {(parseInt(item.price.match(/(\d+)/)?.[0] || '0') * item.quantity).toLocaleString()} ج.م
                       </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Order Summary & Checkout Form */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-brand-100 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-brand-900 mb-6">ملخص الطلب</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-brand-600">
                  <span>المجموع الفرعي</span>
                  <span>{totalPrice.toLocaleString()} ج.م</span>
                </div>
                
                {settings.isDiscountActive && (
                  <div className="flex justify-between text-green-600">
                    <span>خصم ({settings.discountPercentage}%)</span>
                    <span>- {discountAmount.toLocaleString()} ج.م</span>
                  </div>
                )}

                <div className="flex justify-between text-brand-600">
                  <span>التوصيل ({formData.city})</span>
                  <span>{deliveryFee.toLocaleString()} ج.م</span>
                </div>
                
                <div className="border-t border-brand-100 pt-3 flex justify-between font-bold text-lg text-brand-900">
                  <span>الإجمالي</span>
                  <span className="text-gold-600">{finalTotal.toLocaleString()} ج.م</span>
                </div>
              </div>

              {!isCheckingOut ? (
                <button 
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full bg-brand-800 text-white py-3 rounded-xl font-bold hover:bg-brand-900 transition-colors shadow-lg hover:shadow-brand-800/30 flex justify-center items-center gap-2"
                >
                  المتابعة للدفع
                </button>
              ) : (
                <form onSubmit={handleSubmitOrder} className="animate-fadeIn">
                  <h4 className="font-bold text-brand-800 mb-4 border-t border-brand-100 pt-4">بيانات التوصيل</h4>
                  
                  <div className="space-y-3 mb-4">
                    <div>
                        <label className="block text-xs font-medium text-brand-600 mb-1">الاسم الكامل</label>
                        <input 
                            required
                            name="name"
                            type="text" 
                            className="w-full bg-brand-50 border border-brand-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-brand-600 mb-1">رقم الهاتف</label>
                        <input 
                            required
                            name="phone"
                            type="tel" 
                            className="w-full bg-brand-50 border border-brand-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-brand-600 mb-1">المدينة</label>
                        <select 
                             name="city"
                             className="w-full bg-brand-50 border border-brand-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold-500"
                             value={formData.city}
                             onChange={(e) => setFormData({...formData, city: e.target.value})}
                        >
                            <option value="القاهرة">القاهرة</option>
                            <option value="الجيزة">الجيزة</option>
                            <option value="6 أكتوبر">6 أكتوبر</option>
                            <option value="الهرم">الهرم</option>
                            <option value="مدينة الرحاب">مدينة الرحاب</option>
                            <option value="مدينتي">مدينتي</option>
                            <option value="الإسماعيلية">الإسماعيلية</option>
                            <option value="الإسكندرية">الإسكندرية</option>
                            <option value="طنطا">طنطا</option>
                            <option value="المنصورة">المنصورة</option>
                            <option value="أخرى">محافظات أخرى</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-brand-600 mb-1">العنوان بالتفصيل</label>
                        <textarea 
                            required
                            name="address"
                            rows={2}
                            className="w-full bg-brand-50 border border-brand-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                        />
                    </div>
                  </div>

                  <div className="bg-gold-50/50 p-3 rounded-lg mb-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" checked readOnly className="text-gold-500 focus:ring-gold-500" />
                          <span className="text-sm font-medium text-brand-800">الدفع عند الاستلام</span>
                      </label>
                  </div>

                  <div className="flex gap-2">
                    <button 
                        type="button"
                        onClick={() => setIsCheckingOut(false)}
                        className="flex-1 bg-white border border-brand-200 text-brand-600 py-3 rounded-xl font-bold hover:bg-brand-50 transition-colors"
                        disabled={isSubmitting}
                    >
                        رجوع
                    </button>
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-[2] bg-gold-500 text-brand-900 py-3 rounded-xl font-bold hover:bg-gold-400 transition-colors shadow-lg hover:shadow-gold-500/30 flex justify-center"
                    >
                        {isSubmitting ? (
                          <svg className="animate-spin h-5 w-5 text-brand-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : 'تأكيد الطلب'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;