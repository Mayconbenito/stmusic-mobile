import getAuthToken from './getAuthToken';

export async function isLoggedIn() {
  const token = await getAuthToken();

  return !!token;
}
