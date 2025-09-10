// src/components/Modals/SizeSelectorModal.jsx
import React from 'react';

const SizeSelectorModal = ({ product, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = React.useState('');   // ← Состояние для выбранного размера 
    const { addToCart } = useShopContext(); // ← Получаем функцию из контекста

  const handleAdd = () => {
    if (selectedSize) {
    const itemWithSize = { ...product, size: selectedSize };
      addToCart(itemWithSize); // ← Добавляем товар с размером в корзину
      onAddToCart(); // ← Вызываем колбэк для внешнего обновления
  //    onAddToCart({ ...product, size: selectedSize }); // ← Добавляем выбранный размер к товару
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6">
        <h2 className="text-xl font-bold mb-4">{product.title}</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Выберите размер:</label>
          <div className="flex space-x-2">
            {product.sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1 rounded-md border transition-colors ${
                  selectedSize === size 
                    ? 'border-primary-500 bg-primary-50 text-primary-600' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Отменить
          </button>
          <button
            onClick={handleAdd}
            disabled={!selectedSize}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeSelectorModal;
