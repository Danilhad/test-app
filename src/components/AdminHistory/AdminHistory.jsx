// src/components/AdminHistory/AdminHistory.jsx
import React, { useState, useEffect } from 'react';
import { operationsService } from '../../services/firebaseService';
import { useShopContext } from '../../context/ShopContext.jsx';

const AdminHistory = () => {
  const { products } = useShopContext();
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOperations = async () => {
      try {
        const ops = await operationsService.getOperations();
        setOperations(ops);
      } catch (error) {
        console.error('Error loading operations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOperations();

    // Подписка на реальные обновления
    const unsubscribe = operationsService.subscribeToOperations(setOperations);
    return unsubscribe;
  }, []);

  // Функция для получения названия товара
  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.title : `Товар #${productId}`;
  };

  // Функция для форматирования даты
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Неизвестная дата';
    return new Date(timestamp?.toDate?.() || timestamp).toLocaleString('ru-RU');
  };

  // Функция для получения описания операции
  const getOperationDescription = (operation) => {
    switch (operation.action) {
      case 'reserve':
        return `Резервирование ${operation.quantity} шт. размера ${operation.size} (${getProductName(operation.productId)})`;
      case 'release':
        return `Освобождение ${operation.quantity} шт. размера ${operation.size} (${getProductName(operation.productId)})`;
      case 'update_quantity':
        return `Обновление количества размера ${operation.size} до ${operation.quantity} (${getProductName(operation.productId)})`;
      case 'create_order':
        return `Создан заказ #${operation.orderId} на сумму ${operation.total || 0} руб. (${operation.customer || 'Клиент'})`;
      case 'update_order_status':
        return `Статус заказа #${operation.orderId} изменен на "${operation.status}"`;
      default:
        return operation.details || 'Неизвестная операция';
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-white">Загрузка истории...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white drop-shadow-sm">📊 История операций</h1>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 rounded bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/15 transition-all"
          >
            ← Назад
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl">
          <h2 className="text-xl font-semibold mb-4 text-white">
            📋 Список операций ({operations.length})
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-white/10 backdrop-blur-md">
                  <th className="px-4 py-3 text-left text-white font-semibold">Дата</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Операция</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Детали</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">ID</th>
                </tr>
              </thead>
              <tbody>
                {operations.map((operation, index) => (
                  <tr key={operation.id || index} className="border-b border-white/20">
                    <td className="px-4 py-3 text-white/80 text-sm">
                      {formatDate(operation.timestamp)}
                    </td>
                    <td className="px-4 py-3 text-white font-medium">
                      {operation.action === 'reserve' && '📦 Резерв'}
                      {operation.action === 'release' && '🔄 Освобождение'}
                      {operation.action === 'update_quantity' && '✏️ Обновление'}
                      {operation.action === 'create_order' && '✅ Заказ'}
                      {operation.action === 'update_order_status' && '🔄 Статус'}
                      {!['reserve', 'release', 'update_quantity', 'create_order', 'update_order_status'].includes(operation.action) && '❓ Неизвестно'}
                    </td>
                    <td className="px-4 py-3 text-white/90">
                      {getOperationDescription(operation)}
                    </td>
                    <td className="px-4 py-3 text-white/60 text-sm">
                      {operation.productId && `Товар: ${operation.productId}`}
                      {operation.orderId && `Заказ: ${operation.orderId}`}
                      {operation.adminId && `Админ: ${operation.adminId}`}
                      {!operation.productId && !operation.orderId && !operation.adminId && '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {operations.length === 0 && (
            <div className="text-center text-white/60 py-8">
              Нет записей в истории операций
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHistory;