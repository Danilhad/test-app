// src/components/Auth/Auth.jsx
// src/components/Auth/Auth.jsx
import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';
import { useShopContext } from '../../context/ShopContext';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, loading: contextLoading } = useShopContext();

  // Если пользователь уже авторизован, перенаправляем на главную
  useEffect(() => {
    if (!contextLoading && user) {
      navigate('/');
    }
  }, [user, contextLoading, navigate]);

  if (contextLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  if (user) {
    return null; // или редирект, но useEffect уже обработает
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      console.error('Auth error:', error);
      setError('Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700">
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20 w-96">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          🔐 Вход в админ-панель
        </h2>
        
        {error && (
          <div className="bg-red-500/80 text-white p-3 rounded-lg mb-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              📧 Email администратора
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              🔑 Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Введите пароль"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white/20 backdrop-blur-md border border-white/20 text-white py-3 rounded-xl hover:bg-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Загрузка...' : 'Войти в админ-панель'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-white/5 rounded-xl">
          <h3 className="text-white/80 text-sm font-medium mb-2">👑 Тестовый аккаунт админа:</h3>
          <p className="text-white/60 text-xs">Email: admin@example.com</p>
          <p className="text-white/60 text-xs">Пароль: admin123</p>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-white/80 hover:text-white transition-colors text-sm"
          >
            ← Вернуться на главную
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;