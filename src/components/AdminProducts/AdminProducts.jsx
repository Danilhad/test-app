// src/components/AdminProducts/AdminProducts.jsx
// src/components/AdminProducts/AdminProducts.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShopContext } from '../../context/ShopContext.jsx';
import { productsService } from '../../services/firebaseService';

const AdminProducts = () => {
  const navigate = useNavigate();
  const { products, updateProductQuantity, user, loading: contextLoading } = useShopContext();
  const [loading, setLoading] = useState(true);

  // Проверка авторизации и прав админа
  useEffect(() => {
    if (!contextLoading) {
      if (!user || user.email !== 'admin@example.com') {
        navigate('/');
        return;
      }
      setLoading(false);
    }
  }, [user, contextLoading, navigate]);

  if (contextLoading || loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!user || user.email !== 'admin@example.com') {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>⛔ Доступ запрещен</p>
          <p className="text-sm">У вас нет прав для доступа к этой странице</p>
        </div>
      </div>
    );
  }


  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Загрузка товаров...</div>
      </div>
    );
  }

  // Обработчик редактирования товара
  const handleEdit = (product) => {
    let sizes = [];
    if (product.sizes && product.sizes.length > 0) {
      if (typeof product.sizes[0] === 'string') {
        sizes = product.sizes.map(size => ({
          size: size,
          quantity: product.quantity || 0,
          reserved: product.reserved || 0
        }));
      } else {
        sizes = product.sizes;
      }
    }

    setEditingProduct(product);
    setProductForm({
      title: product.title,
      price: product.price.toString(),
      description: product.description || '',
      image: product.image,
      category: product.category || '',
      sizes: sizes
    });
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
    }
  };

  // Удаление размера
  const removeSize = (index) => {
    setProductForm(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  // Обновление количества размера
  const updateSizeQuantity = (index, newQuantity) => {
    setProductForm(prev => ({
      ...prev,
      sizes: prev.sizes.map((sizeItem, i) => 
        i === index ? { ...sizeItem, quantity: parseInt(newQuantity) || 0 } : sizeItem
      )
    }));
  };

  // Сохранение изменений
  const handleSave = async () => {
    if (editingProduct) {
      try {
        const updatedProduct = {
          ...editingProduct,
          title: productForm.title,
          price: parseFloat(productForm.price),
          description: productForm.description,
          image: productForm.image,
          category: productForm.category,
          sizes: productForm.sizes.filter(size => size.size && size.quantity >= 0)
        };

        await productsService.updateProduct(editingProduct.id, updatedProduct);
        setEditingProduct(null);
        resetForm();
        
        alert('Товар успешно обновлен!');
      } catch (error) {
        console.error('Error updating product:', error);
        alert('Ошибка при обновлении товара');
      }
    }
  };

  // Добавление нового товара
  const handleAddNew = async () => {
    try {
      const newProduct = {
        title: productForm.title,
        price: parseFloat(productForm.price),
        description: productForm.description,
        image: productForm.image,
        category: productForm.category,
        sizes: productForm.sizes.filter(size => size.size && size.quantity >= 0)
      };
      
      await productsService.addProduct(newProduct);
      resetForm();
      
      alert('Товар успешно добавлен!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Ошибка при добавлении товара');
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
  const handleDelete = async (productId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      try {
        await productsService.deleteProduct(productId);
        alert('Товар успешно удален!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Ошибка при удалении товара');
      }
    }
  };

  // Быстрое обновление количества
  const quickUpdateQuantity = async (productId, size, currentQuantity) => {
    const newQuantity = prompt(`Введите новое количество для размера ${size}:`, currentQuantity);
    if (newQuantity !== null && !isNaN(newQuantity)) {
      try {
        await updateProductQuantity(productId, size, parseInt(newQuantity), user.uid);
        alert('Количество обновлено!');
      } catch (error) {
        console.error('Error updating quantity:', error);
        alert('Ошибка при обновлении количества');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen">
      {/* Эффект жидкого стекла для фона */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_70%)]"></div>
      
      <div className="relative z-10">
        {/* Заголовок и навигация */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white drop-shadow-sm">📋 Управление товарами</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate('/admin/history')}
              className="
                px-4 py-2 rounded
                bg-white/10 backdrop-blur-md
                border border-white/20 border-b-white/40 border-r-white/40
                text-white hover:bg-white/15
                transition-all duration-300 transform hover:scale-105
              "
            >
              📊 История
            </button>
            <button
              onClick={() => navigate('/')}
              className="
                px-4 py-2 rounded
                bg-white/10 backdrop-blur-md
                border border-white/20 border-b-white/40 border-r-white/40
                text-white hover:bg-white/15
                transition-all duration-300 transform hover:scale-105
              "
            >
              ← На главную
            </button>
          </div>
        </div>

        {/* Форма редактирования/добавления */}
        <div className="
          p-6 rounded-2xl mb-6
          bg-white/10 backdrop-blur-2xl
          border border-white/20 border-b-white/40 border-r-white/40
          shadow-2xl
        ">
          <h2 className="text-xl font-semibold mb-4 text-white">
            {editingProduct ? '✏️ Редактирование товара' : '➕ Добавить новый товар'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Название товара"
              value={productForm.title}
              onChange={(e) => setProductForm({...productForm, title: e.target.value})}
              className="
                p-3 rounded-xl
                bg-white/10 backdrop-blur-md
                border border-white/20 border-b-white/40 border-r-white/40
                text-white placeholder-white/60
                focus:outline-none focus:ring-2 focus:ring-white/30
              "
            />
            <input
              type="number"
              placeholder="Цена"
              value={productForm.price}
              onChange={(e) => setProductForm({...productForm, price: e.target.value})}
              className="
                p-3 rounded-xl
                bg-white/10 backdrop-blur-md
                border border-white/20 border-b-white/40 border-r-white/40
                text-white placeholder-white/60
                focus:outline-none focus:ring-2 focus:ring-white/30
              "
            />
            <input
              type="text"
              placeholder="URL изображения"
              value={productForm.image}
              onChange={(e) => setProductForm({...productForm, image: e.target.value})}
              className="
                p-3 rounded-xl
                bg-white/10 backdrop-blur-md
                border border-white/20 border-b-white/40 border-r-white/40
                text-white placeholder-white/60
                focus:outline-none focus:ring-2 focus:ring-white/30
              "
            />
            <input
              type="text"
              placeholder="Категория"
              value={productForm.category}
              onChange={(e) => setProductForm({...productForm, category: e.target.value})}
              className="
                p-3 rounded-xl
                bg-white/10 backdrop-blur-md
                border border-white/20 border-b-white/40 border-r-white/40
                text-white placeholder-white/60
                focus:outline-none focus:ring-2 focus:ring-white/30
              "
            />
          </div>
          
          <textarea
            placeholder="Описание товара"
            value={productForm.description}
            onChange={(e) => setProductForm({...productForm, description: e.target.value})}
            className="
              p-3 rounded-xl w-full mb-4
              bg-white/10 backdrop-blur-md
              border border-white/20 border-b-white/40 border-r-white/40
              text-white placeholder-white/60
              focus:outline-none focus:ring-2 focus:ring-white/30
            "
            rows={3}
          />

          {/* Управление размерами */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-3">📏 Размеры и количество</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <input
                type="text"
                placeholder="Размер (например: S, M, 42)"
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                className="
                  p-3 rounded-xl
                  bg-white/10 backdrop-blur-md
                  border border-white/20 border-b-white/40 border-r-white/40
                  text-white placeholder-white/60
                  focus:outline-none focus:ring-2 focus:ring-white/30
                "
              />
              <input
                type="number"
                placeholder="Количество"
                value={quantityInput}
                onChange={(e) => setQuantityInput(e.target.value)}
                className="
                  p-3 rounded-xl
                  bg-white/10 backdrop-blur-md
                  border border-white/20 border-b-white/40 border-r-white/40
                  text-white placeholder-white/60
                  focus:outline-none focus:ring-2 focus:ring-white/30
                "
              />
              <button
                onClick={addSize}
                className="
                  p-3 rounded-xl
                  bg-green-500/80 backdrop-blur-md
                  border border-white/20 border-b-white/40 border-r-white/40
                  text-white hover:bg-green-500
                  transition-all duration-300
                "
              >
                ➕ Добавить размер
              </button>
            </div>

            {/* Список размеров */}
            <div className="space-y-2">
              {productForm.sizes.map((sizeItem, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-white/5 rounded-lg">
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
                    onChange={(e) => updateSizeQuantity(index, e.target.value)}
                    className="
                      p-2 rounded-lg w-20
                      bg-white/10 backdrop-blur-md
                      border border-white/20
                      text-white text-center
                    "
                  />
                  <span className="text-white/70">шт.</span>
                  <button
                    onClick={() => removeSize(index)}
                    className="
                      p-1 rounded-lg
                      bg-red-500/80
                      text-white hover:bg-red-500
                      transition-all duration-300
                    "
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>

            {productForm.sizes.length === 0 && (
              <div className="text-center text-white/60 py-4">
                Нет добавленных размеров
              </div>
            )}

            <button
              onClick={() => {
                setProductForm(prev => ({
                  ...prev,
                  sizes: [...prev.sizes, { size: '', quantity: 0 }]
                }));
              }}
              className="
                p-2 rounded-xl w-full mt-2
                bg-blue-500/50 backdrop-blur-md
                border border-white/20
                text-white hover:bg-blue-500/70
                transition-all duration-300
              "
            >
              + Добавить поле размера
            </button>
          </div>

          {/* Кнопки сохранения/добавления */}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={editingProduct ? handleSave : handleAddNew}
              className="
                px-4 py-2 rounded-lg
                bg-blue-500/80 backdrop-blur-md
                border border-white/20
                text-white hover:bg-blue-500
                transition-all duration-300
              "
            >
              {editingProduct ? '💾 Сохранить' : '➕ Добавить'}
            </button>
            {editingProduct && (
              <button
                onClick={resetForm}
                className="
                  px-4 py-2 rounded-lg
                  bg-gray-500/80 backdrop-blur-md
                  border border-white/20
                  text-white hover:bg-gray-500
                  transition-all duration-300
                "
              >
                🔄 Сбросить
              </button>
            )}
          </div>
        </div>

        {/* Список товаров */}
        <div className="
          p-6 rounded-2xl
          bg-white/10 backdrop-blur-2xl
          border border-white/20 border-b-white/40 border-r-white/40
          shadow-2xl
        ">
          <h2 className="text-xl font-semibold mb-4 text-white">
            📦 Список товаров ({products.length})
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-white/10 backdrop-blur-md">
                  <th className="px-4 py-3 text-left text-white font-semibold">Фото</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Название</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Цена</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Размеры</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Действия</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-white/20">
                    <td className="px-4 py-3">
                      <img 
                        src={product.image} 
                        alt={product.title} 
                        className="w-12 h-12 object-cover rounded-xl border border-white/20"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-white">{product.title}</td>
                    <td className="px-4 py-3 text-white">{product.price} руб.</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {product.sizes?.map((sizeItem, index) => {
                          const size = typeof sizeItem === 'string' ? sizeItem : sizeItem.size;
                          const quantity = typeof sizeItem === 'string' ? product.quantity : sizeItem.quantity;
                          
                          return (
                            <div
                              key={index}
                              onClick={() => quickUpdateQuantity(product.id, size, quantity)}
                              className="
                                px-2 py-1 rounded-lg cursor-pointer
                                bg-white/10 backdrop-blur-md
                                border border-white/20
                                text-white text-xs
                                hover:bg-white/20 transition-colors
                                flex items-center space-x-1
                              "
                              title="Кликните для изменения количества"
                            >
                              <span className="font-medium">{size}</span>
                              <span className="text-green-400">({quantity})</span>
                            </div>
                          );
                        })}
                        
                        {(!product.sizes || product.sizes.length === 0) && (
                          <span className="text-white/50 text-xs">Нет размеров</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="
                            px-3 py-1 rounded-lg
                            bg-yellow-500/80 backdrop-blur-md
                            border border-white/20
                            text-white hover:bg-yellow-500
                            transition-all duration-300 transform hover:scale-110
                          "
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="
                            px-3 py-1 rounded-lg
                            bg-red-500/80 backdrop-blur-md
                            border border-white/20
                            text-white hover:bg-red-500
                            transition-all duration-300 transform hover:scale-110
                          "
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;