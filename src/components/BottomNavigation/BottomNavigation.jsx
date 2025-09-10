// src/components/BottomNavigation/BottomNavigation.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShopContext } from '../../context/ShopContext.jsx';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const { cart } = useShopContext();

  // Обработчик события скрытия клавиатуры  
  useEffect(() => {
    if (document.body.classList.contains('keyboard-open')) {
      document.querySelector('.bottom-nav').classList.add('keyboard-open');
    }
  }, []);
  

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-around py-3">
          <button
            onClick={() => navigate('/')}
            className={`flex flex-col items-center px-6 py-2 rounded-xl transition-all duration-200 ${
              window.location.pathname === '/' ? 'text-primary-600 bg-primary-50' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="text-2xl">🏠</span>
            <span className="text-xs font-medium mt-1">Главная</span>
          </button>
          
          <button
            onClick={() => navigate('/cart')}
            className={`flex flex-col items-center px-6 py-2 rounded-xl transition-all duration-200 relative ${
              window.location.pathname === '/cart' ? 'text-primary-600 bg-primary-50' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
            <span className="text-2xl">🛒</span>
            <span className="text-xs font-medium mt-1">Корзина</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default BottomNavigation;
