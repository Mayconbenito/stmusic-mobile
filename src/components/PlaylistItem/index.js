import React from 'react';
import { useTranslation } from 'react-i18next';

import { Container, Image, Details, Title, TracksCount } from './styles';

function PlaylistItem({ data, onPress, imageBorder }) {
  const { t } = useTranslation();

  return (
    <Container onPress={onPress}>
      <Image
        imageBorder={imageBorder}
        source={{ uri: data.picture }}
        fallback={require('~/assets/images/fallback-square.png')}
      />
      <Details>
        <Title>{data.name}</Title>
        <TracksCount>
          {data.tracks} {t('commons.tracks')}
        </TracksCount>
      </Details>
    </Container>
  );
}

export default PlaylistItem;
