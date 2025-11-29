import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { chatWithTamrHenna } from '../services/geminiService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const { products, settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'أهلاً بك في تمور العمارنة! 🌴 أنا "تمر حنه"، كيف أقدر أساعدك النهاردة؟',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Prepare context data for AI
    const contextData = {
      products: products.map(p => ({ name: p.name, price: p.price, desc: p.description })),
      deliveryRates: settings.deliveryRates,
      discountInfo: {
        active: settings.isDiscountActive,
        percentage: settings.discountPercentage
      }
    };

    // Prepare history for AI (convert to Gemini format)
    // We only take the last 10 messages to keep context relevant but not huge
    const history = messages.slice(-10).map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    try {
      const responseText = await chatWithTamrHenna(userMsg.text, contextData, history);
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[80] font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] max-w-[90vw] bg-white rounded-2xl shadow-2xl overflow-hidden border border-brand-200 animate-slideUp flex flex-col h-[500px] max-h-[80vh]">
          {/* Header */}
          <div className="bg-brand-900 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden relative">
                 {/* Avatar Placeholder - Female Silhouette or Palm */}
                 <svg className="w-6 h-6 text-brand-900" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                 </svg>
              </div>
              <div>
                <h3 className="font-bold text-gold-400">تمر حنه</h3>
                <span className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  متصل الآن
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-brand-200 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 bg-brand-50 p-4 overflow-y-auto custom-scrollbar">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-brand-800 text-white rounded-br-none' 
                      : 'bg-white text-brand-900 rounded-bl-none border border-brand-100'
                  }`}
                >
                  {msg.text}
                  <span className={`text-[10px] block mt-1 opacity-70 ${msg.sender === 'user' ? 'text-brand-200 text-left' : 'text-brand-500 text-right'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-white border border-brand-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="bg-white p-3 border-t border-brand-200 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب استفسارك هنا..."
              className="flex-1 bg-brand-50 border border-brand-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-brand-900 placeholder-brand-400"
            />
            <button 
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="bg-gold-500 text-brand-900 p-2 rounded-full hover:bg-gold-400 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 transform rotate-180" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${isOpen ? 'bg-brand-900 rotate-90' : 'bg-gold-500 hover:bg-gold-400'}`}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7 text-brand-900" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          </svg>
        )}
      </button>
    </div>
  );
};

export default ChatBot;
