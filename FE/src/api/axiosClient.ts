
import axios from 'axios';
import { store } from '../store/store';
 
const axiosClient = axios.create({
    baseURL: 'http://192.168.0.102:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = store.getState().auth.token;
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error.response?.data || error)
);

export default axiosClient;