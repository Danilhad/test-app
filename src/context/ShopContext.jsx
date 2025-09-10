// src/context/ShopContext.jsx
import React, { createContext, useContext, useState } from 'react';

const ShopContext = createContext();

export const useShopContext = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const [activeCategory, setActiveCategory] = useState('all'); // добавляем состояние для категории
  const [cart, setCart] = useState([]); // добавляем состояние для корзины
  const [showOrderView, setShowOrderView] = useState(false); // добавляем состояние для отображения заказа
  const [activeView, setActiveView] = useState('home'); // добавляем состояние для активной страницы


   // Добавление товара с размером
  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(
        i => i.id === item.id && i.size === item.size
      );
      
      if (existingItem) {
        return prevCart.map(i =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id, size) => {
    setCart(prevCart => prevCart.filter(item => !(item.id === id && item.size === size)));
  };

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
