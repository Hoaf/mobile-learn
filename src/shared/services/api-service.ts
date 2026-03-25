import axios from 'axios';

const BASE_URL = 'http://10.0.2.2:3000';
const api = axios.create({ baseURL: BASE_URL });

export const setAuthToken = (token: string) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const clearAuthToken = () => {
    delete api.defaults.headers.common['Authorization'];
};

export const apiService = {
    login: (username: string, password: string) =>
        api.post('/login', { username, password }),

    getProducts: () =>
        api.get('/product'),
};
