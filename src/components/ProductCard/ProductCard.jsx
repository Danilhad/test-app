import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
  const [isAdded, setIsAdded] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = () => {
    onAddToCart(product);
    setIsAdded(true);
    
    setTimeout(() => {
      setIsAdded(false);
    }, 1000);
  };

  return (
    <div 
      className="card group relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-50 h-72 sm:h-80 cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)} // ✅ Переход при клике
    >
      {/* Изображение */}
      <div className="relative overflow-hidden rounded-t-2xl h-32 sm:h-40">
        <img 
          src={product.image} 
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
      </div>
      
      {/* Содержимое карточки */}
      <div className="p-4 sm:p-5 flex flex-col justify-between">
        {/* Название товара */}
        <h3 className="font-medium text-gray-800 line-clamp-2 mb-3 text-sm sm:text-base leading-tight group-hover:text-primary-700 transition-colors">
          {product.title}
        </h3>
        
        {/* Цена */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-lg sm:text-xl font-bold text-primary-600">
            {product.price.toLocaleString()} ₽
          </span>
        </div>
        
        {/* Кнопка добавления в корзину */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // ❄️ Останавливаем переход при клике на кнопку
            handleAddToCart();
          }}
          disabled={isAdded}
          className={`w-full py-2 sm:py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 whitespace-nowrap ` +
             (isAdded
               ? 'bg-yellow-200 text-black'
               : 'bg-gradient-to-r from-primary-500 to-primary-600 text-black hover:from-primary-600 hover:to-primary-700') +
             ` ${isAdded ? 'animate-pulse' : 'hover:shadow-lg'} mt-auto`}
        >
          {isAdded ? '👍 Добавлено' : '🛒 В корзину'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
