// src/components/ProductDetail/ProductDetail.jsx
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShopContext } from '../../context/ShopContext';

const ProductDetail = React.memo(({ products }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useShopContext();
  const [selectedSize, setSelectedSize] = React.useState('');

  const product = useMemo(() => {
    const found = products.find(p => p.id === parseInt(id));
    return found || null;
  }, [id, products]);

  const handleAddToCart = () => {
    if (selectedSize && product) {
      addToCart({ 
        ...product, 
        size: selectedSize,
        quantity: 1 // Явно указываем quantity
      });
      navigate('/');
    }
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Товар не найден</p>
        <button 
          onClick={() => navigate('/')}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          На главную
        </button>
      </div>
    );
  }

  return (
    <div className="max-h-[calc(100vh-120px)] overflow-y-auto pb-20 scrollbar-hide sm:scrollbar-default">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{product.title}</h2>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <img 
              src={product.image} 
              alt={product.title} 
              className="w-full h-auto object-cover rounded-lg"
              loading="lazy"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
              }}
            />
          </div>

          <div className="md:w-1/2">
            <p className="text-gray-600 mb-4">{product.description}</p>
            
            <div className="mb-6">
  <h3 className="font-medium text-gray-700 mb-2">Доступные размеры:</h3>
  <div className="flex flex-wrap gap-2">
    {product.sizes?.map(sizeItem => (
      <button
        key={sizeItem.size}
        onClick={() => setSelectedSize(sizeItem.size)}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 border border-gray-200 hover:border-gray-300 transform hover:scale-105 ${
          selectedSize === sizeItem.size 
            ? 'bg-white text-black shadow-md' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {sizeItem.size}
      </button>
    ))}
  </div>
</div>

            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-blue-600">
                {product.price?.toLocaleString()} ₽
              </span>
              <button 
                className="py-2 sm:py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 whitespace-nowrap bg-gradient-to-r from-blue-500 to-blue-600 text-white border-2 border-blue-500 hover:border-blue-600 disabled:opacity-50"
                onClick={handleAddToCart}
                disabled={!selectedSize}
              >
                В корзину
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ProductDetail.displayName = 'ProductDetail';

export default ProductDetail;