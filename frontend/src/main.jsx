import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Redirects every localhost:5000 call to the hosted backend
axios.interceptors.request.use((config) => {
    if (config.url && config.url.startsWith('http://localhost:5000')) {
        config.url = config.url.replace('http://localhost:5000', API_URL);
    }
    return config;
});