/* eslint-disable no-param-reassign */
import axios from 'axios';

import env from '~/config/env';
import getAuthToken from '~/helpers/getAuthToken';

const api = axios.create();

api.interceptors.request.use(async config => {
  config.headers.Authorization = `Bearer ${await getAuthToken()}`;

  config = { ...config, baseURL: `${env.API_URL}/app` };

  return config;
});

export default api;
