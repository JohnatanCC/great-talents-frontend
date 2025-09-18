import axios from 'axios'
import { tokenKeyLocalStorage } from '../constants/global.constants';

const api = axios.create({
    baseURL: import.meta.env.VITE_API
})

api.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem(tokenKeyLocalStorage); // get stored access token
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`; // set in header
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export default api


