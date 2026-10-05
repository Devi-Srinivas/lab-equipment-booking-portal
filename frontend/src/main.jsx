import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import App from './App.jsx';
import './index.css';

// Hosted backend URL (set VITE_API_URL in Vercel). Falls back to localhost for local development.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Redirects every localhost:5000 call to the hosted backend
axios.interceptors.request.use((config) => {
    if (config.url && config.url.startsWith('http://localhost:5000')) {
        config.url = config.url.replace('http://localhost:5000', API_URL);
    }

    // Send the login token to our own backend so it knows who is calling
    const token = sessionStorage.getItem('userToken');
    if (token && config.url && config.url.startsWith(API_URL)) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);