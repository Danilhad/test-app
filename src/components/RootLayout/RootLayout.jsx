// src/components/RootLayout/RootLayout.jsx
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../Header/Header';
import CategoryFilter from '../CategoryFilter/CategoryFilter';
import BottomNavigation from '../BottomNavigation/BottomNavigation';
import { Outlet, useLocation } from 'react-router-dom';
import { useShopContext } from '../../context/ShopContext.jsx';
import OrderView from '../OrderView/OrderView';

const RootLayout = () => {
  const { showOrderView } = useShopContext();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isCategoryHidden, setIsCategoryHidden] = useState(false);
  const location = useLocation();
  const mainRef = useRef(null); // ← Добавлен ref

  const isCartOrOrderPage = location.pathname === '/cart' || location.pathname === '/order';

  // Обработка скролла только внутри <main>
  useEffect(() => {
    const handleScroll = (e) => {
      const scrollableElement = e.target;
      const scrollY = scrollableElement.scrollTop;
      const threshold = 5; // Порог скролла для скрытия

      if (scrollY > threshold) {
        setIsCategoryHidden(true);
      } else {
        setIsCategoryHidden(false);
      }
    };

    const element = mainRef.current;
    if (element && element.scrollHeight > element.clientHeight) {
      element.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Обработка изменения размера окна (клавиатура)
  useEffect(() => {
    const handleResize = () => {
      const windowHeight = window.innerHeight;
      const screenRatio = windowHeight / document.documentElement.clientWidth;
      setIsKeyboardOpen(screenRatio < 1.5);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: '#0088CC' }}
    >
      {/* Фиксированный Header */}
      <Header />

      {/* Анимация скрытия/появления CategoryFilter */}
      <AnimatePresence>
        {!isCartOrOrderPage && !isCategoryHidden && (
          <motion.div
            key="category-filter"
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0, transition: { duration: 0.3 } }}
            className="fixed top-16 left-0 right-0 z-30 shadow-md"
          >
            <CategoryFilter />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Основной контент с отступом для BottomNavigation */}
      <main 
        ref={mainRef} // ← Привязка ref
        className="flex-grow pt-16 overflow-y-auto" // ← Добавлен overflow-y-auto
      >
        <Outlet />
        {showOrderView && <OrderView />}
      </main>

      {/* Фиксированная BottomNavigation */}
      {!isKeyboardOpen && <BottomNavigation />}
    </div>
  );
};

export default RootLayout;
