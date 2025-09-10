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
    <div className="bg-[#f6f8f9] min-h-screen flex flex-col">
      {/* Фиксированный Header */}
      <Header className="sticky top-0 z-50" />

      {/* Фиксированный CategoryFilter */}
      {!isCartOrOrderPage && (
        <CategoryFilter className="sticky top-[64px] z-40" /> // ← Учтено высоту Header (64px)
      )}

      {/* Основной контент с отступом для BottomNavigation */}
      <main className="flex-grow container mx-auto px-4 py-6 pb-10"> {/* ← pb-20 для высоты 80px */}
        <Outlet />
        {showOrderView && <OrderView />}
      </main>

      {/* Фиксированная BottomNavigation */}
      {!isKeyboardOpen && (
        <BottomNavigation className="fixed bottom-0 left-0 right-0 z-50" />
      )}
    </div>
  );
};

export default RootLayout;


