import React, { useState, useEffect } from 'react';
import FastStorage from 'react-native-fast-storage';

import getAuthToken from '~/helpers/getAuthToken';

const AuthContext = React.createContext({
  isLoading: true,
  isLoggedIn: false,
  token: null,
  userData: null,
  setData() {
    return Promise.resolve();
  },
  createSession() {
    return Promise.resolve();
  },
  destroySession() {
    return Promise.resolve();
  },
});

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function getToken() {
      try {
        setIsLoading(true);
        const storedToken = await getAuthToken();
        setToken(storedToken);
        setIsLoading(false);
        // eslint-disable-next-line no-empty
      } catch (err) {
        console.log(err);
      }
    }

    async function getUserData() {
      try {
        const storedUserData = await FastStorage.getItem('@STMusic:userData');
        setUserData(JSON.parse(storedUserData));
        // eslint-disable-next-line no-empty
      } catch (err) {
        console.log(err);
      }
    }

    getToken();
    getUserData();
  }, []);

  async function setData(data) {
    await FastStorage.setItem(
      '@STMusic:userData',
      JSON.stringify({ ...userData, ...data })
    );
    setUserData(data);
  }

  async function createSession(jwtToken) {
    await FastStorage.setItem('@STMusic:token', jwtToken);
    setToken(jwtToken);
  }

  async function destroySession() {
    await FastStorage.removeItem('@STMusic:token');
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isLoggedIn: !!token,
        token,
        userData,
        setData,
        createSession,
        destroySession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
