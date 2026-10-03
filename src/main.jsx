import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import '@fontsource/baloo-2/700.css';
import '@fontsource/atkinson-hyperlegible/400.css';
import '@fontsource/atkinson-hyperlegible/700.css';
import './styles/tokens.css';
import './styles/phases.css';
import './styles/base.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>,
);
