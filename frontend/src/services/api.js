import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Anni Requests ki Token Auto ga add chestundi
API.interceptors.request.use((req) => {
    const user = JSON.parse(sessionStorage.getItem('user') || 'null');
    const token = (user && user.token) || sessionStorage.getItem('userToken');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;