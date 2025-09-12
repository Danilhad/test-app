// src/components/ProductList/ProductCard/ProductCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LiquidGlass from 'liquid-glass-react'
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
      className="card group relative overflow-hidden bg-white/30 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20 h-64 sm:h-72 cursor-pointer" 
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Изображение */}
      <div className="relative overflow-hidden rounded-t-xl h-40 sm:h-52">
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
        <h3 className="font-medium text-gray-800 line-clamp-2 mb-12 text-sm sm:text-base leading-tight group-hover:text-primary-700 transition-colors">
          {product.title}
        </h3>
        
        {/* Цена */}
        <div className="absolute bottom-0 pt-10 items-center justify-between mb-3 sm:mb-4">
          <span className="text-xl sm:text-xl font-medium text-primary-600">
            {product.price.toLocaleString()} ₽
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
