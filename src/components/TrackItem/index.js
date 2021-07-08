import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Container,
  Image,
  Details,
  Name,
  TextList,
  Type,
  ArtistName,
  IconsContainer,
} from './styles';
import ToolBar from './ToolBar';

function TrackItem({
  onPress,
  data,
  margin,
  isPlaylist = false,
  onRemoveTrackFromPlaylist,
}) {
  const { t } = useTranslation();

  return (
    <Container margin={margin} onPress={onPress}>
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

      <IconsContainer>
        <ToolBar
          data={{ trackId: data.id, isPlaylist }}
          onRemoveTrackFromPlaylist={onRemoveTrackFromPlaylist}
        />
      </IconsContainer>
    </Container>
  );
}

export default React.memo(TrackItem);
