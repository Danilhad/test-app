// src/services/firebaseService.js
import { 
  ref, 
  get, 
  set, 
  update, 
  onValue,
  off,
  push,
  serverTimestamp,
} from 'firebase/database';
import { db } from '../firebase/config';


const PRODUCTS_PATH = 'products';
const ORDERS_PATH = 'orders';
const OPERATIONS_PATH = 'operations';

const removeUndefinedFields = (obj) => {
  if (obj === null || obj === undefined) return null;
  if (typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj
      .map(item => removeUndefinedFields(item))
      .filter(item => item !== null && item !== undefined);
  }
  
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    const cleanedValue = removeUndefinedFields(value);
    if (cleanedValue !== null && cleanedValue !== undefined) {
      cleaned[key] = cleanedValue;
    }
  }
  
  return Object.keys(cleaned).length > 0 ? cleaned : null;
};


// Демо-данные товаров
const DEMO_PRODUCTS = [
  {
    id: 'demo-1',
    title: 'Футболка Premium',
    description: 'Мягкая хлопковая футболка премиум-качества',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300',
    sizes: [
      { size: 'S', quantity: 5, reserved: 0 },
      { size: 'M', quantity: 3, reserved: 0 },
      { size: 'L', quantity: 2, reserved: 0 },
      { size: 'XL', quantity: 0, reserved: 0 }
    ],
    category: 't-shirts'
  }
];

export const productsService = {
  getProducts: async () => {
  try {
    const snapshot = await get(ref(db, PRODUCTS_PATH));
    if (snapshot.exists()) {
      const productsData = snapshot.val();
      console.log('🔥 Raw products data from Firebase:', productsData);
      
      let products = [];
      
      if (Array.isArray(productsData)) {
        // ФИЛЬТРУЕМ пустые элементы
        products = productsData
          .filter(item => item && typeof item === 'object' && Object.keys(item).length > 0)
          .map((data, index) => ({
            id: data.id || `auto-${index}`,
            title: data.title || 'Без названия',
            price: data.price || 0,
            category: data.category || 'other',
            image: data.image || '',
            description: data.description || '',
            sizes: data.sizes || []
          }));
      } else if (typeof productsData === 'object' && productsData !== null) {
        products = Object.entries(productsData).map(([id, data]) => {
          const sizes = data.sizes ? Object.entries(data.sizes).map(([size, sizeData]) => ({
            size,
            quantity: sizeData.quantity || 0,
            reserved: sizeData.reserved || 0
          })) : [];
          
          return {
            id,
            title: data.title || 'Без названия',
            price: data.price || 0,
            category: data.category || 'other',
            image: data.image || '',
            description: data.description || '',
            sizes: sizes
          };
        });
      }
      
      console.log('✅ Processed products:', products);
      return products;
    }
    console.log('📦 No products found in database, using demo data');
    return DEMO_PRODUCTS;
  } catch (error) {
    console.error('❌ Error getting products, using demo data:', error);
    return DEMO_PRODUCTS;
  }
},

  subscribeToProducts: (callback) => {
  try {
    const productsRef = ref(db, PRODUCTS_PATH);
    
    const unsubscribe = onValue(productsRef, (snapshot) => {
      if (snapshot.exists()) {
        const productsData = snapshot.val();
        let products = [];
        
        if (Array.isArray(productsData)) {
          products = productsData.map((data, index) => ({
            id: data.id || `auto-${index}`,
            title: data.title || 'Без названия',
            price: data.price || 0,
            category: data.category || 'other',
            image: data.image || '',
            description: data.description || '',
            sizes: data.sizes || []
          }));
        } else if (typeof productsData === 'object' && productsData !== null) {
          products = Object.entries(productsData).map(([id, data]) => {
            const sizes = data.sizes ? Object.entries(data.sizes).map(([size, sizeData]) => ({
              size,
              quantity: sizeData.quantity || 0,
              reserved: sizeData.reserved || 0
            })) : [];
            
            return {
              id,
              title: data.title || 'Без названия',
              price: data.price || 0,
              category: data.category || 'other',
              image: data.image || '',
              description: data.description || '',
              sizes: sizes
            };
          });
        }
        
        callback(products);
      } else {
        console.log('📦 No products in database, using demo data');
        callback(DEMO_PRODUCTS);
      }
    }, (error) => {
      console.error('❌ Error subscribing to products:', error);
      callback(DEMO_PRODUCTS);
    });

    return () => off(productsRef, 'value', unsubscribe);
  } catch (error) {
    console.error('❌ Error setting up products subscription:', error);
    callback(DEMO_PRODUCTS);
    return () => {};
  }
},

updateProduct: async (productId, productData) => {
    try {
      const productRef = ref(db, `${PRODUCTS_PATH}/${productId}`);
      await set(productRef, productData);
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  addProduct: async (productData) => {
    try {
      const productsRef = ref(db, PRODUCTS_PATH);
      const newProductRef = push(productsRef);
      
      const productWithId = {
        ...productData,
        id: newProductRef.key
      };
      
      await set(newProductRef, productWithId);
      return newProductRef.key;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  deleteProduct: async (productId) => {
    try {
      const productRef = ref(db, `${PRODUCTS_PATH}/${productId}`);
      await set(productRef, null);
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  updateProductQuantity: async (productId, size, newQuantity) => {
    try {
      const updates = {};
      updates[`${PRODUCTS_PATH}/${productId}/sizes/${size}/quantity`] = newQuantity;
      await update(ref(db), updates);
      return true;
    } catch (error) {
      console.error('Error updating product quantity:', error);
      return false;
    }
  }
};

export const ordersService = {
  getOrders: async () => {
    try {
      const snapshot = await get(ref(db, ORDERS_PATH));
      if (snapshot.exists()) {
        const ordersData = snapshot.val();
        return Object.entries(ordersData).map(([id, data]) => ({
          id,
          ...data
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting orders:', error);
      return [];
    }
  },

  createOrder: async (orderData) => {
  try {
    const ordersRef = ref(db, ORDERS_PATH);
    const newOrderRef = push(ordersRef);
    
    const orderWithTimestamp = {
      ...orderData,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: 'pending' // добавляем статус по умолчанию
    };
    
    // Очищаем от undefined перед сохранением
    const cleanOrder = removeUndefinedFields(orderWithTimestamp);
    
    await set(newOrderRef, cleanOrder);
    return newOrderRef.key;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
},

  updateOrderStatus: async (orderId, status) => {
    try {
      const updates = {};
      updates[`${ORDERS_PATH}/${orderId}/status`] = status;
      updates[`${ORDERS_PATH}/${orderId}/updatedAt`] = Date.now();
      await update(ref(db), updates);
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
};

export const operationsService = {
  getOperations: async () => {
    try {
      const snapshot = await get(ref(db, OPERATIONS_PATH));
      if (snapshot.exists()) {
        const operationsData = snapshot.val();
        return Object.entries(operationsData).map(([id, data]) => ({
          id,
          ...data
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting operations:', error);
      return [];
    }
  },

  subscribeToOperations: (callback) => {
    try {
      const operationsRef = ref(db, OPERATIONS_PATH);
      
      const unsubscribe = onValue(operationsRef, (snapshot) => {
        if (snapshot.exists()) {
          const operationsData = snapshot.val();
          const operations = Object.entries(operationsData).map(([id, data]) => ({
            id,
            ...data
          }));
          callback(operations);
        } else {
          callback([]);
        }
      }, (error) => {
        console.error('Error subscribing to operations:', error);
        callback([]);
      });

      return () => off(operationsRef, 'value', unsubscribe);
    } catch (error) {
      console.error('Error setting up operations subscription:', error);
      callback([]);
      return () => {};
    }
  },

  // Универсальный метод для добавления операции
  addOperation: async (operationData) => {
    try {
      const operationsRef = ref(db, OPERATIONS_PATH);
      const newOperationRef = push(operationsRef);
      
      // Стандартная структура операции
      const standardOperation = {
        // Основная информация
        id: newOperationRef.key,
        type: operationData.type || 'system', // inventory, order, system, user
        action: operationData.action || 'unknown_action',
        timestamp: Date.now(),
        timestampReadable: new Date().toISOString(),
        
        // Информация об исполнителе
        performer: {
          id: operationData.performerId || 'unknown',
          type: operationData.performerType || 'system', // admin, user, system
          name: operationData.performerName || 'Unknown'
        },
        
        // Целевой объект операции
        target: {
          type: operationData.targetType || '', // product, order, user
          id: operationData.targetId || '',
          name: operationData.targetName || ''
        },
        
        // Изменения
        changes: operationData.changes || {},
        
        // Дополнительная информация
        details: operationData.details || '',
        status: operationData.status || 'success', // success, warning, error
        ip: operationData.ip || '',
        userAgent: operationData.userAgent || '',
        
        // Контекст операции
        context: {
          appVersion: '1.0.0',
          platform: typeof window !== 'undefined' ? 'web' : 'server',
          ...operationData.context
        }
      };

      await set(newOperationRef, standardOperation);
      return newOperationRef.key;
    } catch (error) {
      console.error('Error adding operation:', error);
      throw error;
    }
  },

  // Специализированные методы для разных типов операций

  // === ИНВЕНТАРИЗАЦИЯ ===
  logInventoryUpdate: async (productId, productName, changes, performerId, performerName = 'Admin') => {
    return operationsService.addOperation({
      type: 'inventory',
      action: 'inventory_update',
      performerId,
      performerType: 'admin',
      performerName,
      targetType: 'product',
      targetId: productId,
      targetName: productName,
      changes,
      details: `Обновление инвентаря: ${productName}`,
      status: 'success'
    });
  },

  logQuantityUpdate: async (productId, productName, size, oldQuantity, newQuantity, performerId, performerName = 'Admin') => {
    return operationsService.logInventoryUpdate(
      productId,
      productName,
      {
        field: 'quantity',
        size: size,
        oldValue: oldQuantity,
        newValue: newQuantity,
        delta: newQuantity - oldQuantity
      },
      performerId,
      performerName
    );
  },

  logProductCreate: async (productId, productName, productData, performerId, performerName = 'Admin') => {
    return operationsService.addOperation({
      type: 'inventory',
      action: 'product_create',
      performerId,
      performerType: 'admin',
      performerName,
      targetType: 'product',
      targetId: productId,
      targetName: productName,
      changes: {
        created: productData
      },
      details: `Создан новый товар: ${productName}`,
      status: 'success'
    });
  },

  logProductUpdate: async (productId, productName, changes, performerId, performerName = 'Admin') => {
    return operationsService.addOperation({
      type: 'inventory',
      action: 'product_update',
      performerId,
      performerType: 'admin',
      performerName,
      targetType: 'product',
      targetId: productId,
      targetName: productName,
      changes,
      details: `Обновлен товар: ${productName}`,
      status: 'success'
    });
  },

  logProductDelete: async (productId, productName, performerId, performerName = 'Admin') => {
    return operationsService.addOperation({
      type: 'inventory',
      action: 'product_delete',
      performerId,
      performerType: 'admin',
      performerName,
      targetType: 'product',
      targetId: productId,
      targetName: productName,
      details: `Удален товар: ${productName}`,
      status: 'success'
    });
  },

  // === ЗАКАЗЫ ===
  logOrderCreate: async (orderId, orderData, performerId, performerName = 'Customer') => {
    return operationsService.addOperation({
      type: 'order',
      action: 'order_create',
      performerId,
      performerType: 'user',
      performerName,
      targetType: 'order',
      targetId: orderId,
      targetName: `Заказ #${orderId}`,
      changes: {
        created: {
          total: orderData.total,
          items: orderData.items?.length || 0,
          customer: orderData.customer?.name || 'Unknown'
        }
      },
      details: `Создан новый заказ #${orderId}`,
      status: 'success'
    });
  },

  logOrderStatusChange: async (orderId, oldStatus, newStatus, performerId, performerName = 'Admin') => {
    return operationsService.addOperation({
      type: 'order',
      action: 'order_status_update',
      performerId,
      performerType: 'admin',
      performerName,
      targetType: 'order',
      targetId: orderId,
      targetName: `Заказ #${orderId}`,
      changes: {
        status: {
          old: oldStatus,
          new: newStatus
        }
      },
      details: `Статус заказа #${orderId} изменен с "${oldStatus}" на "${newStatus}"`,
      status: 'success'
    });
  },

  logOrderCancel: async (orderId, reason, performerId, performerName = 'Admin') => {
    return operationsService.addOperation({
      type: 'order',
      action: 'order_cancel',
      performerId,
      performerType: 'admin',
      performerName,
      targetType: 'order',
      targetId: orderId,
      targetName: `Заказ #${orderId}`,
      changes: {
        cancelled: {
          reason: reason,
          timestamp: Date.now()
        }
      },
      details: `Заказ #${orderId} отменен: ${reason}`,
      status: 'success'
    });
  },

  logOrderComplete: async (orderId, total, performerId, performerName = 'Admin') => {
    return operationsService.addOperation({
      type: 'order',
      action: 'order_complete',
      performerId,
      performerType: 'admin',
      performerName,
      targetType: 'order',
      targetId: orderId,
      targetName: `Заказ #${orderId}`,
      changes: {
        completed: {
          total: total,
          timestamp: Date.now()
        }
      },
      details: `Заказ #${orderId} завершен на сумму ${total} руб.`,
      status: 'success'
    });
  },

  // === СИСТЕМНЫЕ ОПЕРАЦИИ ===
  logSystemError: async (errorMessage, component, details = {}) => {
    return operationsService.addOperation({
      type: 'system',
      action: 'system_error',
      performerType: 'system',
      performerName: 'System',
      targetType: 'system',
      changes: {
        error: errorMessage,
        component: component,
        ...details
      },
      details: `Системная ошибка: ${errorMessage}`,
      status: 'error'
    });
  },

  logUserLogin: async (userId, userName, userData) => {
    return operationsService.addOperation({
      type: 'user',
      action: 'user_login',
      performerId: userId,
      performerType: 'user',
      performerName: userName,
      targetType: 'user',
      targetId: userId,
      targetName: userName,
      details: `Пользователь ${userName} вошел в систему`,
      status: 'success',
      context: {
        userData: userData
      }
    });
  },

  logAdminAction: async (action, target, details, performerId, performerName = 'Admin') => {
    return operationsService.addOperation({
      type: 'admin',
      action: action,
      performerId,
      performerType: 'admin',
      performerName,
      targetType: target.type || 'system',
      targetId: target.id || '',
      targetName: target.name || '',
      changes: target.changes || {},
      details: details,
      status: 'success'
    });
  }
};
// Default export для обратной совместимости
export default {
  productsService,
  ordersService,
  operationsService
};