// src/components/AdminHistory/AdminHistory.jsx
import React, { useState, useEffect } from 'react';
import { operationsService } from '../../services/firebaseService';
import { useShopContext } from '../../context/ShopContext.jsx';

const AdminHistory = () => {
  const { products } = useShopContext();
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, update_quantity, order, etc.

  useEffect(() => {
    const loadOperations = async () => {
      try {
        const ops = await operationsService.getOperations();
        // Сортируем по времени (новые сверху)
        const sortedOps = ops.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        setOperations(sortedOps);
      } catch (error) {
        console.error('Error loading operations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOperations();

    // Подписка на реальные обновления
    const unsubscribe = operationsService.subscribeToOperations((ops) => {
      const sortedOps = ops.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      setOperations(sortedOps);
    });
    
    return unsubscribe;
  }, []);

  // Фильтрация операций
  const filteredOperations = filter === 'all' 
    ? operations 
    : operations.filter(op => op.action === filter);

  // Форматирование даты
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Неизвестная дата';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Сегодня
      return `Сегодня в ${date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
      })}`;
    } else if (diffDays === 1) {
      // Вчера
      return `Вчера в ${date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
      })}`;
    } else if (diffDays < 7) {
      // На этой неделе
      const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
      return `${days[date.getDay()]} в ${date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
      })}`;
    } else {
      // Ранее
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // Получение иконки для типа операции
  const getOperationIcon = (action) => {
  switch (action) {
    case 'inventory_update':
    case 'quantity_update':
      return '📦';
    case 'order_create':
      return '🛒';
    case 'order_cancel':
      return '❌';
    case 'order_complete':
      return '✅';
    case 'product_create':
      return '➕';
    case 'product_delete':
      return '🗑️';
    case 'system_error':
      return '⚠️';
    default:
      return '📋';
  }
};

  // Получение названия типа операции
  const getOperationType = (action) => {
  const actionMap = {
    'inventory_update': 'Обновление инвентаря',
    'quantity_update': 'Изменение количества',
    'product_create': 'Создание товара',
    'product_update': 'Редактирование товара',
    'product_delete': 'Удаление товара',
    'order_create': 'Создание заказа',
    'order_status_update': 'Изменение статуса',
    'order_cancel': 'Отмена заказа',
    'order_complete': 'Завершение заказа',
    'user_login': 'Вход пользователя',
    'system_error': 'Системная ошибка'
  };
  return actionMap[action] || action;
};

  // Получение цвета для типа операции
  const getOperationColor = (action) => {
    switch (action) {
      case 'update_quantity':
        return 'bg-blue-500/20 text-blue-300';
      case 'create_order':
        return 'bg-green-500/20 text-green-300';
      case 'cancel_order':
        return 'bg-red-500/20 text-red-300';
      case 'complete_order':
        return 'bg-purple-500/20 text-purple-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  // Получение описания операции
  const getOperationDescription = (operation) => {
    switch (operation.action) {
      case 'update_quantity':
        return `Обновлено количество товаров`;
      case 'create_order':
        return `Создан новый заказ`;
      case 'cancel_order':
        return `Заказ отменен`;
      case 'complete_order':
        return `Заказ завершен`;
      default:
        return `Выполнена операция: ${operation.action}`;
    }
  };

  // Получение деталей операции
  const getOperationDetails = (operation) => {
    switch (operation.action) {
      case 'update_quantity':
        return operation.adminId && operation.adminId !== 'unknown' 
          ? `Администратор: ${operation.adminId}` 
          : 'Изменение количества товара';
      case 'create_order':
        return operation.total > 0 
          ? `Сумма: ${operation.total} руб.` 
          : 'Новый заказ создан';
      default:
        return operation.status 
          ? `Статус: ${operation.status}` 
          : 'Операция выполнена';
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Загрузка истории...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 min-h-screen">
      {/* Эффект жидкого стекла для фона */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_70%)]"></div>
      
      <div className="relative z-10">
        {/* Заголовок и навигация */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white drop-shadow-sm">📊 История операций</h1>
          <button
            onClick={() => window.history.back()}
            className="
              px-4 py-2 rounded
              bg-white/10 backdrop-blur-md
              border border-white/20 border-b-white/40 border-r-white/40
              text-white hover:bg-white/15
              transition-all duration-300 transform hover:scale-105
            "
          >
            ← Назад
          </button>
        </div>

        {/* Фильтры */}
        <div className="
          p-4 rounded-2xl mb-6
          bg-white/10 backdrop-blur-2xl
          border border-white/20 border-b-white/40 border-r-white/40
          shadow-2xl
        ">
          <h2 className="text-lg font-semibold mb-3 text-white">Фильтры</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filter === 'all' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              Все операции
            </button>
            <button
              onClick={() => setFilter('update_quantity')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filter === 'update_quantity' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              📦 Обновления
            </button>
            <button
              onClick={() => setFilter('create_order')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filter === 'create_order' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              🛒 Заказы
            </button>
          </div>
        </div>

        {/* Список операций */}
        <div className="
          rounded-2xl
          bg-white/10 backdrop-blur-2xl
          border border-white/20 border-b-white/40 border-r-white/40
          shadow-2xl
        ">
          <h2 className="text-xl font-semibold p-6 text-white border-b border-white/20">
            📋 Список операций ({filteredOperations.length})
          </h2>
          
          <div className="max-h-96 overflow-y-auto">
            {filteredOperations.length === 0 ? (
              <div className="text-center text-white/60 py-8">
                <div className="text-4xl mb-2">📭</div>
                <p>Нет операций для отображения</p>
                <p className="text-sm mt-1">Здесь будут появляться ваши действия в системе</p>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {filteredOperations.map((operation, index) => (
                  <div key={operation.id || index} className="p-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-start gap-3">
                      {/* Иконка операции */}
                      <div className="text-2xl mt-1">
                        {getOperationIcon(operation.action)}
                      </div>
                      
                      {/* Основное содержимое */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getOperationColor(operation.action)}`}>
                            {getOperationType(operation.action)}
                          </span>
                          <span className="text-white/60 text-sm">
                            {formatDate(operation.timestamp)}
                          </span>
                        </div>
                        
                        <p className="text-white font-medium mb-1">
                          {getOperationDescription(operation)}
                        </p>
                        
                        <p className="text-white/70 text-sm mb-2">
                          {getOperationDetails(operation)}
                        </p>
                        
                        {/* Дополнительная информация */}
                        <div className="flex flex-wrap gap-3 text-xs text-white/50">
                          {operation.adminId && operation.adminId !== 'unknown' && (
                            <span>👤 Админ: {operation.adminId}</span>
                          )}
                          {operation.orderId && (
                            <span>📋 Заказ: #{operation.orderId}</span>
                          )}
                          {operation.total > 0 && (
                            <span>💰 Сумма: {operation.total} руб.</span>
                          )}
                          {operation.status && (
                            <span>📊 Статус: {operation.status}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Статистика */}
        {operations.length > 0 && (
          <div className="
            p-4 rounded-2xl mt-6
            bg-white/10 backdrop-blur-2xl
            border border-white/20 border-b-white/40 border-r-white/40
            shadow-2xl
          ">
            <h3 className="text-lg font-semibold mb-3 text-white">📈 Статистика</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-xl bg-white/5">
                <div className="text-2xl">📋</div>
                <div className="text-white font-semibold">{operations.length}</div>
                <div className="text-white/60 text-sm">Всего операций</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/5">
                <div className="text-2xl">📦</div>
                <div className="text-white font-semibold">
                  {operations.filter(op => op.action === 'update_quantity').length}
                </div>
                <div className="text-white/60 text-sm">Обновлений</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/5">
                <div className="text-2xl">🛒</div>
                <div className="text-white font-semibold">
                  {operations.filter(op => op.action === 'create_order').length}
                </div>
                <div className="text-white/60 text-sm">Заказов</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/5">
                <div className="text-2xl">⏰</div>
                <div className="text-white font-semibold">
                  {formatDate(operations[0]?.timestamp)}
                </div>
                <div className="text-white/60 text-sm">Последняя операция</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHistory;