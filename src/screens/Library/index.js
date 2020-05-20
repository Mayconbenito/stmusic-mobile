import React, { useState } from 'react';

import HeaderIcon from '~/components/HeaderIcon';

import Artists from '../LibraryArtists';
import Playlists from '../LibraryPlaylists';
import { Container, MenuContainer, MenuItem, MenuText } from './styles';

function Library({ navigation, route }) {
  const [activeTab, setActiveTab] = useState('Playlists');

  navigation.setOptions({
    headerStyle: {
      backgroundColor: '#000',
    },
    headerTitle: () => <HeaderIcon />,
  });

  return (
    <Container>
      <MenuContainer>
        <MenuItem
          active={activeTab === 'Playlists'}
          onPress={() => setActiveTab('Playlists')}
        >
          <MenuText>Playlists</MenuText>
        </MenuItem>

        <MenuItem
          active={activeTab === 'Artists'}
          onPress={() => setActiveTab('Artists')}
        >
          <MenuText>Artistas</MenuText>
        </MenuItem>
      </MenuContainer>

      {activeTab === 'Playlists' && (
        <Playlists navigation={navigation} route={route} />
      )}
      {activeTab === 'Artists' && (
        <Artists navigation={navigation} route={route} />
      )}
    </Container>
  );
}

export default Library;
