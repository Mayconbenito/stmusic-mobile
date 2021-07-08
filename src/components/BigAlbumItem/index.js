import React from 'react';

import {
  Container,
  Image,
  Details,
  Name,
  TextList,
  Type,
  ArtistName,
} from './styles';

function BigAlbumItem({ data, margin, medium, onPress }) {
  return (
    <Container margin={margin} medium={medium} onPress={onPress}>
      <Image
        source={{ uri: data.picture }}
        medium={medium}
        fallback={require('~/assets/images/fallback-horizontal.png')}
      />
      <Details medium={medium}>
        <Name>{data.name}</Name>
        <TextList>
          <Type>
            {data.type.charAt(0).toUpperCase() + data.type.slice(1)} |{' '}
          </Type>
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

export default BigAlbumItem;
