// src/components/Header/Header.jsx
import React from 'react';
import { initDataState as _initDataState, useSignal } from '@telegram-apps/sdk-react';
import { Link } from 'react-router-dom';
import '../../styles/globals.css';

const Header = () => {
  const initDataState = useSignal(_initDataState);
  const user = initDataState?.user;

  // Режим разработки - всегда админ
  const isDevelopment = import.meta.env.DEV;
  const isAdmin = isDevelopment || user?.id === 1267434095;

  return (
    <header className="
      top-0 z-50
      bg-white/10 backdrop-blur-2xl
      border-b border-white/20 border-b-white/40
      shadow-2xl
      relative overflow-hidden
    ">
      {/* Эффект жидкого стекла */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_70%)]"></div>
      
      <div className="container mx-auto px-4 py-2 relative z-10">
        <div className="flex items-center justify-between">
          {/* Логотип */}
          <div className="flex items-center space-x-3">
           
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="relative h-12 w-12 object-cover "
              />
          </div>

          {/* Правая часть */}
          <div className="flex items-center space-x-3">
            {/* Кнопка админа */}
            {isAdmin && (
              <Link
                to="/admin/products"
                className="
                  relative group
                  transition-all duration-300 transform hover:scale-105
                "
              >
                <div className="
                  absolute inset-0 
                  bg-white/10 backdrop-blur-md
                  rounded-xl 
                  border border-white/20 border-b-white/40 border-r-white/40
                  group-hover:bg-white/15
                  transition-all duration-300
                " />
                <span className="
                  relative px-4 py-2 text-sm font-medium text-white 
                  flex items-center space-x-2
                ">
                  <span className="text-lg">🎮</span>
                  <span>Управление</span>
                </span>
              </Link>
            )}

            {/* Блок пользователя */}
            {user && (
              <div className="flex items-center space-x-3">
                <div className="hidden md:block">
                  <div className="
                    relative group
                    transition-all duration-300 transform hover:scale-105
                  ">
                    <div className="
                      absolute inset-0 
                      bg-white/10 backdrop-blur-md
                      rounded-full 
                      border border-white/20 border-b-white/40 border-r-white/40
                    " />
                    <span className="relative px-3 py-1 text-sm text-white font-medium">
                      Привет, {user.first_name}!
                    </span>
                  </div>
                </div>

                <div className="
                  relative group
                  transition-all duration-300 transform hover:scale-105
                ">
                  <div className="
                    absolute inset-0 
                    bg-white/10 backdrop-blur-md
                    rounded-full 
                    border border-white/20 border-b-white/40 border-r-white/40
                  " />
                  
                  {user.photo_url ? (
                    <img 
                      src={user.photo_url} 
                      alt="User Avatar" 
                      className="relative h-10 w-10 rounded-full object-cover border-2 border-white/30"
                    />
                  ) : (
                    <div className="relative h-10 w-10 rounded-full bg-gradient-to-b flex items-center justify-center border-2 border-white/30">
                      <span className="text-white font-bold text-sm">
                        {user.first_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  
                  {/* Ховер эффект */}
                  <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-colors" />
                </div>
              </div>
            )}

            {/* Заглушка для гостя */}
            {!user && (
              <div className="
                relative
                transition-all duration-300 transform hover:scale-105
              ">
                <div className="
                  absolute inset-0 
                  bg-white/10 backdrop-blur-md
                  rounded-full 
                  border border-white/20 border-b-white/40 border-r-white/40
                " />
                <span className="relative px-3 py-1 text-sm text-white/80">
                  Гость
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Анимация подчеркивания */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
    </header>
  );
};

export default Header;