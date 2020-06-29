import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import HeaderIcon from '~/components/HeaderIcon';
import api from '~/services/api';
import { Creators as PlayerActions } from '~/store/ducks/player';
import { Creators as SessionActions } from '~/store/ducks/session';

import {
  Container,
  User,
  Image,
  Name,
  LogoutButton,
  LogoutButtonText,
} from './styles';

function Profile({ navigation }) {
  const session = useSelector(state => state.session);
  const dispatch = useDispatch();

  navigation.setOptions({
    headerStyle: {
      backgroundColor: '#000',
    },
    headerTitle: () => <HeaderIcon />,
  });

  async function fetchUser() {
    try {
      const response = await api.get('/me');
      dispatch(SessionActions.updateUserData(response.data.user));
      // eslint-disable-next-line no-empty
    } catch (err) {}
  }

  useEffect(() => {
    fetchUser();
  }, []);

  async function handleLogout() {
    dispatch(PlayerActions.clearState());
    dispatch(SessionActions.deleteSession());
  }

  return (
    <Container>
      <User>
        <Image source={require('~/assets/images/fallback-square.png')} />
        <Name>{session.user?.name}</Name>
      </User>
      <LogoutButton onPress={handleLogout}>
        <LogoutButtonText>Encerrar Sessão</LogoutButtonText>
      </LogoutButton>
    </Container>
  );
}

export default Profile;
