import axios from 'axios';
import axiosConfig from '../config/axiosConfig.js';

const api = axios.create(axiosConfig);

export default api;