// src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { StrictMode } from 'react';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';
import { init } from './init.ts';
import { ShopProvider } from './context/ShopContext.jsx';
import './styles/globals.css';

// Компонент для отображения ошибки
const EnvUnsupported = () => (
  <div style={{ 
    padding: '20px', 
    textAlign: 'center', 
    fontFamily: 'Arial, sans-serif',
    color: '#333'
  }}>
    <h2>Ошибка загрузки приложения</h2>
    <p>Текущее окружение не поддерживается. Пожалуйста, откройте приложение через Telegram.</p>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root'));

// Асинхронная функция инициализации
const initializeApp = async () => {
  try {
    const launchParams = retrieveLaunchParams();
    const { tgWebAppPlatform: platform } = launchParams;
    const debug = (launchParams.tgWebAppStartParam || '').includes('platformer_debug') || import.meta.env.DEV;

    // Configure all application dependencies.
    await init({
      debug,
      eruda: debug && ['ios', 'android'].includes(platform),
      mockForMacOS: platform === 'macos',
    });

    root.render(
      <StrictMode>
        <ShopProvider>
          <App />
        </ShopProvider>
      </StrictMode>
    );
  } catch (e) {
    console.error('Initialization error:', e);
    root.render(<EnvUnsupported/>);
  }
};

// Запуск инициализации
initializeApp();