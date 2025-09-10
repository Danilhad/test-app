// src/components/RootLayout/RootLayout.jsx
import React, { useEffect, useState } from 'react';
import Header from '../Header/Header';
import CategoryFilter from '../CategoryFilter/CategoryFilter';
import BottomNavigation from '../BottomNavigation/BottomNavigation';
import { Outlet, useLocation } from 'react-router-dom';
import { useShopContext } from '../../context/ShopContext.jsx';
import OrderView from '../OrderView/OrderView';



const RootLayout = () => {
  const { showOrderView } = useShopContext(); // ← Получаем состояние из контекста
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const location = useLocation();

  // Скрываем CategoryFilter на страницах /cart и /order
  const isCartOrOrderPage = location.pathname === '/cart' || location.pathname === '/order';

// ↑ Используем useState для хранения состояния открыта ли клавиатура 
  useEffect(() => {
    const handleResize = () => {
      // Определяем, открыта ли клавиатура (высота окна уменьшена)
      const windowHeight = window.innerHeight;
      const screenRatio = windowHeight / document.documentElement.clientWidth;
      // Примерное условие: если высота окна меньше 500px, клавиатура открыта
      // Примерное условие: если соотношение высоты к ширине < 1.5, клавиатура открыта
      setIsKeyboardOpen(screenRatio < 1.5);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
      <div className="min-h-screen flex flex-col">
      <Header />
      {!isCartOrOrderPage && <CategoryFilter />}
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
        {showOrderView && <OrderView />}
      </main>
      
      {!isKeyboardOpen && <BottomNavigation />}
    </div>
  );
};

export default RootLayout;