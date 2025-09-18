// src/config/telegram.js
export const initTelegramWebApp = () => {
  if (window.Telegram?.WebApp) {
    const webApp = window.Telegram.WebApp;
    
    webApp.expand();
    webApp.disableVerticalSwipes();
    webApp.enableClosingConfirmation();
    
    webApp.setHeaderColor('#0088CC');
    webApp.setBackgroundColor('#0088CC');
    
    // Запрашиваем больше данных о пользователе
    webApp.requestContact && webApp.requestContact();
    
    return webApp;
  }
  return null;
};

export const useTelegram = () => {
  const webApp = window.Telegram?.WebApp;
  const user = webApp?.initDataUnsafe?.user || null;
  
  // Форматируем данные пользователя
  const formattedUser = user ? {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name || '',
    username: user.username || '',
    language_code: user.language_code,
    photo_url: user.photo_url,
    is_premium: user.is_premium || false,
    // Добавляем полное имя
    full_name: [user.first_name, user.last_name].filter(Boolean).join(' ')
  } : null;

  return {
    webApp,
    user: formattedUser,
    theme: webApp?.colorScheme || 'light',
    platform: webApp?.platform || 'unknown',
    version: webApp?.version || 'unknown'
  };
};

export const isTelegramWebApp = () => {
  return !!window.Telegram?.WebApp;
};

// Хук для отслеживания изменений пользователя
export const useTelegramUser = () => {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      setUser(webApp.initDataUnsafe?.user || null);
      
      // Слушаем изменения (если supported)
      webApp.onEvent('userChanged', (newUser) => {
        setUser(newUser);
      });
    }
  }, []);

  return user;
};