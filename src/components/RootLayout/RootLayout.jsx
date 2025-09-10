// src/components/RootLayout/RootLayout.jsx
import React from 'react';
import Header from '../Header/Header';
import CategoryFilter from '../CategoryFilter/CategoryFilter';
import BottomNavigation from '../BottomNavigation/BottomNavigation';
import { Outlet } from 'react-router-dom';
import { ShopProvider } from '../../context/ShopContext';

const RootLayout = () => {
  return (
    <ShopProvider>
    <div>
      <Header />
      <CategoryFilter />
      
      <main className="container mx-auto px-4 py-1">
        <Outlet />
      </main>
      
      <BottomNavigation />
    </div>
    </ShopProvider>
  );
};

export default RootLayout;
