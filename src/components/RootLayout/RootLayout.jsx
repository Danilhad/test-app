// src/components/RootLayout/RootLayout.jsx
import React from 'react';
import Header from '../Header/Header';
import CategoryFilter from '../CategoryFilter/CategoryFilter';
import BottomNavigation from '../BottomNavigation/BottomNavigation';
import { Outlet } from 'react-router-dom';
import { useShopContext } from '../../context/ShopContext.jsx';
import OrderView from '../OrderView/OrderView';

const RootLayout = () => {
  const { showOrderView } = useShopContext(); // ← Получаем состояние из контекста

  
  return (
      <div className="min-h-screen flex flex-col">
      <Header />
      <CategoryFilter />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
        {showOrderView && <OrderView />}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default RootLayout;