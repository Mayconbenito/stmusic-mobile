import FastStorage from 'react-native-fast-storage';

function getAuthToken() {
  return FastStorage.getItem('@STMusic:token');
}

export default getAuthToken;
