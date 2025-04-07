import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter as Router } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 使用 BrowserRouter 包裹应用，提供路由功能 */}
    <Router>
      <App />
    </Router>
  </StrictMode>,
);
