// src/index.js или src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './styles/slick.css'; // ← Ваши кастомные стили

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);