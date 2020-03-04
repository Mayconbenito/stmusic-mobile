import React from 'react';

import { Container, Image, Details, Title, TracksCount } from './styles';

function PlaylistItem({ data, onPress, imageBorder }) {
  return (
    <Container onPress={onPress}>
      <Image
        imageBorder={imageBorder}
        source={{ uri: data.picture }}
        fallback={require('~/assets/images/fallback-square.png')}
      />
      <Details>
        <Title>{data.name}</Title>
        <TracksCount>{data.tracks} Músicas</TracksCount>
      </Details>
    </Container>
  );
}

export default PlaylistItem;
