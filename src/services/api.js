import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { API_URL } from 'react-native-dotenv';

const api = axios.create();

api.interceptors.request.use(async config => {
  const JWT = await AsyncStorage.getItem('@STMusic:JWT');
  const headers = { Authorization: `Bearer ${JWT}` };
  // eslint-disable-next-line no-param-reassign
  config = { ...config, baseURL: `${API_URL}/app` };
  console.log(
    'dont know why but on devlopment API_URL only works with this console.log',
    API_URL
  );
  if (JWT) {
    return { ...config, headers };
  }

  return config;
});

export default api;
