import axios from 'axios';

const API_URL = 'http://localhost:2005';

export const login = (email: string, password: string) => {
  return axios.post(`${API_URL}/users/login`, { email, password });
};

export const register = (name: string, email: string, password: string) => {
  return axios.post(`${API_URL}/users/register`, { name, email, password });
};
