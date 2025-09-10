// src/context/ShopContext.jsx
import React, { createContext, useContext, useState } from 'react';

const ShopContext = createContext();

export const useShopContext = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [showOrderView, setShowOrderView] = useState(false);
  const [activeView, setActiveView] = useState('home');

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
      showOrderView, setShowOrderView,
      activeView, setActiveView,
      removeFromCart, clearCart // ← Добавлено
    }}>
      {children}
    </ShopContext.Provider>
  );
};
