import { useQuery } from 'react-query';

import api from '../services/api';

export function useFetch(key, url) {
  const query = useQuery(key, async () => {
    const response = await api.get(url);

    return response.data;
  });

  return query;
}

export default useFetch;
