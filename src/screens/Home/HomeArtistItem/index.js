import React from 'react';

import { Container, Name, Image } from './styles';

function HomeArtistItem({ data, onPress }) {
  return (
    <Container onPress={onPress}>
      <Image
        source={{ uri: data.picture }}
        fallback={require('~/assets/images/fallback-square.png')}
      />
      <Name>{data.name}</Name>
    </Container>
  );
}

export default HomeArtistItem;
