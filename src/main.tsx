import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './lib/ThemeContext';
import { ApiPatientProvider } from './api/ApiPatientContext';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <ApiPatientProvider>
          <App />
        </ApiPatientProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
