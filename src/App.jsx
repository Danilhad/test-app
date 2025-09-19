// src/App.jsx
import React from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext.jsx';
import RootLayout from './components/RootLayout/RootLayout.jsx';
import ProductList from './components/ProductList/ProductList';
import CartView from './components/CartView/CartView';
import OrderView from './components/OrderView/OrderView';
import ProductDetail from './components/ProductDetail/ProductDetail.jsx';
import AdminProducts from './components/AdminProducts/AdminProducts.jsx';
import AdminHistory from './components/AdminHistory/AdminHistory.jsx';
import Auth from './components/Auth/Auth.jsx';
import './styles/globals.css';

// Компонент для защиты админских маршрутов
const AdminProtectedRoute = ({ children }) => {
  return children; // Убираем useShopContext отсюда
};

// Публичный маршрут для аутентификации
const AuthRoute = ({ children }) => {
  return children; // Убираем useShopContext отсюда
};

function App() {
  const router = createBrowserRouter([
    {
      path: '/auth',
      element: <Auth />
    },
    {
      path: '/',
      element: (
        <ShopProvider>
          <RootLayout />
        </ShopProvider>
      ),
      children: [
        {
          index: true,
          element: <ProductList />,
        },
        {
          path: 'product/:id',
          element: <ProductDetail />,
        },
        {
          path: 'cart',
          element: <CartView />,
        },
        {
          path: 'order',
          element: <OrderView />,
        },
        {
          path: 'admin/products',
          element: <AdminProducts />,
        },
        {
          path: 'admin/history',
          element: <AdminHistory />,
        },
        {
          path: '*',
          element: <Navigate to="/" replace />,
        },
      ],
    },
  ]);

  
  return <RouterProvider router={router} />;
  
}

export default App;