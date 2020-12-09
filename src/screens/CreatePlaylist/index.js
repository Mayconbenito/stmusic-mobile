import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useMutation, useQueryCache } from 'react-query';

import HeaderBackButton from '~/components/HeaderBackButton';
import api from '~/services/api';

import {
  Container,
  InputContainer,
  InputDescription,
  Input,
  Submit,
  SubmitText,
} from './styles';

function CreatePlaylist({ navigation }) {
  const { t } = useTranslation();

  const queryCache = useQueryCache();

  navigation.setOptions({
    headerLeft: () => <HeaderBackButton onPress={() => navigation.goBack()} />,
    title: t('create_playlist.create_playlist'),
    headerTitleStyle: {
      flex: 1,
      textAlign: 'center',
      color: '#FFF',
      textTransform: 'uppercase',
    },
    headerRight: () => <View />,
  });

  const [playlistName, setPlaylistName] = useState('');

  const [createPlaylist] = useMutation(
    async ({ name }) => {
      const response = await api.post(`/app/me/library/playlists`, {
        name,
      });

      return response.data;
    },
    {
      onSettled: () => {
        queryCache.invalidateQueries('libraryPlaylists');
        navigation.goBack();
      },
    }
  );

  return (
    <Container>
      <InputContainer>
        <InputDescription>
          {t('create_playlist.type_playlist_name')}
        </InputDescription>
        <Input onChangeText={txt => setPlaylistName(txt)} />
        <Submit onPress={() => createPlaylist({ name: playlistName })}>
          <SubmitText>{t('create_playlist.create_playlist_button')}</SubmitText>
        </Submit>
      </InputContainer>
    </Container>
  );
}

export default CreatePlaylist;
