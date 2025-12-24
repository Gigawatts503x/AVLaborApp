import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { DataStoreProvider } from './hooks/DataStoreContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <DataStoreProvider>
      <App />
    </DataStoreProvider>
  </React.StrictMode>
);
