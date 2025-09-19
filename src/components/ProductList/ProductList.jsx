// src/components/ProductList/ProductList.jsx
import React from 'react';
import { useShopContext } from '../../context/ShopContext.jsx';
import ProductCard from './ProductCard/ProductCard.jsx';

const ProductList = () => {
  const { activeCategory, products, loading, error } = useShopContext();

  // Детальная отладочная информация
  console.log('📦 All products:', products);
  console.log('📦 Product categories:', products.map(p => ({ id: p.id, category: p.category, title: p.title })));
  console.log('📦 Active category:', activeCategory);

const safeProducts = Array.isArray(products) ? products : [];
console.log('📦 Product categories:', safeProducts.map(p => ({ id: p.id, category: p.category, title: p.title })));
  console.log('📦 Active category:', activeCategory);

  const filteredProducts = activeCategory === 'all' 
    ? safeProducts 
    : safeProducts.filter(product => product.category === activeCategory);

  console.log('📦 Filtered products:', filteredProducts);

  // Покажем все товары если filteredProducts пустой
  const displayProducts = filteredProducts.length > 0 ? filteredProducts : safeProducts;

  if (loading) {
    return <div className="text-white text-center py-8">Загрузка товаров...</div>;
  }

  if (error) {
    return <div className="text-red-400 text-center py-8">Ошибка: {error}</div>;
  }

  return (
    <div className="max-h-full overflow-y-auto pb-4 scrollbar-hide">
      {/* Информация о фильтрации */}
      <div className="bg-blue-500/20 p-3 rounded-lg mb-4 mx-4">
        <div className="text-white text-center">
          <p>Найдено товаров: {safeProducts.length}</p>
          <p>Отфильтровано: {filteredProducts.length}</p>
          <p>Активная категория: "{activeCategory}"</p>
          {filteredProducts.length === 0 && safeProducts.length > 0 && (
            <p className="text-yellow-300 mt-2">
              В категории "{activeCategory}" товаров не найдено. Показаны все товары.
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
        {displayProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product}
          />
        ))}
      </div>
      
      {displayProducts.length === 0 && (
        <div className="flex items-center justify-center h-64">
          <p className="text-white font-bold text-lg">Товары не найдены</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;