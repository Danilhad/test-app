// src/components/CategoryFilter/CategoryFilter.jsx
// src/components/CategoryFilter/CategoryFilter.jsx
import React, { useRef, useState, useEffect } from 'react';
import { useShopContext } from '../../context/ShopContext.jsx';
import { CATEGORIES } from '../../config/constants';

const CategoryFilter = React.memo(() => {
  const { activeCategory, setActiveCategory, products } = useShopContext();
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Отладочная информация
  console.log('🎯 Active category:', activeCategory);
  console.log('🎯 Available categories in products:', [...new Set(products.map(p => p.category))]);
  console.log('🎯 CATEGORIES config:', CATEGORIES);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };


  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollContainerRef.current.scrollLeft - scrollAmount)
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      checkScrollPosition(); // Initial check
    }


    
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScrollPosition);
      }
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, []);

   return (
    <nav className="
      bg-white-600/80 backdrop-blur-sm
      border-b border-blue-400/30
      shadow-lg
      relative overflow-hidden
    ">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent"></div>
      
      <div className="container mx-auto py-3 relative">
        {/* Отладочная информация */}
        <div className="bg-yellow-500/20 p-1 rounded text-center mb-2">
          <span className="text-yellow-200 text-xs">
            Категории в товарах: {[...new Set(products.map(p => p.category))].join(', ')}
          </span>
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto px-3 py-1 space-x-2 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              className={`
                flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-xl
                text-sm font-medium transition-all duration-200
                border border-blue-400/30 min-w-max
                ${activeCategory === category.id
                  ? 'bg-blue-500/50 text-white shadow-lg scale-105'
                  : 'bg-blue-500/30 text-blue-100 hover:bg-blue-500/40'
                }
              `}
              onClick={() => setActiveCategory(category.id)}
            >
              <span className="text-base">{category.icon}</span>
              <span className="text-xs font-semibold">{category.name}</span>
              {/* Покажем количество товаров в категории */}
              <span className="text-xs opacity-70">
                ({products.filter(p => p.category === category.id).length})
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
});

CategoryFilter.displayName = 'CategoryFilter';

export default CategoryFilter;