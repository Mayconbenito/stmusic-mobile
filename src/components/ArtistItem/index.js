import React from 'react';
import { useTranslation } from 'react-i18next';

import { Container, Image, Details, Name, Followers } from './styles';

function ArtistItem({ data, onPress }) {
  const { t } = useTranslation();

  return (
    <Container onPress={onPress}>
      <Image
        source={{ uri: data.picture }}
        fallback={require('~/assets/images/fallback-square.png')}
      />
      <Details>
        <Name>{data.name}</Name>
        <Followers>
          {data.followers} {t('commons.followers')}
        </Followers>
      </Details>
    </Container>
  );
}

export default ArtistItem;
