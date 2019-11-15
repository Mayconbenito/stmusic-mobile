import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';

import { Creators as PlayerActions } from '~/store/ducks/player';
import { Creators as PlaylistModalActions } from '~/store/ducks/playlistModal';

import {
  Container,
  Image,
  Details,
  Name,
  TextList,
  Type,
  ArtistName,
  IconsContainer,
  IconButton,
} from './styles';

function TrackItem({ data, margin }) {
  const dispatch = useDispatch();
  return (
    <Container
      margin={margin}
      onPress={() => dispatch(PlayerActions.play(data))}
    >
      <Image
        source={{ uri: data.picture }}
        fallback={require('~/assets/images/fallback-horizontal.png')}
      />
      <Details>
        <Name>{data.name}</Name>
        <TextList>
          <Type>Música | </Type>
          {data.artists.map((artist, index) => (
            <ArtistName key={artist.id}>
              {(index ? ', ' : '') + artist.name}
            </ArtistName>
          ))}
        </TextList>
      </Details>

      <IconsContainer>
        <IconButton
          style={{ marginRight: 10 }}
          onPress={() => dispatch(PlaylistModalActions.openModal(data.id))}
        >
          <MaterialIcons name="playlist-add" size={26} color="#D99207" />
        </IconButton>
      </IconsContainer>
    </Container>
  );
}

export default TrackItem;
