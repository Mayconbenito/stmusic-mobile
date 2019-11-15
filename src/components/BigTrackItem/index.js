import React from 'react';
import { useDispatch } from 'react-redux';

import { Creators as PlayerActions } from '~/store/ducks/player';

import {
  Container,
  Image,
  Details,
  Name,
  Type,
  TextList,
  ArtistName,
} from './styles';

function BigTrackItem({ data }) {
  const dispatch = useDispatch();
  return (
    <Container onPress={() => dispatch(PlayerActions.play(data))}>
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
    </Container>
  );
}

export default BigTrackItem;
