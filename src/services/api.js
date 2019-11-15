import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { API_URL } from 'react-native-dotenv';

const api = axios.create();

api.interceptors.request.use(async config => {
  const JWT = await AsyncStorage.getItem('@STMusic:JWT');
  const headers = { Authorization: `Bearer ${JWT}` };
  // eslint-disable-next-line no-param-reassign
  config = { ...config, baseURL: `${API_URL}/app` };

  if (JWT) {
    return { ...config, headers };
  }

  return config;
});

export default api;
