// src/components/BottomNavigation/BottomNavigation.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useShopContext } from '../../context/ShopContext.jsx';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useShopContext();

  // ИСПРАВЛЕНО: Используем Object.values() для преобразования объекта в массив
  const validCartItems = Object.values(cart || {}).filter(item => item && item.id) || [];
  const cartItemCount = validCartItems.length;

  return (
    <div className="
      w-full
      bg-white/10 backdrop-blur-2xl
      border-t border-white/20 border-t-white/40
      shadow-2xl
      relative overflow-hidden
    ">
      {/* Эффект жидкого стекла */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_70%)]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-around py-3 h-16">
          <button
            onClick={() => navigate('/')}
            className={`
              flex flex-col items-center justify-center px-6 py-2 rounded-2xl 
              transition-all duration-300 transform hover:scale-110
              bg-white/10 backdrop-blur-md
              border border-white/20 border-b-white/40 border-r-white/40
              hover:bg-white/15 hover:shadow-lg
              relative overflow-hidden
              ${location.pathname === '/' 
                ? 'bg-white/20 shadow-inner scale-105' 
                : 'text-white hover:text-white'
              }
            `}
          >
            <span className="text-2xl mb-1 relative z-10">🏠</span>
            
          </button>
          
          <button
            onClick={() => navigate('/cart')}
            className={`
              flex flex-col items-center justify-center px-6 py-2 rounded-2xl 
              transition-all duration-300 transform hover:scale-110
              bg-white/10 backdrop-blur-md
              border border-white/20 border-b-white/40 border-r-white/40
              hover:bg-white/15 hover:shadow-lg
              relative overflow-hidden
              ${location.pathname === '/cart' 
                ? 'bg-white/20 shadow-inner scale-105' 
                : 'text-white hover:text-white'
              }
            `}
          >
            {cartItemCount > 0 && (
              <span className="absolute top-1 right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold shadow-md z-50">
                {cartItemCount}
              </span>
            )}
            <span className="text-2xl mb-1 relative z-10">🛒</span>
            
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;