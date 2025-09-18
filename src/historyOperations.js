// src/historyOperations.js
export let historyOperations = [];

export const addOperation = (operation, products = []) => {
  let productName = '';
  
  if (operation.productId) {
    const product = products.find(p => p.id === operation.productId);
    productName = product ? product.title : `Товар #${operation.productId}`;
  }
  
  const newOperation = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 5), // Уникальный ID
    timestamp: new Date(),
    productName,
    ...operation
  };
  
  historyOperations.unshift(newOperation);
  
  // Сохраняем в localStorage
  localStorage.setItem('operations', JSON.stringify(historyOperations));
  
  return newOperation.id;
};

export const loadOperations = () => {
  const saved = localStorage.getItem('operations');
  if (saved) {
    try {
      historyOperations = JSON.parse(saved);
    } catch (error) {
      console.error('Error loading operations:', error);
      historyOperations = [];
    }
  }
};

// Загружаем операции при инициализации
if (typeof window !== 'undefined') {
  loadOperations();
}