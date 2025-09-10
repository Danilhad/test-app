// src/components/ProductList/ProductList.jsx
import React, { useContext } from 'react';
import { useShopContext } from '../../context/ShopContext.jsx';
import ProductCard from '../ProductCard/ProductCard.jsx';

const ProductList = ({ products }) => {
  const { activeCategory, cart, setCart } = useShopContext(); // ← Получаем состояние и функцию

  // Функция для добавления товара в корзину
  const addToCart = (product) => {
    setCart(prevCart => [...prevCart, product]);
  };

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {filteredProducts.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToCart={addToCart} 
        />
      ))}
    </div>
  );
};

export default ProductList;
