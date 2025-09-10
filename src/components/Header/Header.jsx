import React from 'react';
import '../../index.css'; 
const Header = () => {
  return (
    <header className="bg-gradient-to-r from-yellow-200 to-orange-300 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Логотип */}
          <div className="flex items-center gap-1">
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
