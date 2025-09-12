// src/components/CategoryFilter/CategoryFilter.jsx
import React from 'react';
import { useShopContext } from '../../context/ShopContext.jsx';
import Slider from 'react-slick';

const CategoryFilter = () => {
  const { activeCategory, setActiveCategory } = useShopContext();

  const categories = [
    { id: 'all', name: 'Все', icon: '🛍️' },
    { id: 'hat', name: 'Головные уборы', icon: '🧢' },
    { id: 'top', name: 'Верх', icon: '👕' },
    { id: 'accessories', name: 'Аксессуары', icon: '🎒' },
  ];

  // Настройки для react-slick
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
    cssEase: 'linear',
    swipeToSlide: true,
    variableWidth: true,
    // Убираем отступы между слайдами
    className: "category-slider",
    responsive: [ 
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <nav className="bg-white/30 backdrop-blur-none border border-white/20 shadow-sm sticky top-0 z-30">
      <div className="container mx-auto py-3">
        <Slider {...settings}>
          {categories.map(category => (
            <button
              key={category.id}
              className={`
                flex items-center space-x-1 px-2 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
                ${activeCategory === category.id
                  ? 'bg-white/60 text-black shadow-sm'
                  : 'bg-white/20 text-gray-700 hover:bg-white/30 hover:shadow-sm'
                }
              `}
              onClick={() => setActiveCategory(category.id)}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </Slider>
      </div>
    </nav>
  );
};

export default CategoryFilter;
