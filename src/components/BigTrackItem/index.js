import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
          <Type>{t('commons.track')} | </Type>
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
