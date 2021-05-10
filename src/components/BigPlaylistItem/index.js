import React from 'react';

import { Container, Image, Details, Name, TextList, Type } from './styles';

function BigPlaylistItem({ data, margin, medium, onPress }) {
  return (
    <Container margin={margin} medium={medium} onPress={onPress}>
      <Image
        source={{ uri: data.picture }}
        medium={medium}
        fallback={require('~/assets/images/fallback-horizontal.png')}
      />
      <Details>
        <Name>{data.name}</Name>
        <TextList>
          <Type>Playlist</Type>
        </TextList>
      </Details>
    </Container>
  );
}

export default BigPlaylistItem;
