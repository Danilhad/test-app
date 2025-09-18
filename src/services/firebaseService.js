// src/services/firebaseService.js
import { 
  ref, 
  get, 
  set, 
  update, 
  onValue,
  off,
  push,
  serverTimestamp 
} from 'firebase/database';
import { db } from '../firebase/config';

const PRODUCTS_PATH = 'products';
const ORDERS_PATH = 'orders';
const OPERATIONS_PATH = 'operations';

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
        
        const products = Object.entries(productsData).map(([id, data]) => {
          // Преобразуем sizes из объекта в массив
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
          const products = Object.entries(productsData).map(([id, data]) => {
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
        updatedAt: Date.now()
      };
      
      await set(newOrderRef, orderWithTimestamp);
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

  addOperation: async (operationData) => {
    try {
      const operationsRef = ref(db, OPERATIONS_PATH);
      const newOperationRef = push(operationsRef);
      
      const operationWithTimestamp = {
        ...operationData,
        timestamp: Date.now()
      };
      
      await set(newOperationRef, operationWithTimestamp);
      return true;
    } catch (error) {
      console.error('Error adding operation:', error);
      throw error;
    }
  }
};

// Default export для обратной совместимости
export default {
  productsService,
  ordersService,
  operationsService
};