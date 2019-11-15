import React from 'react';

import { Container, Image, Details, Name, Followers } from './styles';

function ArtistItem({ data, onPress }) {
  return (
    <Container onPress={onPress}>
      <Image
        source={{ uri: data.picture }}
        fallback={require('~/assets/images/fallback-square.png')}
      />
      <Details>
        <Name>{data.name}</Name>
        <Followers>{data.followers} Seguidores</Followers>
      </Details>
    </Container>
  );
}

export default ArtistItem;
