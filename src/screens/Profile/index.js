import NetInfo from '@react-native-community/netinfo';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import HeaderIcon from '~/components/HeaderIcon';
import Loading from '~/components/Loading';
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
  const [loading, setLoading] = useState();
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
      setLoading(true);
      const isConnected = await NetInfo.fetch();
      if (isConnected) {
        const response = await api.get('/me');
        dispatch(SessionActions.updateUserData(response.data.user));
      }
      setLoading(false);

      // eslint-disable-next-line no-empty
    } catch (err) {
      setLoading(false);
    }
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
      {loading && <Loading animating />}

      {!loading && (
        <>
          <User>
            <Image source={require('~/assets/images/fallback-square.png')} />
            <Name>{session.user?.name}</Name>
          </User>
          <LogoutButton onPress={handleLogout}>
            <LogoutButtonText>Encerrar Sessão</LogoutButtonText>
          </LogoutButton>
        </>
      )}
    </Container>
  );
}

export default Profile;
