// src/components/CartView/CartView.jsx
import React, { useContext } from 'react';
import { useShopContext } from '../../context/ShopContext.jsx';
import { useNavigate } from 'react-router-dom';

const CartView = () => {
  const { cart, removeFromCart, clearCart, setShowOrderView } = useShopContext();
   const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 text-lg">Корзина пуста</p>
      </div>
    );
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Корзина</h2>
      <ul className="space-y-4">
        {cart.map(item => (
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
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-black text-white">
                    {item.size}
                  </span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => removeFromCart(item.id, item.size)}
              className="text-red-500 hover:text-red-700"
            >
              Удалить
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
            className="w-full py-2 px-4 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition-colors"
          >
            Очистить
          </button>
          <button 
            onClick={() => navigate('/order')}
            className="w-full py-2 px-4 bg-primary-600 text-black rounded-lg hover:bg-primary-700 transition-colors"
          >
            Оформить заказ
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartView;
