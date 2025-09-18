// src/context/ShopContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  productsService, 
  ordersService, 
  operationsService 
} from '../services/firebaseService';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const ShopContext = createContext();

export const useShopContext = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShopContext must be used within a ShopProvider');
  }
  return context;
};

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
   const [activeCategory, setActiveCategory] = useState('all'); 
  
  // Добавляем отсутствующие состояния
  const [productSheet, setProductSheet] = useState({
    isOpen: false,
    product: null
  });
  const [showOrderView, setShowOrderView] = useState(false);

  // Загрузка товаров
  // Загрузка товаров
useEffect(() => {
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading products from Firebase...');
      
      const productsData = await productsService.getProducts();
      console.log('📦 Products loaded:', productsData);
      console.log('📦 Number of products:', productsData.length);
      
      if (productsData.length > 0) {
        console.log('📦 First product:', productsData[0]);
      }
      
      setProducts(productsData);
    } catch (err) {
      console.error('❌ Error loading products:', err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  loadProducts();

    // Подписка на обновления товаров
    const unsubscribeProducts = productsService.subscribeToProducts((updatedProducts) => {
    console.log('🔄 Products updated:', updatedProducts.length, 'items');
    setProducts(updatedProducts);
    setError(null);
  });

  return unsubscribeProducts;
}, []);

  // Загрузка заказов
  useEffect(() => {
  const loadOrders = async () => {
    try {
      console.log('🔄 Loading orders...');
      const ordersData = await ordersService.getOrders();
      setOrders(ordersData);
    } catch (err) {
      console.warn('⚠️ Error loading orders, using empty array:', err.message);
      setOrders([]);
    }
  };

  loadOrders();

  }, []);

  // Слушатель состояния аутентификации
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  // Функции для работы с товарами
  const updateProductQuantity = async (productId, size, newQuantity) => {
    try {
      await productsService.updateProductQuantity(productId, size, newQuantity);
      
      await operationsService.addOperation({
        action: 'update_quantity',
        productId,
        size,
        quantity: newQuantity,
        adminId: user?.uid || 'unknown'
      });
    } catch (error) {
      console.error('Error updating product quantity:', error);
      throw error;
    }
  };

  // Функции для работы с заказами
  const createOrder = async (orderData) => {
    try {
      const orderId = await ordersService.createOrder(orderData);
      
      await operationsService.addOperation({
        action: 'create_order',
        orderId,
        total: orderData.total,
        customer: orderData.customerName,
        adminId: user?.uid || 'unknown'
      });
      
      return orderId;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await ordersService.updateOrderStatus(orderId, status);
      
      await operationsService.addOperation({
        action: 'update_order_status',
        orderId,
        status,
        adminId: user?.uid || 'unknown'
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  // Функции для работы с модальными окнами
  const openProductSheet = (product) => {
    setProductSheet({
      isOpen: true,
      product: product
    });
  };

  const closeProductSheet = () => {
    setProductSheet({
      isOpen: false,
      product: null
    });
  };

  const toggleOrderView = () => {
    setShowOrderView(prev => !prev);
  };

  // Функция для проверки доступности размера
  const checkSizeAvailability = (productId, size) => {
    const product = products.find(p => p.id === productId);
    if (!product || !product.sizes) return false;
    
    const sizeItem = product.sizes.find(s => s.size === size);
    if (!sizeItem) return false;
    
    const availableQuantity = sizeItem.quantity - (sizeItem.reserved || 0);
    return availableQuantity > 0;
  };

  // Функция для добавления в корзину
  const addToCart = (item) => {
    // Здесь должна быть логика добавления в корзину
    console.log('Adding to cart:', item);
    // В реальном приложении здесь было бы обновление состояния корзины
  };

  const value = {
    products,
    orders,
    loading,
    error,
    user,
    activeCategory, // Добавлено
    productSheet,
    showOrderView,
    setActiveCategory, // Добавлено - это очень важно!
    updateProductQuantity,
    createOrder,
    updateOrderStatus,
    openProductSheet,
    closeProductSheet,
    toggleOrderView,
    checkSizeAvailability,
    addToCart
  };
  

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};