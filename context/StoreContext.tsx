import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, StoreSettings } from '../types';

// Default Data with 6 Items
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'عجوة المدينة الفاخرة',
    description: 'تمر العجوة المبارك، يتميز بلونه الأسود الداكن وطعمه المتوازن، غني بالفوائد الصحية.',
    price: '85 ج.م / كجم',
    image: 'https://images.unsplash.com/photo-1628157796939-2f52c1e7c5d3?q=80&w=800&auto=format&fit=crop',
    category: 'luxury'
  },
  {
    id: 2,
    name: 'سكري مفتل ملكي',
    description: 'السكري الملكي بلونه الذهبي وقوامه الهش المكرمل. حلاوة طبيعية تذوب في الفم.',
    price: '60 ج.م / كجم',
    image: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d601d5?q=80&w=800&auto=format&fit=crop',
    category: 'luxury'
  },
  {
    id: 3,
    name: 'مجدول (جامبو)',
    description: 'ملك التمور بحجمه الكبير ومذاقه الغني. قوام لحمي ناعم ومذاق يشبه الكراميل، مثالي للضيافة الفاخرة.',
    price: '95 ج.م / كجم',
    image: 'https://images.unsplash.com/photo-1596547609673-3c9704259253?q=80&w=800&auto=format&fit=crop',
    category: 'luxury'
  },
  {
    id: 4,
    name: 'صقعي فاخر',
    description: 'تمر الصقعي المميز بتداخل اللونين الأحمر والأشقر، قوام متماسك وحلاوة معتدلة، خيار رائع للمناسبات.',
    price: '70 ج.م / كجم',
    image: 'https://images.unsplash.com/photo-1559839656-78cc94b59521?q=80&w=800&auto=format&fit=crop',
    category: 'luxury'
  },
  {
    id: 5,
    name: 'تمور محشية فاخرة',
    description: 'تمور منتقاة بعناية محشوة بأجود أنواع المكسرات (لوز، فستق، كاجو)، ضيافة استثنائية.',
    price: '120 ج.م / كجم',
    image: 'https://images.unsplash.com/photo-1548682979-3112c37e6d0a?q=80&w=800&auto=format&fit=crop',
    category: 'stuffed'
  },
  {
    id: 6,
    name: 'خلاص القصيم',
    description: 'الخلاص الذهبي المعروف بمذاقه التوفي اللذيذ وقوامه الطري، رفيق القهوة العربية الأول.',
    price: '55 ج.م / كجم',
    image: 'https://images.unsplash.com/photo-1615486511484-92e590508b90?q=80&w=800&auto=format&fit=crop',
    category: 'daily'
  }
];

const DEFAULT_SETTINGS: StoreSettings = {
  deliveryRates: {
    cairo: 60,
    giza: 60,
    october: 65,
    haram: 65,
    rehab: 70,
    madinaty: 70,
    ismailia: 75,
    alex: 90,
    tanta: 90,
    mansoura: 90,
    others: 100
  },
  discountPercentage: 0,
  isDiscountActive: false
};

interface StoreContextType {
  products: Product[];
  settings: StoreSettings;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
  updateSettings: (settings: StoreSettings) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('store_products');
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    } catch (e) {
      return DEFAULT_PRODUCTS;
    }
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('store_settings');
      // Merge saved settings with default to ensure all keys exist if new ones were added
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
            ...DEFAULT_SETTINGS,
            ...parsed,
            deliveryRates: {
                ...DEFAULT_SETTINGS.deliveryRates,
                ...(parsed.deliveryRates || {})
            }
        };
      }
      return DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  });

  // Persist to LocalStorage
  useEffect(() => {
    localStorage.setItem('store_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('store_settings', JSON.stringify(settings));
  }, [settings]);

  const addProduct = (productData: Omit<Product, 'id'>) => {
    setProducts(prev => {
      const newId = prev.length > 0 ? Math.max(...prev.map(p => p.id)) + 1 : 1;
      const newProduct = { ...productData, id: newId };
      return [...prev, newProduct];
    });
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
  };

  return (
    <StoreContext.Provider value={{ 
      products, 
      settings, 
      addProduct, 
      updateProduct, 
      deleteProduct, 
      updateSettings 
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};