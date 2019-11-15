import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function AuthHandler({ navigation }) {
  async function verifyAuth() {
    const jwt = await AsyncStorage.getItem('@STMusic:JWT');
    if (jwt) {
      navigation.navigate('AppStack');
    } else {
      navigation.navigate('AuthStack');
    }
  }

  verifyAuth();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#141414',
      }}
    >
      <ActivityIndicator animating color="#d99207" size={36} />
    </View>
  );
}
