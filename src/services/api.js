/* eslint-disable no-param-reassign */
import axios from 'axios';
import { API_URL } from 'react-native-dotenv';

import { store } from '~/store';

const api = axios.create();

api.interceptors.request.use(async config => {
  const { jwt } = store.getState().session;
  config.headers.Authorization = `Bearer ${jwt}`;

  config = { ...config, baseURL: `${API_URL}/app` };
  console.log(
    'dont know why but on devlopment API_URL only works with this console.log',
    API_URL
  );

  return config;
});

export default api;
