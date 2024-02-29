import axios from 'axios';

const apiClient = axios.create({
 baseURL: 'http://localhost:5173', // Your backend base URL
 withCredentials: true, // Include credentials in requests
});

export default apiClient;
