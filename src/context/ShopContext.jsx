// src/context/ShopContext.jsx
import React, { createContext, useContext, useState } from 'react';

const ShopContext = createContext();

export const useShopContext = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const [activeCategory, setActiveCategory] = useState('all'); // добавляем состояние для категории
  const [cart, setCart] = useState([]); // добавляем состояние для корзины
  const [showOrderView, setShowOrderView] = useState(false); // добавляем состояние для отображения заказа
  const [activeView, setActiveView] = useState('home'); // добавляем состояние для активной страницы


   // Функция для добавления товара с уникальным ID
  const addToCart = (product) => {
    const uniqueId = `${product.id}-${Date.now()}`;
    setCart(prevCart => [...prevCart, { ...product, id: uniqueId }]);
  };
  
   // Функция для удаления товара по ID
  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // Функция для очистки корзины
  const clearCart = () => {
    setCart([]);
  };

  return (
    <ShopContext.Provider value={{ 
      activeCategory, setActiveCategory, 
      cart, setCart, 
      addToCart, removeFromCart, clearCart,
      showOrderView, setShowOrderView,
    }}>
      {children}
    </ShopContext.Provider>
  );
};
