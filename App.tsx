// Update author to 3MARNA
import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Products from './components/Products';
import RecipeAI from './components/RecipeAI';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import Cart from './components/Cart';
import OrderSuccess from './components/OrderSuccess';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ChatBot from './components/ChatBot';
import { CartProvider } from './context/CartContext';
import { StoreProvider } from './context/StoreContext';

type PageView = 'home' | 'cart' | 'success' | 'admin';

function AppContent() {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [lastOrderNumber, setLastOrderNumber] = useState<string>('');

  // Admin View Handler
  if (currentView === 'admin') {
    if (isAdminAuthenticated) {
      return <AdminDashboard onLogout={() => { setIsAdminAuthenticated(false); setCurrentView('home'); }} />;
    }
    return (
      <AdminLogin 
        onLogin={() => setIsAdminAuthenticated(true)} 
        onCancel={() => setCurrentView('home')} 
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-brand-50">
      {currentView !== 'success' && <Header onNavigate={setCurrentView} />}
      
      <main className="flex-grow">
        {currentView === 'home' && (
          <>
            <Hero />
            <Products />
            <RecipeAI />
          </>
        )}

        {currentView === 'cart' && (
          <Cart 
            onContinueShopping={() => setCurrentView('home')} 
            onCheckoutSuccess={(orderNum) => {
              setLastOrderNumber(orderNum);
              setCurrentView('success');
            }}
          />
        )}

        {currentView === 'success' && (
          <OrderSuccess 
            onReturnHome={() => setCurrentView('home')} 
            orderNumber={lastOrderNumber}
          />
        )}
      </main>

      {currentView !== 'success' && (
        <Footer 
          isPrivacyOpen={isPrivacyOpen} 
          setIsPrivacyOpen={setIsPrivacyOpen}
          onOpenAdmin={() => setCurrentView('admin')}
        />
      )}
      
      {currentView !== 'success' && (
        <CookieConsent onOpenPrivacy={() => setIsPrivacyOpen(true)} />
      )}

      {/* Chat Bot available on all screens except Admin/Success (optional, keeping it here for now) */}
      <ChatBot />
    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </StoreProvider>
  );
}

export default App;