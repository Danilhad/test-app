// src/components/RootLayout/RootLayout.jsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import CategoryFilter from '../CategoryFilter/CategoryFilter';
import BottomNavigation from '../BottomNavigation/BottomNavigation';
import ProductBottomSheet from '../ProductBottomSheet/ProductBottomSheet';
import { useShopContext } from '../../context/ShopContext.jsx';

const RootLayout = () => {
  const { showOrderView, productSheet, closeProductSheet } = useShopContext();
  const [isCategoryHidden, setIsCategoryHidden] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const location = useLocation();
  const mainRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  const isCartOrOrderPage = location.pathname === '/cart' || location.pathname === '/order';

  // Безопасное получение состояния productSheet
  const sheetState = productSheet || {};
  const isSheetOpen = Boolean(sheetState.isOpen);
  const sheetProduct = sheetState.product || null;

  // Оптимизированный обработчик скролла
  const handleScroll = useCallback((e) => {
    const scrollY = e.target.scrollTop;
    setScrollPosition(scrollY);
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      const threshold = 20;
      setIsCategoryHidden(scrollY > threshold);
    }, 30);
  }, []);

  useEffect(() => {
    const element = mainRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        element.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  // Блокировка скролла
  useEffect(() => {
    if (isSheetOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isSheetOpen]);

  // Вычисление высот
  const getLayoutHeights = () => {
    return {
      mainMarginTop: !isCartOrOrderPage && !isCategoryHidden ? '7rem' : '4rem',
      mainMarginBottom: '4.5rem',
      mainHeight: `calc(100vh - ${!isCartOrOrderPage && !isCategoryHidden ? '7rem' : '4rem'} - 4.5rem)`
    };
  };

  const { mainMarginTop, mainMarginBottom, mainHeight } = getLayoutHeights();

  return (
    <div className="min-h-screen flex flex-col bg-[#0088CC]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </header>

      {/* CategoryFilter */}
      <AnimatePresence>
        {!isCartOrOrderPage && (
          <motion.div
            key="category-filter"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40"
          >
            <CategoryFilter />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Основной контент */}
      <main 
        ref={mainRef}
        className="flex-grow transition-all duration-200"
        style={{ 
          marginTop: mainMarginTop,
          marginBottom: mainMarginBottom,
          height: mainHeight
        }}
      >
        <div className="container mx-auto px-4 py-6 pb-14">
          <Outlet />
        </div>
      </main>

      {/* BottomNavigation */}
      <AnimatePresence>
        {!isSheetOpen && (
          <motion.footer
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-0 left-0 right-0 z-50"
          >
            <BottomNavigation />
          </motion.footer>
        )}
      </AnimatePresence>

      {/* Product Bottom Sheet */}
      <AnimatePresence>
        {isSheetOpen && (
          <ProductBottomSheet
            product={sheetProduct}
            isOpen={isSheetOpen}
            onClose={closeProductSheet}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(RootLayout);