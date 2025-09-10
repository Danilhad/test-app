import React from 'react';
import '../../index.css'; 
const Header = () => {
  return (
    <header className="bg-gradient-to-r from-yellow-200 to-orange-300 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-1"> {/* ← Уменьшили вертикальный отступ */}
          {/* Логотип */}
          <div className="flex items-center justify-center w-full">
            <img 
              src="logo.png" 
              alt="VikMar Shop Logo" 
              className="h-8 w-auto object-center object-contain shadow-md rounded-md" // ← Сделали логотип компактнее + тень
            />
          </div>    
        </div>
    </header>
  );
};


export default Header;
