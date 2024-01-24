import axios from 'axios';

const token = localStorage.getItem('userToken');

axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
