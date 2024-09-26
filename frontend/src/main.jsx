import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import {
  RouterProvider,
} from "react-router-dom";
import App from './App.jsx';
import { store } from './stores/index.jsx';
import { router } from './routes/index.jsx';
import enTranslations from '@shopify/polaris/locales/en.json';
import { AppProvider } from '@shopify/polaris';
import './index.css';
import '@shopify/polaris/build/esm/styles.css';

createRoot(document.getElementById('root')).render(
  <AppProvider i18n={enTranslations}>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </AppProvider>,
)
