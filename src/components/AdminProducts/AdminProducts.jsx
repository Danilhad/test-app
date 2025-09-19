// src/components/AdminProducts/AdminProducts.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initDataState as _initDataState, useSignal } from '@telegram-apps/sdk-react';
import { useShopContext } from '../../context/ShopContext.jsx';
import { productsService, operationsService } from '../../services/firebaseService';

const AdminProducts = () => {
  const navigate = useNavigate();
  const { products, updateProductQuantity, refreshProducts } = useShopContext();
  const initDataState = useSignal(_initDataState);
  const telegramUser = initDataState?.user;
  
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ 
    title: '', 
    price: '', 
    description: '', 
    image: '', 
    category: '',
    sizes: []
  });
  const [sizeInput, setSizeInput] = useState('');
  const [quantityInput, setQuantityInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('products'); // products, add, edit
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notifications, setNotifications] = useState([]);

  // Добавление уведомления
  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Автоматическое удаление через 5 секунд
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, 5000);
  };

  // Проверка только по Telegram ID
  useEffect(() => {
    const isAdmin = telegramUser?.id === 1267434095;
    
    if (!isAdmin) {
      navigate('/');
      return;
    }
    setLoading(false);
  }, [telegramUser, navigate]);

  // Функция для нормализации размеров из разных форматов
  const normalizeSizes = (sizes) => {
    if (!sizes) return [];
    
    if (Array.isArray(sizes)) {
      return sizes.map(item => {
        if (typeof item === 'string') {
          return {
            size: item,
            quantity: 0,
            reserved: 0
          };
        }
        
        let quantityValue = item.quantity;
        if (quantityValue && typeof quantityValue === 'object') {
          quantityValue = quantityValue.quantity || 0;
        }
        
        return {
          size: item.size || item,
          quantity: quantityValue || 0,
          reserved: item.reserved || 0
        };
      });
    }
    
    if (typeof sizes === 'object' && sizes !== null) {
      return Object.entries(sizes).map(([size, data]) => {
        if (data && typeof data === 'object' && 'quantity' in data) {
          return {
            size,
            quantity: data.quantity || 0,
            reserved: data.reserved || 0
          };
        }
        
        return {
          size,
          quantity: data || 0,
          reserved: 0
        };
      });
    }
    
    return [];
  };

  // Получение уникальных категорий
  const categories = ['all', ...new Set(products.map(p => p.category || 'other').filter(Boolean))];

  // Фильтрация товаров
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!telegramUser || telegramUser.id !== 1267434095) {
    return null;
  }

  // Обработчик редактирования товара
  const handleEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      price: product.price.toString(),
      description: product.description || '',
      image: product.image,
      category: product.category || '',
      sizes: normalizeSizes(product.sizes)
    });
    setActiveTab('edit');
  };

  // Добавление размера
  const addSize = () => {
    if (sizeInput && quantityInput) {
      const newSize = {
        size: sizeInput,
        quantity: parseInt(quantityInput) || 0,
        reserved: 0
      };
      
      setProductForm(prev => ({
        ...prev,
        sizes: [...prev.sizes, newSize]
      }));
      
      setSizeInput('');
      setQuantityInput('');
      addNotification(`Размер ${sizeInput} добавлен`);
    }
  };

  // Удаление размера
  const removeSize = (index) => {
    const sizeToRemove = productForm.sizes[index];
    setProductForm(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
    addNotification(`Размер ${sizeToRemove.size} удален`);
  };

  // Сохранение изменений
  const handleSave = async () => {
    setSaving(true);
    try {
      const validSizes = productForm.sizes.filter(size => 
        size.size && size.size.trim() !== '' && size.quantity >= 0
      );

      const updatedProduct = {
        ...editingProduct,
        title: productForm.title,
        price: parseFloat(productForm.price),
        description: productForm.description,
        image: productForm.image,
        category: productForm.category,
        sizes: validSizes
      };

      await productsService.updateProduct(editingProduct.id, updatedProduct);
      
      await operationsService.logProductUpdate(
        editingProduct.id,
        productForm.title,
        {
          title: { old: editingProduct.title, new: productForm.title },
          price: { old: editingProduct.price, new: parseFloat(productForm.price) },
          description: { old: editingProduct.description, new: productForm.description }
        },
        telegramUser.id.toString(),
        telegramUser.first_name || 'Admin'
      );
      
      setEditingProduct(null);
      resetForm();
      setActiveTab('products');
      
      // Теперь refreshProducts должна работать правильно
      await refreshProducts();
      
      addNotification('Товар успешно обновлен! 🎉');
    } catch (error) {
      console.error('Ошибка при обновлении товара:', error);
      addNotification('Ошибка при обновлении товара', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Добавление нового товара
  const handleAddNew = async () => {
    setSaving(true);
    try {
      const validSizes = productForm.sizes.filter(size => 
        size.size && size.size.trim() !== '' && size.quantity >= 0
      );

      const newProduct = {
        title: productForm.title,
        price: parseFloat(productForm.price),
        description: productForm.description,
        image: productForm.image,
        category: productForm.category,
        sizes: validSizes
      };
      
      const productId = await productsService.addProduct(newProduct);
      
      await operationsService.logProductCreate(
        productId,
        productForm.title,
        newProduct,
        telegramUser.id.toString(),
        telegramUser.first_name || 'Admin'
      );
      
      resetForm();
      
      // Обновляем список товаров
      await refreshProducts();
      
      setActiveTab('products');
      
      addNotification('Товар успешно добавлен! 🎉');
    } catch (error) {
      console.error('Ошибка при добавлении товара:', error);
      addNotification('Ошибка при добавлении товара', 'error');
    } finally {
      setSaving(false);
    }
  };


  // Сброс формы
  const resetForm = () => {
    setProductForm({ 
      title: '', 
      price: '', 
      description: '', 
      image: '', 
      category: '',
      sizes: []
    });
    setSizeInput('');
    setQuantityInput('');
  };

  // Удаление товара
  const handleDelete = async (productId, productName) => {
    if (window.confirm(`Вы уверены, что хотите удалить товар "${productName}"?`)) {
      try {
        await productsService.deleteProduct(productId);
        
        await operationsService.logProductDelete(
          productId,
          productName,
          telegramUser.id.toString(),
          telegramUser.first_name || 'Admin'
        );
        
        refreshProducts();
        addNotification(`Товар "${productName}" удален`, 'warning');
      } catch (error) {
        console.error('Error deleting product:', error);
        addNotification('Ошибка при удалении товара', 'error');
      }
    }
  };

  // Быстрое обновление количества
  const quickUpdateQuantity = async (productId, size, currentQuantity, productName) => {
    const quantityValue = typeof currentQuantity === 'object' ? 
      currentQuantity.quantity || 0 : 
      currentQuantity;
    
    const newQuantity = prompt(`Введите новое количество для размера ${size} товара "${productName}":`, quantityValue);
    
    if (newQuantity !== null && !isNaN(newQuantity)) {
      try {
        const parsedNewQuantity = parseInt(newQuantity);
        
        await updateProductQuantity(
          productId, 
          size, 
          parsedNewQuantity, 
          telegramUser.id.toString()
        );
        
        await operationsService.logQuantityUpdate(
          productId,
          productName,
          size,
          quantityValue,
          parsedNewQuantity,
          telegramUser.id.toString(),
          telegramUser.first_name || 'Admin'
        );
        
        addNotification(`Количество размера ${size} обновлено!`);
      } catch (error) {
        console.error('Error updating quantity:', error);
        addNotification('Ошибка при обновлении количества', 'error');
      }
    }
  };

  // Компонент уведомлений
  const Notification = ({ message, type }) => (
    <div className={`
      p-3 rounded-xl mb-2 backdrop-blur-md border
      ${type === 'success' ? 'bg-green-500/20 border-green-400/30 text-green-200' : ''}
      ${type === 'error' ? 'bg-red-500/20 border-red-400/30 text-red-200' : ''}
      ${type === 'warning' ? 'bg-yellow-500/20 border-yellow-400/30 text-yellow-200' : ''}
      animate-slideIn
    `}>
      {message}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen">
      {/* Эффект жидкого стекла для фона */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_70%)]"></div>
      
      {/* Уведомления */}
      <div className="fixed top-4 right-4 z-50 max-w-sm">
        {notifications.map(notif => (
          <Notification key={notif.id} message={notif.message} type={notif.type} />
        ))}
      </div>

      <div className="relative z-10">
        {/* Заголовок и навигация */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white drop-shadow-sm">📦 Управление товарами</h1>
            <p className="text-white/60">Добро пожаловать, {telegramUser.first_name}!</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate('/admin/history')}
              className="
                px-4 py-2 rounded-lg
                bg-purple-500/80 backdrop-blur-md
                border border-white/20
                text-white hover:bg-purple-500
                transition-all duration-300 transform hover:scale-105
                flex items-center space-x-2
              "
            >
              <span>📊</span>
              <span>История</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="
                px-4 py-2 rounded-lg
                bg-blue-500/80 backdrop-blur-md
                border border-white/20
                text-white hover:bg-blue-500
                transition-all duration-300 transform hover:scale-105
                flex items-center space-x-2
              "
            >
              <span>🏠</span>
              <span>В магазин</span>
            </button>
          </div>
        </div>

        {/* Табы навигации */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`
              px-4 py-2 rounded-lg transition-all duration-300
              ${activeTab === 'products' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white/10 text-white/70 hover:bg-white/20'}
            `}
          >
            📋 Все товары ({products.length})
          </button>
          <button
            onClick={() => {
              setEditingProduct(null);
              resetForm();
              setActiveTab('add');
            }}
            className={`
              px-4 py-2 rounded-lg transition-all duration-300
              ${activeTab === 'add' 
                ? 'bg-green-500 text-white' 
                : 'bg-white/10 text-white/70 hover:bg-white/20'}
            `}
          >
            ➕ Новый товар
          </button>
        </div>

        {/* Форма добавления/редактирования */}
        {(activeTab === 'add' || activeTab === 'edit') && (
          <div className="
            p-6 rounded-2xl mb-6
            bg-white/10 backdrop-blur-2xl
            border border-white/20 border-b-white/40 border-r-white/40
            shadow-2xl
          ">
            <h2 className="text-xl font-semibold mb-4 text-white">
              {activeTab === 'edit' ? '✏️ Редактирование товара' : '➕ Добавить новый товар'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-white/80 mb-2">Название товара</label>
                <input
                  type="text"
                  placeholder="Например: Футболка Premium"
                  value={productForm.title}
                  onChange={(e) => setProductForm({...productForm, title: e.target.value})}
                  className="
                    p-3 rounded-xl w-full
                    bg-white/10 backdrop-blur-md
                    border border-white/20 border-b-white/40 border-r-white/40
                    text-white placeholder-white/60
                    focus:outline-none focus:ring-2 focus:ring-white/30
                  "
                />
              </div>
              <div>
                <label className="block text-white/80 mb-2">Цена (руб.)</label>
                <input
                  type="number"
                  placeholder="Например: 1999"
                  value={productForm.price}
                  onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                  className="
                    p-3 rounded-xl w-full
                    bg-white/10 backdrop-blur-md
                    border border-white/20 border-b-white/40 border-r-white/40
                    text-white placeholder-white/60
                    focus:outline-none focus:ring-2 focus:ring-white/30
                  "
                />
              </div>
              <div>
                <label className="block text-white/80 mb-2">URL изображения</label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={productForm.image}
                  onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                  className="
                    p-3 rounded-xl w-full
                    bg-white/10 backdrop-blur-md
                    border border-white/20 border-b-white/40 border-r-white/40
                    text-white placeholder-white/60
                    focus:outline-none focus:ring-2 focus:ring-white/30
                  "
                />
              </div>
              <div>
                <label className="block text-white/80 mb-2">Категория</label>
                <input
                  type="text"
                  placeholder="Например: t-shirts, hoodies"
                  value={productForm.category}
                  onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                  className="
                    p-3 rounded-xl w-full
                    bg-white/10 backdrop-blur-md
                    border border-white/20 border-b-white/40 border-r-white/40
                    text-white placeholder-white/60
                    focus:outline-none focus:ring-2 focus:ring-white/30
                  "
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-white/80 mb-2">Описание товара</label>
              <textarea
                placeholder="Опишите особенности товара..."
                value={productForm.description}
                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                className="
                  p-3 rounded-xl w-full
                  bg-white/10 backdrop-blur-md
                  border border-white/20 border-b-white/40 border-r-white/40
                  text-white placeholder-white/60
                  focus:outline-none focus:ring-2 focus:ring-white/30
                "
                rows={3}
              />
            </div>

            {/* Управление размерами */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-3">📏 Размеры и количество</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="block text-white/80 mb-2">Размер</label>
                  <input
                    type="text"
                    placeholder="S, M, L, XL..."
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    className="
                      p-3 rounded-xl w-full
                      bg-white/10 backdrop-blur-md
                      border border-white/20 border-b-white/40 border-r-white/40
                      text-white placeholder-white/60
                      focus:outline-none focus:ring-2 focus:ring-white/30
                    "
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-2">Количество</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={quantityInput}
                    onChange={(e) => setQuantityInput(e.target.value)}
                    className="
                      p-3 rounded-xl w-full
                      bg-white/10 backdrop-blur-md
                      border border-white/20 border-b-white/40 border-r-white/40
                      text-white placeholder-white/60
                      focus:outline-none focus:ring-2 focus:ring-white/30
                    "
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={addSize}
                    disabled={!sizeInput || !quantityInput}
                    className="
                      p-3 rounded-xl w-full
                      bg-green-500/80 backdrop-blur-md
                      border border-white/20 border-b-white/40 border-r-white/40
                      text-white hover:bg-green-500
                      transition-all duration-300
                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
                  >
                    ➕ Добавить размер
                  </button>
                </div>
              </div>

              {/* Список размеров */}
              <div className="space-y-2 mb-3">
                {productForm.sizes.map((sizeItem, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-white/5 rounded-lg">
                    <input
                      type="text"
                      value={sizeItem.size}
                      onChange={(e) => {
                        const newSizes = [...productForm.sizes];
                        newSizes[index].size = e.target.value;
                        setProductForm({...productForm, sizes: newSizes});
                      }}
                      placeholder="Размер"
                      className="
                        p-2 rounded-lg w-20
                        bg-white/10 backdrop-blur-md
                        border border-white/20
                        text-white text-center
                      "
                    />
                    <input
                      type="number"
                      value={sizeItem.quantity}
                      onChange={(e) => {
                        const newSizes = [...productForm.sizes];
                        newSizes[index].quantity = parseInt(e.target.value) || 0;
                        setProductForm({...productForm, sizes: newSizes});
                      }}
                      className="
                        p-2 rounded-lg w-20
                        bg-white/10 backdrop-blur-md
                        border border-white/20
                        text-white text-center
                      "
                    />
                    <span className="text-white/70 text-sm">шт.</span>
                    <button
                      onClick={() => removeSize(index)}
                      className="
                        p-2 rounded-lg
                        bg-red-500/80
                        text-white hover:bg-red-500
                        transition-all duration-300
                        flex items-center justify-center
                      "
                      title="Удалить размер"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>

              {productForm.sizes.length === 0 && (
                <div className="text-center text-white/60 py-4 bg-white/5 rounded-lg">
                  <div className="text-2xl mb-2">📏</div>
                  <p>Нет добавленных размеров</p>
                  <p className="text-sm">Добавьте размеры для отображения в магазине</p>
                </div>
              )}
            </div>

            {/* Кнопки сохранения/добавления */}
            <div className="flex space-x-4">
              <button
                onClick={activeTab === 'edit' ? handleSave : handleAddNew}
                disabled={saving || !productForm.title || !productForm.price}
                className="
                  px-6 py-3 rounded-lg
                  bg-blue-500/80 backdrop-blur-md
                  border border-white/20
                  text-white hover:bg-blue-500
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center space-x-2
                "
              >
                {saving ? '⏳' : activeTab === 'edit' ? '💾 Сохранить' : '➕ Добавить товар'}
                {saving && 'Сохраняем...'}
              </button>
              
              <button
                onClick={() => {
                  setActiveTab('products');
                  resetForm();
                  setEditingProduct(null);
                }}
                className="
                  px-4 py-3 rounded-lg
                  bg-gray-500/80 backdrop-blur-md
                  border border-white/20
                  text-white hover:bg-gray-500
                  transition-all duration-300
                  flex items-center space-x-2
                "
              >
                ↩️ Назад
              </button>
            </div>
          </div>
        )}

        {/* Список товаров */}
        {activeTab === 'products' && (
          <div className="
            p-6 rounded-2xl
            bg-white/10 backdrop-blur-2xl
            border border-white/20 border-b-white/40 border-r-white/40
            shadow-2xl
          ">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
              <h2 className="text-xl font-semibold text-white">
                📦 Список товаров ({filteredProducts.length})
              </h2>
              
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                {/* Поиск */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="🔍 Поиск товаров..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="
                      p-2 rounded-xl
                      bg-white/10 backdrop-blur-md
                      border border-white/20
                      text-white placeholder-white/60
                      focus:outline-none focus:ring-2 focus:ring-white/30
                      w-full md:w-64
                    "
                  />
                </div>
                
                {/* Фильтр по категории */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="
                    p-2 rounded-xl
                    bg-white/10 backdrop-blur-md
                    border border-white/20
                    text-white
                    focus:outline-none focus:ring-2 focus:ring-white/30
                  "
                >
                  <option value="all">Все категории</option>
                  {categories.filter(cat => cat !== 'all').map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-white text-xl mb-2">Товары не найдены</h3>
                <p className="text-white/60">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Попробуйте изменить параметры поиска' 
                    : 'Добавьте первый товар в систему'}
                </p>
                <button
                  onClick={() => setActiveTab('add')}
                  className="
                    mt-4 px-6 py-2 rounded-lg
                    bg-green-500/80 backdrop-blur-md
                    border border-white/20
                    text-white hover:bg-green-500
                    transition-all duration-300
                  "
                >
                  ➕ Добавить товар
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => {
                  const normalizedSizes = normalizeSizes(product.sizes);
                  const totalQuantity = normalizedSizes.reduce((sum, size) => sum + (size.quantity || 0), 0);
                  
                  return (
                    <div
                      key={product.id}
                      className="
                        p-4 rounded-xl
                        bg-white/5 backdrop-blur-md
                        border border-white/20
                        hover:bg-white/10
                        transition-all duration-300
                        transform hover:scale-105
                      "
                    >
                      <div className="flex items-start space-x-4 mb-3">
                        <img 
                          src={product.image} 
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded-xl border border-white/20"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80x80?text=📦';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold truncate">{product.title}</h3>
                          <p className="text-blue-300 font-bold">{product.price} руб.</p>
                          <p className="text-white/60 text-sm truncate">{product.category}</p>
                        </div>
                      </div>
                      
                      <p className="text-white/70 text-sm mb-3 line-clamp-2">
                        {product.description || 'Нет описания'}
                      </p>
                      
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/80 text-sm">Размеры:</span>
                          <span className="text-white/60 text-sm">Всего: {totalQuantity} шт.</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {normalizedSizes.map((sizeItem, index) => {
                            const quantityValue = typeof sizeItem.quantity === 'object' ? 
                              sizeItem.quantity.quantity || 0 : 
                              sizeItem.quantity;
                              
                            return (
                              <div
                                key={index}
                                onClick={() => quickUpdateQuantity(product.id, sizeItem.size, quantityValue, product.title)}
                                className={`
                                  px-2 py-1 rounded-lg cursor-pointer text-xs
                                  border transition-all duration-200
                                  ${quantityValue > 0 
                                    ? 'bg-green-500/20 border-green-400/30 text-green-300 hover:bg-green-500/30' 
                                    : 'bg-red-500/20 border-red-400/30 text-red-300 hover:bg-red-500/30'}
                                  flex items-center space-x-1
                                `}
                                title="Кликните для изменения количества"
                              >
                                <span className="font-medium">{sizeItem.size}</span>
                                <span>({quantityValue})</span>
                              </div>
                            );
                          })}
                          
                          {normalizedSizes.length === 0 && (
                            <span className="text-white/50 text-xs">Нет размеров</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="
                            flex-1 py-2 rounded-lg
                            bg-yellow-500/80 backdrop-blur-md
                            border border-white/20
                            text-white hover:bg-yellow-500
                            transition-all duration-300
                            flex items-center justify-center space-x-1
                          "
                        >
                          <span>✏️</span>
                          <span className="text-sm">Редактировать</span>
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.title)}
                          className="
                            px-3 py-2 rounded-lg
                            bg-red-500/80 backdrop-blur-md
                            border border-white/20
                            text-white hover:bg-red-500
                            transition-all duration-300
                            flex items-center justify-center
                          "
                          title="Удалить товар"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;