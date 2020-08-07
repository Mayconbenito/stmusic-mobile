/* eslint-disable no-param-reassign */
import axios from 'axios';

import env from '~/config/env';
import { store } from '~/store';

const api = axios.create();

api.interceptors.request.use(async config => {
  const { jwt } = store.getState().session;
  config.headers.Authorization = `Bearer ${jwt}`;

  config = { ...config, baseURL: `${env.API_URL}/app` };

  return config;
});

export default api;
