import axios from 'axios';

const { REACT_APP_API_URL, REACT_APP_API_BASE_URL } = process.env;

const api = axios.create({
  baseURL: String(REACT_APP_API_URL),
});

export default api;
