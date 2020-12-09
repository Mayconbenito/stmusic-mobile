import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import HeaderIcon from '~/components/HeaderIcon';
import AuthContext from '~/contexts/AuthContext';
import { useFetch } from '~/hooks/useFetch';
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

  const userQuery = useFetch('profile-me', `/v1/profile/me`);

  const user = {
    name: userQuery.data?.data.name || auth.userData?.name,
    avatar: userQuery.data?.data.avatar || auth.userData?.avatar,
  };

  useEffect(() => {
    if (userQuery.data?.data) {
      auth.setData({
        name: userQuery.data?.data.name,
        email: userQuery.data?.data.email,
        avatar: userQuery.data?.data.avatar,
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
