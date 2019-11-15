import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import HeaderIcon from '~/components/HeaderIcon';
import getPlayerHeight from '~/helpers/getPlayerHeight';
import { Creators as PlayerActions } from '~/store/ducks/player';

import {
  Container,
  User,
  Image,
  Name,
  LogoutButton,
  LogoutButtonText,
} from './styles';

function Profile({ navigation }) {
  const playerHeight = getPlayerHeight();
  const dispatch = useDispatch();

  const [user, setUser] = useState(false);

  useEffect(() => {
    async function getUserData() {
      const userStore = await AsyncStorage.getItem('@STMusic:user');
      setUser(JSON.parse(userStore));
    }
    getUserData();
  }, []);

  async function handleLogout() {
    dispatch(PlayerActions.clearState());
    await AsyncStorage.removeItem('@STMusic:JWT');
    navigation.navigate('AuthStack');
  }

  return (
    <Container playerHeight={playerHeight}>
      <User>
        <Image source={require('~/assets/images/fallback-square.png')} />
        <Name>{user.name}</Name>
      </User>
      <LogoutButton onPress={handleLogout}>
        <LogoutButtonText>Encerrar Sessão</LogoutButtonText>
      </LogoutButton>
    </Container>
  );
}

Profile.navigationOptions = () => ({
  headerStyle: {
    backgroundColor: '#000',
  },
  headerTitle: <HeaderIcon />,
});

export default Profile;
