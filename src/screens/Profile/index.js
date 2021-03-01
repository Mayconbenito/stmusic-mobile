import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';

import HeaderIcon from '~/components/HeaderIcon';
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
  const dispatch = useDispatch();
  const auth = useContext(AuthContext);

  navigation.setOptions({
    headerStyle: {
      backgroundColor: '#000',
    },
    headerTitle: () => <HeaderIcon />,
  });

  const userQuery = useQuery('profile-me', async () => {
    const response = await api.get('/app/me');

    return response.data;
  });

  const user = {
    name: userQuery.data?.user.name || auth.userData?.name,
    avatar: userQuery.data?.user.avatar || auth.userData?.avatar,
  };

  useEffect(() => {
    if (userQuery.data?.data) {
      auth.setData({
        name: userQuery.data?.user.name,
        email: userQuery.data?.user.email,
        avatar: userQuery.data?.user.avatar,
      });
    }
  }, [userQuery.data]);

  async function handleLogout() {
    dispatch(PlayerActions.clearState());
    auth.destroySession();
  }

  return (
    <Container>
      <User>
        <Image source={require('~/assets/images/fallback-square.png')} />
        <Name>{user.name}</Name>
      </User>
      <LogoutButton onPress={handleLogout}>
        <LogoutButtonText>{t('profile.logout')}</LogoutButtonText>
      </LogoutButton>
    </Container>
  );
}

export default Profile;
