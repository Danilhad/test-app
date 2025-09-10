import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRef, useEffect } from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  const [isAdded, setIsAdded] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const navigate = useNavigate();
  const cardRef = useRef(null); // ← Создаем ref для карточки

  const handleAddToCart = () => {
    onAddToCart(product);
    setIsAdded(true);
    
    setTimeout(() => {
      setIsAdded(false);
    }, 1000);
  };

   // Очищаем состояние hover при открытии модалки
  useEffect(() => {
    if (showSizeModal && cardRef.current) {
      const event = new MouseEvent('mouseleave', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      cardRef.current.dispatchEvent(event); // ← Имитируем уход мыши
    }
  }, [showSizeModal]);

  return (
    <>
    <div 
       className="card group relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-50 h-64 sm:h-72 cursor-pointer" // ←
      onClick={() => navigate(`/product/${product.id}`)} // ✅ Переход при клике
    >
       {/* Изображение */}
        <div className="relative overflow-hidden rounded-t-2xl h-40 sm:h-52"> {/* ← Увеличен размер */}
          <img 
            src={product.image} 
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
        </div>
      
      {/* Содержимое карточки */}
      <div className="p-4 sm:p-5 flex flex-col justify-center min-h-[100px]">
        {/* Название товара */}
        <h3 className="font-medium text-gray-800 line-clamp-2 mb-2 text-sm sm:text-base leading-tight group-hover:text-primary-700 transition-colors">
          {product.title}
        </h3>
        
        {/* Цена */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-lg sm:text-xl font-bold text-primary-600">
            {product.price.toLocaleString()} ₽
          </span>
        </div>
        
        {/* Кнопка добавления в корзину */}
        
      </div>
    </div>
    </>
  );
};

export default ProductCard;
