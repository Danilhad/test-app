// src/App.jsx
import React from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import RootLayout from './components/RootLayout/RootLayout.jsx'; // ← Используйте импортированный
import ProductList from './components/ProductList/ProductList';
import CartView from './components/CartView/CartView';
import OrderView from './components/OrderView/OrderView';
import ProductDetail from './components/ProductDetail/ProductDetail.jsx';
import { products } from './products';
import { ShopProvider } from './context/ShopContext.jsx';

// Создаем роутер
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ShopProvider> {/* ← Обёртка */}
        <RootLayout />
      </ShopProvider>
    ),
    children: [
      {
        index: true,
        element: <ProductList products={products} />, // ← Передача товаров
      },
      {
        path: 'product/:id',
        element: <ProductDetail products={products} />,
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
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default function AppWrapper() {
  return <RouterProvider router={router} />;
}
