import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, StoreSettings } from '../types';

// Default Data with 6 Items
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'تمر عجوة المدينة الفاخرة',
    description: 'عجوة المدينة الفاخرة السوداء المباركة، تتميز ببنيتها العصرية وطعمها المتوازن، غنية بالفوائد الصحية.',
    price: '185 ج.م / كجم',
    image: '/images/product-1.png',
    category: 'luxury',
  },
  {
    id: 2,
    name: 'تمر سكري مفتل ملكي',
    description: 'سكري مفتل ملكي بلونه وقوامه الذهبي الهش المكرمل. حلاوة طبيعية تذوب في الفم.',
    price: '145 ج.م / كجم',
    image: '/images/product-2.png',
    category: 'luxury',
  },
  {
    id: 3,
    name: 'تمر مجدول جامبو',
    description: 'ملك التمور بحجمه الكبير ومذاقه الغني. قوام لحمي ناعم ومذاق يشبه الكراميل، مثالي للضيافة الفاخرة.',
    price: '135 ج.م / كجم',
    image: '/images/product-3.png',
    category: 'luxury',
  },
  {
    id: 4,
    name: 'تمر سكري محشو كاجو',
    description: 'تمر سكري فاخر محشو كاجو، غني بالفوائد والفيتامينات ومضادات الأكسدة، منشط طبيعي.',
    price: '565 ج.م / كجم',
    image: '/images/product-4.png',
    category: 'stuffed',
  },
  {
    id: 5,
    name: 'تمر سكري محشو لوز',
    description: 'تمر سكري فاخر محشو اللوز، غني بالفيتامينات ومضادات الأكسدة، ومولد للطاقة.',
    price: '565 ج.م / كجم',
    image: '/images/product-5.png',
    category: 'stuffed',
  },
  {
    id: 6,
    name: 'تمر سكري ملكي محشو بندق',
    description: 'تمر سكري ملكي محشو بندق ومغلف بالشوكولاتة البيضاء، غني بالفيتامينات ومضادات الأكسدة، ومولد للطاقة ومنشط طبيعي.',
    price: '665 ج.م / كجم',
    image: '/images/product-6.png',
    category: 'stuffed',
  },
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
    others: 100,
  },
  discountPercentage: 25,
  isDiscountActive: false,
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
            ...(parsed.deliveryRates || {}),
          },
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
    setProducts((prev) => {
      const newId = prev.length > 0 ? Math.max(...prev.map((p) => p.id)) + 1 : 1;
      const newProduct = { ...productData, id: newId };
      return [...prev, newProduct];
    });
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
  };

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        settings,
        addProduct,
        updateProduct,
        deleteProduct,
        updateSettings,
      }}
    >
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
