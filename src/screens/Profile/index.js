import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import HeaderIcon from '~/components/HeaderIcon';
import getPlayerHeight from '~/helpers/getPlayerHeight';
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

function Profile() {
  const playerHeight = getPlayerHeight();
  const session = useSelector(state => state.session);
  const dispatch = useDispatch();

  async function handleLogout() {
    dispatch(PlayerActions.clearState());
    dispatch(SessionActions.deleteSession());
  }

  return (
    <Container playerHeight={playerHeight}>
      <User>
        <Image source={require('~/assets/images/fallback-square.png')} />
        <Name>{session.name}</Name>
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
