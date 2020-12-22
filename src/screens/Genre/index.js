import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useInfiniteQuery } from 'react-query';
import { useDispatch } from 'react-redux';

import Fallback from '~/assets/images/fallback-square.png';
import HeaderBackButton from '~/components/HeaderBackButton';
import Loading from '~/components/Loading';
import TrackItem from '~/components/TrackItem';
import { useFetch } from '~/hooks/useFetch';
import api from '~/services/api';
import { Creators as PlayerActions } from '~/store/ducks/player';

import {
  ParentContainer,
  Container,
  Details,
  Image,
  DetailsTitle,
  Button,
  List,
  TextButton,
  WarningText,
} from './styles';

function Genre({ navigation, route }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const genreId = route.params.id;

  navigation.setOptions({
    title: t('commons.genre'),
    headerTitleStyle: {
      flex: 1,
      textAlign: 'center',
      color: '#FFF',
      textTransform: 'uppercase',
    },
    headerLeft: () => <HeaderBackButton onPress={() => navigation.goBack()} />,
    headerRight: () => <View />,
  });

  const [totalTracks, setTotalTracks] = useState(0);

  const genreQuery = useFetch(`genre-${genreId}`, `/app/genres/${genreId}`);

  const tracksQuery = useInfiniteQuery(
    `genre-${genreId}-tracks`,
    async (key, page = 1) => {
      const response = await api.get(
        `/app/genres/${genreId}/tracks?page=${page}`
      );

      return response.data;
    },
    {
      getFetchMore: lastGroup => {
        if (Math.ceil(lastGroup?.meta.total / 10) > lastGroup?.meta.page) {
          return lastGroup?.meta.page + 1;
        }

        return false;
      },
    }
  );

  const onEndReached = useCallback(() => {
    tracksQuery.fetchMore();
  }, []);

  useEffect(() => {
    if (tracksQuery.isSuccess) {
      tracksQuery.data.forEach(group => {
        setTotalTracks(totalTracks + group?.tracks.length);
      });
    }
  }, [tracksQuery.isSuccess, tracksQuery.data]);

  const isTracksLoading = tracksQuery.isFetchingMore || tracksQuery.isLoading;

  function handleQueuePlay() {
    if (genreQuery.isSuccess && tracksQuery.isSuccess && totalTracks > 0) {
      const firstTrack = tracksQuery.data.map(group => group.tracks[0])[0];

      dispatch(
        PlayerActions.loadQueue({
          name: genreQuery.data.genre.name,
          id: genreId,
          type: 'genres',
          preloadedTrack: {
            title: firstTrack.name,
            artwork: firstTrack.picture,
            artist: firstTrack.artists.map(
              (artist, index) => (index ? ', ' : '') + artist.name
            )[0],
          },
        })
      );
    }
  }

  function handleQueueTrackPlay(track) {
    dispatch(PlayerActions.play(track, genreId));
  }

  return (
    <ParentContainer>
      {genreQuery.isLoading && <Loading />}
      {genreQuery.isSuccess && (
        <Container>
          <List
            ListHeaderComponent={
              <Details>
                <Image source={Fallback} local />
                <DetailsTitle>{genreQuery.data.genre.name} </DetailsTitle>
                {totalTracks > 0 ? (
                  <Button onPress={handleQueuePlay}>
                    <TextButton>{t('commons.play_tracks_button')}</TextButton>
                  </Button>
                ) : (
                  <WarningText>{t('commons.no_track_available')}</WarningText>
                )}
              </Details>
            }
            data={
              totalTracks > 0
                ? tracksQuery.data.reduce(
                    (acc, val) => acc.concat(val.tracks),
                    []
                  )
                : []
            }
            keyExtractor={track => `key-${track.id}`}
            renderItem={({ item }) => (
              <TrackItem
                data={item}
                margin
                onPress={() => handleQueueTrackPlay(item.id)}
              />
            )}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.4}
            ListFooterComponent={isTracksLoading && <Loading size={24} />}
            ListFooterComponentStyle={{
              marginTop: 10,
            }}
          />
        </Container>
      )}
    </ParentContainer>
  );
}

export default Genre;
