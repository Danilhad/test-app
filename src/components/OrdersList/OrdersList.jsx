// src/components/OrdersList/OrdersList.jsx
import React from 'react';
import { useShopContext } from '../../context/ShopContext.jsx';

const OrdersList = () => {
  const { orders, updateOrderStatus } = useShopContext();

  // Преобразуем объект orders в массив
  const ordersArray = Object.values(orders || {});

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    if (window.confirm(`Изменить статус заказа #${orderId} на "${newStatus}"?`)) {
      updateOrderStatus(orderId, newStatus);
    }
  };

  if (ordersArray.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Заказов пока нет</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">История заказов</h2>
      
      <div className="space-y-4">
        {ordersArray.map(order => (
          <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold">Заказ #{order.id}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(order.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="text-xs border rounded p-1"
                >
                  <option value="pending">Ожидание</option>
                  <option value="confirmed">Подтвержден</option>
                  <option value="shipped">Отправлен</option>
                  <option value="delivered">Доставлен</option>
                  <option value="cancelled">Отменен</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <h4 className="font-medium mb-2">Клиент:</h4>
              <p>{order.customer.name} - {order.customer.phone}</p>
              <p className="text-sm text-gray-600">{order.customer.address}</p>
            </div>

            <div className="mb-3">
              <h4 className="font-medium mb-2">Товары:</h4>
              {order.items.map(item => (
                <div key={`${item.id}-${item.size}`} className="flex justify-between text-sm mb-1">
                  <span>{item.title} ({item.size}) × {item.quantity}</span>
                  <span>{item.price * item.quantity} ₽</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center border-t pt-2">
              <span className="font-semibold">Итого: {order.total} ₽</span>
              <span className="text-sm text-gray-500">
                Оплата: {order.paymentMethod === 'card' ? 'Карта' : 'Наличные'}
              </span>
            </div>

            {order.comments && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                <strong>Комментарий:</strong> {order.comments}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersList;