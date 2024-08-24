import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

<GoogleOAuthProvider clientId="697063750023-7nha10stlk2j37gijq3p2kvgbmpmpu9r.apps.googleusercontent.com">  
  <App/>
  </GoogleOAuthProvider>;
  </React.StrictMode>
);
