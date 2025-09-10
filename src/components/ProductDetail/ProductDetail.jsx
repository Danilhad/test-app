// src/components/ProductDetail/ProductDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = ({ products }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    const foundProduct = products.find(p => p.id === parseInt(id));
    if (foundProduct) setProduct(foundProduct);
  }, [id, products]);

  if (!product) return <div>Товар не найден</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{product.title}</h2>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Изображение */}
        <div className="md:w-1/2">
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        {/* Информация */}
        <div className="md:w-1/2">
          <p className="text-gray-600 mb-4">{product.description}</p>
          
          {/* Размеры */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Доступные размеры:</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-lg transition-colors ${
                    selectedSize === size 
                      ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-black border-black' 
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Цена и кнопка */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary-600">
              {product.price.toLocaleString()} ₽
            </span>
            <button 
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              onClick={() => {
                // Добавьте логику добавления в корзину
                alert(`Добавлен ${product.title}, размер: ${selectedSize}`);
              }}
            >
              В корзину
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
