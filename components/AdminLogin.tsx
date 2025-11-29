import React, { useState } from 'react';

interface AdminLoginProps {
  onLogin: () => void;
  onCancel: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Ad123###') {
      onLogin();
    } else {
      setError('كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-brand-100">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-brand-900">تسجيل دخول المسؤول</h2>
          <p className="text-brand-600 mt-2">يرجى إدخال كلمة المرور للوصول إلى لوحة التحكم</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-700 mb-1">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-brand-300 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-all bg-white text-black"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 rounded-lg border border-brand-300 text-brand-700 hover:bg-brand-50 font-medium transition-colors"
            >
              عودة للموقع
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-lg bg-brand-800 text-white hover:bg-brand-900 font-medium transition-colors shadow-lg"
            >
              دخول
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;