import axios from 'axios';

const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`,
});

// Adds the login token to every request
API.interceptors.request.use((req) => {
    const user = JSON.parse(sessionStorage.getItem('user') || 'null');
    const token = (user && user.token) || sessionStorage.getItem('userToken');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;