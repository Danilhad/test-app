// src/components/OrderView/OrderView.jsx
// src/components/OrderView/OrderView.jsx
// src/components/OrderView/OrderView.jsx
import React, { useState } from 'react';
import { useShopContext } from '../../context/ShopContext.jsx';
import { useNavigate } from 'react-router-dom';

const OrderView = () => {
  const { cart, createOrder, clearCart, checkSizeAvailability } = useShopContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'card',
    comments: ''
  });

  // Преобразуем объект cart в массив
  const cartItems = Object.values(cart || {});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (cartItems.length === 0) {
    alert('Корзина пуста!');
    return;
  }

  // Проверяем доступность всех товаров в корзине
  const unavailableItems = cartItems.filter(item => 
    !checkSizeAvailability(item.id, item.size)
  );

  if (unavailableItems.length > 0) {
    alert('Некоторые товары в корзине больше не доступны. Пожалуйста, обновите корзину.');
    return;
  }

  const total = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
  
  // Очищаем данные от undefined значений
  const orderData = {
    customer: {
      name: formData.name || '', // гарантируем строку, даже если undefined
      phone: formData.phone || '',
      address: formData.address || ''
    },
    items: cartItems.map(item => ({
      id: item.id || '',
      title: item.title || '',
      price: item.price || 0,
      size: item.size || '',
      quantity: item.quantity || 0,
      image: item.image || ''
    })),
    paymentMethod: formData.paymentMethod || 'card',
    comments: formData.comments || '', // гарантируем строку
    total: total,
    createdAt: Date.now() // добавляем timestamp
  };



  try {
    const orderId = await createOrder(orderData);
    alert(`Заказ #${orderId} успешно оформлен!`);
    
    if (typeof clearCart === 'function') {
      clearCart();
    }
    
    navigate('/');
  } catch (error) {
    alert('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте again.');
    console.error('Order creation error:', error);
  }
};

// Функция для удаления undefined полей из объекта
const removeUndefinedFields = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => removeUndefinedFields(item));
  }
  
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleaned[key] = removeUndefinedFields(value);
    }
  }
  return cleaned;
};

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Оформление заказа</h2>
      
      {/* Краткая информация о заказе */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Состав заказа:</h3>
        {cartItems.map(item => {
          const isAvailable = checkSizeAvailability(item.id, item.size);
          
          return (
            <div 
              key={`${item.id}-${item.size}`} 
              className={`flex justify-between text-sm mb-1 p-2 rounded ${
                !isAvailable ? 'bg-red-100' : ''
              }`}
            >
              <div>
                <span>{item.title} ({item.size}) × {item.quantity}</span>
                {!isAvailable && (
                  <span className="text-red-600 text-xs ml-2">⚠️ Нет в наличии</span>
                )}
              </div>
              <span>{item.price * item.quantity} ₽</span>
            </div>
          );
        })}
        <div className="border-t pt-2 mt-2 font-semibold">
          Итого: {totalPrice} ₽
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Имя *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Телефон *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Адрес доставки *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Способ оплаты *
          </label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="card">Карта онлайн</option>
            <option value="cash">Наличные при получении</option>
            <option value="card_courier">Карта курьеру</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Комментарий к заказу
          </label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Особые пожелания по доставке и т.д."
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Назад
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Подтвердить заказ
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderView;