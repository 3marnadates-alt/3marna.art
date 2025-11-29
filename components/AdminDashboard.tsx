import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { products, settings, addProduct, updateProduct, deleteProduct, updateSettings } = useStore();
  const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products');
  
  // Product Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    name: '', description: '', price: '', image: '', category: 'luxury'
  });

  // Delete Confirmation State
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  // Settings State
  const [localSettings, setLocalSettings] = useState(settings);

  const resetForm = () => {
    setCurrentProduct({ name: '', description: '', price: '', image: '', category: 'luxury' });
    setIsEditing(false);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && currentProduct.id) {
      updateProduct(currentProduct as Product);
    } else {
      addProduct(currentProduct as Omit<Product, 'id'>);
    }
    resetForm();
    // Scroll to table to see result
    const tableElement = document.getElementById('products-table');
    if (tableElement) {
        tableElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEditClick = (product: Product) => {
    // Create a copy of the product to avoid direct mutation issues
    setCurrentProduct({ ...product });
    setIsEditing(true);
    // Switch to products tab if not active
    setActiveTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id: number) => {
    setProductToDelete(id);
  };

  const confirmDelete = () => {
    if (productToDelete !== null) {
        deleteProduct(productToDelete);
        setProductToDelete(null);
        // If we were editing the deleted product, reset form
        if (isEditing && currentProduct.id === productToDelete) {
            resetForm();
        }
    }
  };

  const cancelDelete = () => {
    setProductToDelete(null);
  }

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(localSettings);
    alert('تم حفظ الإعدادات بنجاح');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Admin Header */}
      <div className="bg-brand-900 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gold-400">لوحة التحكم</h1>
            <span className="text-xs bg-brand-800 px-2 py-1 rounded text-brand-200">الأدمن</span>
          </div>
          <button onClick={onLogout} className="text-sm hover:text-red-300 transition-colors flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            تسجيل خروج
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tabs */}
        <div className="flex space-x-reverse space-x-4 mb-8 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('products')}
            className={`pb-4 px-4 font-medium transition-colors ${activeTab === 'products' ? 'text-brand-900 border-b-2 border-brand-900' : 'text-gray-500 hover:text-brand-700'}`}
          >
            إدارة المنتجات
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`pb-4 px-4 font-medium transition-colors ${activeTab === 'settings' ? 'text-brand-900 border-b-2 border-brand-900' : 'text-gray-500 hover:text-brand-700'}`}
          >
            إعدادات المتجر
          </button>
        </div>

        {/* Products View */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-1">
              <div className={`bg-white p-6 rounded-xl shadow-sm border sticky top-24 transition-all duration-300 ${isEditing ? 'border-gold-500 ring-2 ring-gold-500/20 shadow-lg scale-[1.02]' : 'border-gray-200'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-brand-900">
                    {isEditing ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
                    </h3>
                    {isEditing && (
                        <span className="text-xs bg-gold-100 text-gold-700 px-2 py-1 rounded-full font-bold animate-pulse">وضع التعديل</span>
                    )}
                </div>
                
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">اسم المنتج</label>
                    <input required type="text" value={currentProduct.name} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none bg-white text-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">السعر (مثال: 85 ج.م / كجم)</label>
                    <input required type="text" value={currentProduct.price} onChange={e => setCurrentProduct({...currentProduct, price: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none bg-white text-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">رابط الصورة</label>
                    <input required type="url" value={currentProduct.image} onChange={e => setCurrentProduct({...currentProduct, image: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none bg-white text-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">الفئة</label>
                    <select value={currentProduct.category} onChange={e => setCurrentProduct({...currentProduct, category: e.target.value as any})} className="w-full border rounded-lg px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none bg-white text-black">
                      <option value="luxury">فاخر</option>
                      <option value="daily">يومي</option>
                      <option value="stuffed">محشي</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">الوصف</label>
                    <textarea required rows={3} value={currentProduct.description} onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none bg-white text-black"></textarea>
                  </div>
                  <div className="flex gap-2 pt-2">
                    {isEditing && (
                      <button type="button" onClick={resetForm} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">إلغاء</button>
                    )}
                    <button type="submit" className="flex-1 bg-brand-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-brand-900 transition-colors shadow-sm">
                      {isEditing ? 'حفظ التعديلات' : 'إضافة المنتج'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* List */}
            <div className="lg:col-span-2">
              <div id="products-table" className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المنتج</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">السعر</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">تحكم</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className={`transition-colors ${isEditing && currentProduct.id === product.id ? 'bg-gold-50' : 'hover:bg-gray-50'}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-full object-cover border border-gray-200" src={product.image} alt="" />
                            </div>
                            <div className="mr-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-xs text-gray-500">
                                {product.category === 'luxury' ? 'فاخر' : product.category === 'daily' ? 'يومي' : 'محشي'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <div className="flex justify-center gap-2">
                            <button 
                                type="button"
                                onClick={() => handleEditClick(product)} 
                                className="text-brand-600 hover:text-gold-600 bg-brand-50 hover:bg-white border border-transparent hover:border-gold-200 p-1.5 rounded transition-all"
                                title="تعديل"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button 
                                type="button"
                                onClick={() => handleDeleteClick(product.id)} 
                                className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-white border border-transparent hover:border-red-200 p-1.5 rounded transition-all"
                                title="حذف"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Settings View */}
        {activeTab === 'settings' && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-brand-900 mb-6 border-b pb-4">أسعار التوصيل والخصومات</h2>
            <form onSubmit={handleSettingsSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">القاهرة</label>
                  <div className="relative">
                     <input type="number" value={localSettings.deliveryRates.cairo} onChange={e => setLocalSettings({...localSettings, deliveryRates: {...localSettings.deliveryRates, cairo: Number(e.target.value)}})} className="w-full border rounded-lg px-3 py-2 pl-10 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none bg-white text-black" />
                     <span className="absolute left-3 top-2 text-gray-400 text-sm">ج.م</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الجيزة</label>
                   <div className="relative">
                    <input type="number" value={localSettings.deliveryRates.giza} onChange={e => setLocalSettings({...localSettings, deliveryRates: {...localSettings.deliveryRates, giza: Number(e.target.value)}})} className="w-full border rounded-lg px-3 py-2 pl-10 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none bg-white text-black" />
                    <span className="absolute left-3 top-2 text-gray-400 text-sm">ج.م</span>
                   </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">6 أكتوبر</label>
                   <div className="relative">
                    <input type="number" value={localSettings.deliveryRates.october} onChange={e => setLocalSettings({...localSettings, deliveryRates: {...localSettings.deliveryRates, october: Number(e.target.value)}})} className="w-full border rounded-lg px-3 py-2 pl-10 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none bg-white text-black" />
                    <span className="absolute left-3 top-2 text-gray-400 text-sm">ج.م</span>
                   </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الهرم</label>
                   <div className="relative">
                    <input type="number" value={localSettings.deliveryRates.haram} onChange={e => setLocalSettings({...localSettings, deliveryRates: {...localSettings.deliveryRates, haram: Number(e.target.value)}})} className="w-full border rounded-lg px-3 py-2 pl-10 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none bg-white text-black" />
                    <span className="absolute left-3 top-2 text-gray-400 text-sm">ج.م</span>
                   </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">مدينة الرحاب</label>
                   <div className="relative">
                    <input type="number" value={localSettings.deliveryRates.rehab} onChange={e => setLocalSettings({...localSettings, deliveryRates: {...localSettings.deliveryRates, rehab: Number(e.target.value)}})} className="w-full border rounded-lg px-3 py-2 pl-10 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none bg-white text-black" />
                    <span className="absolute left-3 top-2 text-gray-400 text-sm">ج.م</span>
                   </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">مدينتي</label>
                   <div className="relative">
                    <input type="number" value={localSettings.deliveryRates.madinaty} onChange={e => setLocalSettings({...localSettings, deliveryRates: {...localSettings.deliveryRates, madinaty: Number(e.target.value)}})} className="w-full border rounded-lg px-3 py-2 pl-10 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none bg-white text-black" />
                    <span className="absolute left-3 top-2 text-gray-400 text-sm">ج.م</span>
                   </div>
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الإسماعيلية</label>
                   <div className="relative">
                    <input type="number" value={localSettings.deliveryRates.ismailia} onChange={e => setLocalSettings({...localSettings, deliveryRates: {...localSettings.deliveryRates, ismailia: Number(e.target.value)}})} className="w-full border rounded-lg px-3 py-2 pl-10 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none bg-white text-black" />
                    <span className="absolute left-3 top-2 text-gray-400 text-sm">ج.م</span>
                   </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسكندرية</label>
                  <div className="relative">
                    <input type="number" value={localSettings.deliveryRates.alex} onChange={e => setLocalSettings({...localSettings, deliveryRates: {...localSettings.deliveryRates, alex: Number(e.target.value)}})} className="w-full border rounded-lg px-3 py-2 pl-10 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none bg-white text-black" />
                    <span className="absolute left-3 top-2 text-gray-400 text-sm">ج.م</span>
                   </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">طنطا</label>
                  <div className="relative">
                    <input type="number" value={localSettings.deliveryRates.tanta} onChange={e => setLocalSettings({...localSettings, deliveryRates: {...localSettings.deliveryRates, tanta: Number(e.target.value)}})} className="w-full border rounded-lg px-3 py-2 pl-10 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none bg-white text-black" />
                    <span className="absolute left-3 top-2 text-gray-400 text-sm">ج.م</span>
                   </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المنصورة</label>
                  <div className="relative">
                    <input type="number" value={localSettings.deliveryRates.mansoura} onChange={e => setLocalSettings({...localSettings, deliveryRates: {...localSettings.deliveryRates, mansoura: Number(e.target.value)}})} className="w-full border rounded-lg px-3 py-2 pl-10 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none bg-white text-black" />
                    <span className="absolute left-3 top-2 text-gray-400 text-sm">ج.م</span>
                   </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المحافظات الأخرى</label>
                  <div className="relative">
                    <input type="number" value={localSettings.deliveryRates.others} onChange={e => setLocalSettings({...localSettings, deliveryRates: {...localSettings.deliveryRates, others: Number(e.target.value)}})} className="w-full border rounded-lg px-3 py-2 pl-10 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none bg-white text-black" />
                    <span className="absolute left-3 top-2 text-gray-400 text-sm">ج.م</span>
                   </div>
                </div>
              </div>

              <div className="border-t pt-6 mt-6">
                <div className="flex items-center gap-4 mb-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={localSettings.isDiscountActive} onChange={e => setLocalSettings({...localSettings, isDiscountActive: e.target.checked})} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
                    <span className="mr-3 text-sm font-medium text-gray-900">تفعيل الخصم العام</span>
                  </label>
                </div>
                
                <div className={`transition-all duration-300 ${localSettings.isDiscountActive ? 'opacity-100 max-h-20' : 'opacity-50 max-h-0 overflow-hidden'}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نسبة الخصم (%)</label>
                  <input type="number" max="100" min="0" value={localSettings.discountPercentage} onChange={e => setLocalSettings({...localSettings, discountPercentage: Number(e.target.value)})} className="w-full border rounded-lg px-3 py-2 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none bg-white text-black" />
                </div>
              </div>

              <button type="submit" className="w-full bg-brand-800 text-white py-3 rounded-lg font-bold hover:bg-brand-900 transition-colors shadow-lg mt-4">
                حفظ الإعدادات
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center transform transition-all scale-100">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">حذف المنتج؟</h3>
                <p className="text-gray-500 mb-6">
                    هل أنت متأكد من رغبتك في حذف هذا المنتج نهائياً؟ لا يمكن التراجع عن هذا الإجراء.
                </p>
                <div className="flex gap-3">
                    <button 
                        onClick={cancelDelete}
                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                        إلغاء
                    </button>
                    <button 
                        onClick={confirmDelete}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
                    >
                        نعم، احذف
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;