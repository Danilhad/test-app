// src/components/ProductDetail/ProductDetail.jsx
import React, { useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { useShopContext } from '../../context/ShopContext';
import { useNavigate } from 'react-router-dom';

const ProductDetail = ({ products }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const {addToCart} = useShopContext(); // ← Получаем функцию из контекста
  const [selectedSize, setSelectedSize] = useState('');
  
  useEffect(() => {
    const foundProduct = products.find(p => p.id === parseInt(id));
    if (foundProduct) setProduct(foundProduct);
  }, [id, products]);

  if (!product) return <div>Товар не найден</div>;

  return (
    <div className="max-h-[calc(100vh-120px)] overflow-y-auto pb-20 scrollbar-hide sm:scrollbar-default"> {/* ← Добавляем стили для скролла в мобильных устройствах */}
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
        className={`
          px-4 py-2 rounded-lg font-medium transition-all duration-300 
          ${selectedSize === size 
            ? 'bg-gradient-to-r bg-white text-black shadow-md' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} 
          border border-gray-200 hover:border-gray-300
          transform hover:scale-105
        `}
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
              className=' py-2 sm:py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 whitespace-nowrap bg-gradient-to-r from-primary-500 to-primary-600 text-black border-2 border-primary-500 hover:border-primary-600'
              onClick={() => {
                // Добавьте логику добавления в корзину
                // Внутри функции handleAdd в SizeSelectorModal.jsx
if (selectedSize) {
  const itemWithSize = { ...product, size: selectedSize };
  addToCart(itemWithSize); // Добавляем товар с размером в корзину
  navigate('/')
}

              }}
            >
              В корзину
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProductDetail;
