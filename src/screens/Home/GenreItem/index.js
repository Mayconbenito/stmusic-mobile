import React from 'react';

import { Container, Name } from './styles';

function GenreItem({ data, onPress }) {
  return (
    <Container onPress={onPress}>
      <Name>{data.name}</Name>
    </Container>
  );
}

export default GenreItem;
