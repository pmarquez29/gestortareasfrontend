import axios from 'axios';

const axiosTareasInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export default axiosTareasInstance;
