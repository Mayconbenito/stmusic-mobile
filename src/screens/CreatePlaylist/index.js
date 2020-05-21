import React, { useState } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import HeaderBackButton from '~/components/HeaderBackButton';
import api from '~/services/api';
import { Creators as LibraryPlaylistActions } from '~/store/ducks/libraryPlaylist';

import {
  Container,
  InputContainer,
  InputDescription,
  Input,
  Submit,
  SubmitText,
} from './styles';

function CreatePlaylist({ navigation }) {
  const dispatch = useDispatch();

  navigation.setOptions({
    headerLeft: () => <HeaderBackButton onPress={() => navigation.goBack()} />,
    title: 'Criar Playlist',
    headerTitleStyle: {
      flex: 1,
      textAlign: 'center',
      color: '#FFF',
      textTransform: 'uppercase',
    },
    headerRight: () => <View />,
  });

  const [name, setName] = useState('');

  async function handleCreatePlaylist() {
    try {
      const response = await api.post('/me/playlists', {
        name,
      });

      if (response.status === 200) {
        dispatch(LibraryPlaylistActions.clearState());
        dispatch(LibraryPlaylistActions.fetchPlaylists());
        navigation.goBack();
      }
    } catch (err) {
      console.log(err);
    }
  }

  function setInputName(txt) {
    setName(txt);
  }
  return (
    <Container>
      <InputContainer>
        <InputDescription>Digite o nome da sua Playlist</InputDescription>
        <Input onChangeText={setInputName} />
        <Submit onPress={handleCreatePlaylist}>
          <SubmitText>Criar Playlist</SubmitText>
        </Submit>
      </InputContainer>
    </Container>
  );
}

export default CreatePlaylist;
