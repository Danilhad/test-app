// src/components/Header/Header.jsx
import React from 'react';
import { useLocation } from 'react-router-dom'; // ← Для получения текущего маршрута
import '../../index.css';

const Header = () => {
  return (
    <header className="bg-white text-black sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-1">
        <div className="flex items-center justify-center w-full">
          {/* Логотип по центру */}
          <div className="flex-shrink-0">
            <img 
              src="logo.png" 
              alt="VikMar Shop Logo" 
              className="h-10 w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
