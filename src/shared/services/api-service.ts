import axios from 'axios';
import { getToken } from './token-service';

const BASE_URL = 'http://10.0.2.2:3000';
const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use(async config => {
    const token = await getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const apiService = {
    login: (username: string, password: string) =>
        api.post('/login', { username, password }),

    getProducts: () =>
        api.get('/product'),
};
