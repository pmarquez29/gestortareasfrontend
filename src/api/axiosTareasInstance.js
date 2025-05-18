import axios from 'axios';

const axiosTareasInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
});

export default axiosTareasInstance;
