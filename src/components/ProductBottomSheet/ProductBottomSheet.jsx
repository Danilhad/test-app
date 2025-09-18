// src/components/ProductBottomSheet/ProductBottomSheet.jsx
import React, { useRef, useState, useEffect } from 'react';
import { useShopContext } from '../../context/ShopContext.jsx';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ProductBottomSheet = React.memo(({ product, onClose, isOpen = false }) => {
  const { addToCart, checkSizeAvailability } = useShopContext();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState('');
  const [showOutOfStockAlert, setShowOutOfStockAlert] = useState(false);
  const sheetRef = useRef(null);

  // Добавляем безопасный onClose
  const safeOnClose = () => {
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  // Упрощенная функция проверки доступности
  const getSizeAvailability = (sizeItem) => {
    if (!product) return { available: false, quantity: 0 };
    
    const available = checkSizeAvailability(product.id, sizeItem.size);
    const availableQuantity = sizeItem.quantity - (sizeItem.reserved || 0);
    
    return {
      available,
      quantity: availableQuantity,
      text: available ? `${availableQuantity} шт. в наличии` : 'Нет в наличии'
    };
  };

  const handleAddToCart = () => {
    if (!selectedSize || !product) return;

    // Находим выбранный размер
    const selectedSizeItem = product.sizes?.find(item => item.size === selectedSize);
    if (!selectedSizeItem) return;

    // Проверяем доступность
    const availability = getSizeAvailability(selectedSizeItem);
    if (!availability.available) {
      setShowOutOfStockAlert(true);
      setTimeout(() => setShowOutOfStockAlert(false), 2000);
      return;
    }

    addToCart({ 
      ...product, 
      size: selectedSize,
      quantity: 1
    });
    
    safeOnClose();
  };

  const handleViewDetails = () => {
    safeOnClose();
    navigate(`/product/${product.id}`);
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      safeOnClose();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sheetRef.current && !sheetRef.current.contains(event.target)) {
        safeOnClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, safeOnClose]);

  // Добавляем проверку на isOpen
  const shouldRender = Boolean(isOpen) && product;

  if (!shouldRender) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-40"
        onClick={safeOnClose}
      />
      
      {/* Alert для отсутствия товара */}
      <AnimatePresence>
        {showOutOfStockAlert && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
              ❌ Этот размер временно отсутствует в наличии
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        ref={sheetRef}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ 
          type: "spring",
          damping: 30,
          stiffness: 400
        }}
        className="fixed bottom-0 left-0 right-0 z-50 touch-none tg-bottom-sheet"
      >
        <div className="
          bg-white/10 backdrop-blur-2xl
          border-t border-white/20 border-t-white/40
          rounded-t-3xl shadow-2xl
          relative overflow-hidden
        ">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent"></div>
          
          <div className="flex justify-center pt-3 pb-2 cursor-grab">
            <div className="w-10 h-1 bg-blue-300/50 rounded-full"></div>
          </div>

          <div className="container mx-auto px-4 py-4 relative z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">{product.title}</h3>
              <button
                onClick={safeOnClose}
                className="p-2 text-blue-100 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <img
                src={product.image}
                alt={product.title}
                className="w-16 h-16 object-cover rounded-xl shadow-md"
              />
              <div>
                <p className="text-blue-100 text-sm line-clamp-2">{product.description}</p>
                <p className="text-xl font-bold text-white mt-1">
                  {product.price?.toLocaleString()} ₽
                </p>
              </div>
            </div>

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-blue-100 mb-2">Размер:</h4>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(sizeItem => {
                    const availability = getSizeAvailability(sizeItem);
                    
                    return (
                      <button
                        key={sizeItem.size}
                        onClick={() => {
                          if (availability.available) {
                            setSelectedSize(sizeItem.size);
                          }
                        }}
                        disabled={!availability.available}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all 
                          border min-w-[50px] relative group
                          ${selectedSize === sizeItem.size
                            ? availability.available
                              ? 'bg-blue-500/70 text-white border-blue-400'
                              : 'bg-gray-500/50 text-gray-300 border-gray-400 cursor-not-allowed'
                            : availability.available
                              ? 'bg-blue-500/30 text-blue-100 border-blue-400/30 hover:bg-blue-500/50'
                              : 'bg-gray-500/20 text-gray-400 border-gray-400/30 cursor-not-allowed'
                          }`}
                      >
                        {sizeItem.size}
                        
                        {/* Бейдж с количеством */}
                        <span className={`absolute -top-2 -right-2 text-xs px-1 rounded-full
                          ${availability.available 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                          }`}>
                          {availability.quantity}
                        </span>

                        {/* Тулутип при наведении */}
                        {!availability.available && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
                            bg-gray-800 text-white text-xs px-2 py-1 rounded
                            opacity-0 group-hover:opacity-100 transition-opacity
                            whitespace-nowrap pointer-events-none">
                            Нет в наличии
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Информация о выбранном размере */}
                {selectedSize && (
                  <div className="mt-3 p-2 bg-blue-500/20 rounded-lg">
                    <p className="text-blue-100 text-sm">
                      Выбран размер: <strong>{selectedSize}</strong>
                      {product.sizes.find(s => s.size === selectedSize) && (
                        <span className="ml-2">
                          {getSizeAvailability(product.sizes.find(s => s.size === selectedSize)).text}
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={handleViewDetails}
                className="flex-1 py-3 px-4 bg-blue-500/40 text-white rounded-xl border border-blue-400/30 tg-button"
              >
                Подробнее
              </button>
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className={`flex-1 py-3 px-4 rounded-xl border border-blue-400/30 text-white tg-button
                  ${!selectedSize
                    ? 'opacity-50 cursor-not-allowed bg-gray-500/50'
                    : 'bg-blue-500/70 hover:bg-blue-500/90'
                  }`}
              >
                В корзину
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
});

export default ProductBottomSheet;