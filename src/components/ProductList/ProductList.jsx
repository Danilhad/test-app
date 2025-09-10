// src/components/ProductList/ProductList.jsx
import React, { useContext } from 'react';
import { useShopContext } from '../../context/ShopContext.jsx';
import ProductCard from './ProductCard/ProductCard.jsx';


const ProductList = ({ products }) => {
  const { activeCategory, addToCart } = useShopContext(); // ← Получаем функцию

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  return (
     <div className="max-h-[calc(100vh-120px)] overflow-y-auto pb-20 scrollbar-hide sm:scrollbar-default">
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {filteredProducts.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToCart={addToCart} // ← Передаём функцию
        />
      ))}
    </div>
    </div>
  );
};

export default ProductList;