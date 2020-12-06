import NetInfo from '@react-native-community/netinfo';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import HeaderIcon from '~/components/HeaderIcon';
import Loading from '~/components/Loading';
import AuthContext from '~/contexts/AuthContext';
import api from '~/services/api';
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
  const { t } = useTranslation();
  const [loading, setLoading] = useState();
  const dispatch = useDispatch();
  const auth = useContext(AuthContext);

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
        auth.setData(response.data.user);
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
    auth.destroySession();
  }

  return (
    <Container>
      {loading && <Loading animating />}

      {!loading && (
        <>
          <User>
            <Image source={require('~/assets/images/fallback-square.png')} />
            <Name>{auth.userData?.name}</Name>
          </User>
          <LogoutButton onPress={handleLogout}>
            <LogoutButtonText>{t('profile.logout')}</LogoutButtonText>
          </LogoutButton>
        </>
      )}
    </Container>
  );
}

export default Profile;
