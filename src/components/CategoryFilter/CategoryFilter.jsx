// src/components/CategoryFilter/CategoryFilter.jsx
import React from 'react';
import { useShopContext } from '../../context/ShopContext.jsx'; // ← Импорт

const CategoryFilter = () => {
  const { activeCategory, setActiveCategory } = useShopContext(); // ← Получаем из контекста

  const categories = [
    { id: 'all', name: 'Все', icon: '🛍️' },
    { id: 'hat', name: 'Головные уборы', icon: '🧢' },
    { id: 'bottom', name: 'Низ', icon: '👖' },
    { id: 'top', name: 'Верх', icon: '👕' }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-16 z-40">
      <div className="container mx-auto px-4 py-3">
        <div 
          className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide sm:scrollbar-default" 
          style={{ scrollbarWidth: 'none' }} // Для Firefox
        >
          {categories.map(category => (
            <button
              key={category.id}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-primary-600 text-black shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveCategory(category.id)} // ← Теперь работает
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default CategoryFilter;
