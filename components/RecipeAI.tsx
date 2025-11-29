import React, { useState } from 'react';
import { generateDateRecipe } from '../services/geminiService';
import { RecipeResponse } from '../types';

const RecipeAI: React.FC = () => {
  const [dateType, setDateType] = useState('سكري');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<RecipeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setRecipe(null);
    try {
      const result = await generateDateRecipe({ dateType, difficulty });
      setRecipe(result);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ ما');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-chef" className="py-20 relative bg-brand-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
             <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="pattern_leaves" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(45)">
                        <line x1="0" y1="0" x2="0" y2="40" stroke="#FFFFFF" strokeWidth="2" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#pattern_leaves)" />
            </svg>
        </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <span className="inline-block py-1 px-3 rounded-full bg-gold-500/20 text-gold-400 text-sm font-semibold mb-3 border border-gold-500/30">
            مدعوم بالذكاء الاصطناعي ✨
          </span>
          <h2 className="text-3xl font-extrabold sm:text-4xl mb-4">شيف العمارنة الذكي</h2>
          <p className="text-brand-200">
            لديك تمور ولا تعرف ماذا تصنع بها؟ دع ذكاءنا الاصطناعي يبتكر لك وصفة شهية ومميزة.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-gold-400 mb-2 font-medium">نوع التمر المتوفر لديك</label>
              <select 
                value={dateType}
                onChange={(e) => setDateType(e.target.value)}
                className="w-full bg-brand-800 border border-brand-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="عجوة">عجوة</option>
                <option value="سكري">سكري</option>
                <option value="مجدول">مجدول</option>
                <option value="صقعي">صقعي</option>
                <option value="خلاص">خلاص</option>
              </select>
            </div>
            <div>
              <label className="block text-gold-400 mb-2 font-medium">مستوى صعوبة الوصفة</label>
              <select 
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-brand-800 border border-brand-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="easy">سهلة وسريعة</option>
                <option value="medium">متوسطة</option>
                <option value="hard">احترافية (للشيف)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gold-500 text-brand-900 font-bold py-4 rounded-xl hover:bg-gold-400 transition-all shadow-lg hover:shadow-gold-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-brand-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري ابتكار الوصفة...
              </>
            ) : (
              'ابتكر لي وصفة الآن'
            )}
          </button>

          {error && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-center">
              {error}
            </div>
          )}

          {recipe && (
            <div className="mt-8 bg-brand-800/50 rounded-xl p-6 border border-brand-700 animate-fadeIn">
              <div className="flex justify-between items-start border-b border-brand-700 pb-4 mb-4">
                <h3 className="text-2xl font-bold text-gold-400">{recipe.title}</h3>
                <span className="bg-brand-700 text-xs px-3 py-1 rounded-full text-brand-200">
                   ⏱️ {recipe.prepTime}
                </span>
              </div>
              
              <p className="text-brand-200 italic mb-6">"{recipe.description}"</p>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-bold text-white mb-3 border-r-4 border-gold-500 pr-3">المكونات</h4>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ing, idx) => (
                      <li key={idx} className="flex items-center text-brand-100 text-sm">
                        <span className="w-1.5 h-1.5 bg-gold-500 rounded-full ml-2"></span>
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-3 border-r-4 border-gold-500 pr-3">طريقة التحضير</h4>
                  <ol className="space-y-3">
                    {recipe.instructions.map((step, idx) => (
                      <li key={idx} className="text-brand-100 text-sm flex">
                        <span className="font-bold text-gold-500 ml-2">{idx + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RecipeAI;