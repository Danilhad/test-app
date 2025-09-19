// src/components/CartView/CartView.jsx
import React from 'react';
import { useShopContext } from '../../context/ShopContext.jsx';
import { useNavigate } from 'react-router-dom';

const CartView = () => {
  const { cart, removeFromCart, clearCart } = useShopContext();
  const navigate = useNavigate();
  
  // Преобразуем объект cart в массив
  const cartItems = Object.values(cart || {});
  
  // Добавляем проверку на пустоту
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10">
        {/* Эмодзи корзины */}
        <span className="text-8xl text-primary-500 mb-6">🛒</span>
        <p className="text-gray-500 text-lg">Корзина пуста</p>
      </div>
    );
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);

  // Функция для удаления товара из корзины
  const handleRemoveFromCart = (item) => {
    // Создаем уникальный ключ для товара (как в addToCart)
    const itemKey = `${item.id}-${item.size}`;
    removeFromCart(itemKey);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Корзина</h2>
      <ul className="space-y-4">
        {cartItems.map(item => (
          <li 
            key={`${item.id}-${item.size}`} 
            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm"
          >
            <div className="flex items-center">
              <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded mr-3" />
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-500 mr-2">{item.price} ₽ × {item.quantity}</span>
                  {item.size && (
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-black text-white">
                      {item.size}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button 
              onClick={() => handleRemoveFromCart(item)}
              className="text-red-500 hover:text-red-700"
            >
              ❌
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-lg font-bold">
          <span>Итого:</span>
          <span>{totalPrice} ₽</span>
        </div>
        
        <div className="mt-4 flex space-x-3">
          <button 
            onClick={clearCart}
            className="w-full py-2 px-4 bg-gray-200 shadow-sm rounded-lg text-gray-700 hover:bg-gray-300 transition-colors"
          >
            Очистить
          </button>
          <button 
            onClick={() => navigate('/order')}
            className="w-full py-2 px-4 bg-white shadow-sm border-gray-800 text-black rounded-lg hover:bg-primary-700 transition-colors"
          >
            Оформить заказ
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartView;