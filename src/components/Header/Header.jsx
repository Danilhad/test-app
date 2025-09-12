// src/components/Header/Header.jsx
import React from 'react';
import { useLocation } from 'react-router-dom'; // ← Для получения текущего маршрута
import '../../index.css';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div 
        className="container mx-auto px-4 py-4 flex items-center justify-center"
      >
        <div 
          className="bg-white/30 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 
                     flex items-center justify-center w-full max-w-7xl p-2 sm:p-4"
        >
          {/* Логотип по центру */}
          <div className="flex-shrink-0">
            <img 
              src="/logo.png" 
              alt="VikMar Shop Logo" 
              className="h-8 sm:h-10 w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;