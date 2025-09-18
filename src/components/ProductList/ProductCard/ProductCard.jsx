// src/components/ProductList/ProductCard/ProductCard.jsx
import React from 'react';
import { useShopContext } from '../../../context/ShopContext.jsx';

const ProductCard = React.memo(({ product }) => {
  const { openProductSheet } = useShopContext();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openProductSheet(product);
  };

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
  };

  return (
    <div 
      className="
        group relative overflow-hidden 
        rounded-2xl 
        transition-all duration-300 
        transform hover:-translate-y-1 
        h-72 cursor-pointer
        bg-white/10 backdrop-blur-xl
        border border-white/20 border-b-white/40 border-r-white/40
        shadow-lg hover:shadow-3xl
        relative overflow-hidden
        active:scale-95
      "
      onClick={handleClick}
    >
      {/* Эффект жидкого стекла */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
      
      {/* Изображение */}
      <div className="relative overflow-hidden rounded-t-2xl h-48">
        <img 
          src={product.image} 
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
        
        {/* Кнопка быстрого добавления */}
        <button
          onClick={handleClick}
          className="absolute top-2 right-2 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
          aria-label="Быстрое добавление"
        >
          ➕
        </button>
      </div>
      
      {/* Содержимое карточки */}
      <div className="p-4 flex flex-col justify-between h-24 relative z-10">
        <h3 className="font-semibold text-white line-clamp-2 text-sm leading-tight group-hover:text-blue-200 transition-colors drop-shadow-md">
          {product.title}
        </h3>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-white drop-shadow-md">
            {product.price?.toLocaleString()} ₽
          </span>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;