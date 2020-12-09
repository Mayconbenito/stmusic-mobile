import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity } from 'react-native';
import { useMutation, useQueryCache } from 'react-query';
import { useDispatch } from 'react-redux';

import BigAlbumItem from '~/components/BigAlbumItem';
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
  Buttons,
  Button,
  List,
  TextButton,
  ScrollerContainer,
  ScrollerHeader,
  ScrollerHeaderButton,
  ScrollerTitleText,
} from './styles';

function Artist({ navigation, route }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const queryCache = useQueryCache();

  const artistId = route.params.id;

  navigation.setOptions({
    title: t('commons.artist'),
    headerTitleStyle: {
      flex: 1,
      textAlign: 'center',
      color: '#FFF',
      textTransform: 'uppercase',
    },
    headerLeft: () => <HeaderBackButton onPress={() => navigation.goBack()} />,
    headerRight: () => <View />,
  });

  const artistFollowingStateQuery = useFetch(
    `artist-${artistId}-followingState`,
    `/app/me/library/following/artists/contains?artists=${artistId}`
  );
  const artistQuery = useFetch(
    `artist-${artistId}`,
    `/app/artists/${artistId}`
  );
  const albumsQuery = useFetch(
    `artist-${artistId}-albums`,
    `/app/artists/${artistId}/albums?page=1&limit=100`
  );
  const mostPlayedTracksQuery = useFetch(
    `artist-${artistId}-mostPlayedTracks`,
    `/app/artists/${artistId}/most-played-tracks?page=1&limit=10`
  );
  const tracksQuery = useFetch(
    `artist-${artistId}-tracks`,
    `/app/artists/${artistId}/tracks?page=1&limit=10`
  );

  const [followArtist] = useMutation(
    async () => {
      const response = await api.put('/app/me/library/following/artists', {
        artists: [parseInt(artistId)],
      });

      return response.data;
    },
    {
      onMutate: () => {
        queryCache.cancelQueries(`artist-${artistId}-followingState`);

        const previousFollowingState = queryCache.getQueryData(
          `artist-${artistId}-followingState`
        );

        queryCache.setQueryData(`artist-${artistId}-followingState`, () => {
          return {
            artists: [parseInt(artistId)],
          };
        });

        queryCache.invalidateQueries('libraryArtists');

        return () =>
          queryCache.setQueryData(
            `artist-${artistId}-followingState`,
            previousFollowingState
          );
      },
      onError: (err, _, rollback) => rollback(),
      onSettled: () => {
        queryCache.invalidateQueries(`artist-${artistId}-followingState`);
      },
    }
  );

  const [unfollowArtist] = useMutation(
    async () => {
      const response = await api.delete('/app/me/library/following/artists', {
        data: { artists: [artistId] },
      });

      return response.data;
    },
    {
      onMutate: () => {
        queryCache.cancelQueries(`artist-${artistId}-followingState`);

        const previousFollowingState = queryCache.getQueryData(
          `artist-${artistId}-followingState`
        );

        queryCache.setQueryData(`artist-${artistId}-followingState`, old => {
          return {
            artists: old.artists.filter(artist => {
              return artist !== parseInt(artistId);
            }),
          };
        });

        queryCache.invalidateQueries('libraryArtists');

        return () =>
          queryCache.setQueryData(
            `artist-${artistId}-followingState`,
            previousFollowingState
          );
      },
      onError: (err, _, rollback) => rollback(),
      onSettled: () => {
        queryCache.invalidateQueries(`artist-${artistId}-followingState`);
      },
    }
  );

  function handleFollowing() {
    if (
      artistFollowingStateQuery.isSuccess &&
      !artistFollowingStateQuery.data.artists.find(
        itemId => itemId === parseInt(artistId)
      )
    ) {
      followArtist();
    } else {
      unfollowArtist();
    }
  }

  return (
    <ParentContainer>
      {artistQuery.isLoading && <Loading />}
      {artistQuery.isSuccess && (
        <Container>
          <Details>
            <Image
              source={{ uri: artistQuery.data?.artist?.picture }}
              fallback={require('~/assets/images/fallback-square.png')}
            />
            <DetailsTitle>{artistQuery.data.artist.name}</DetailsTitle>
            <Buttons>
              <Button onPress={handleFollowing}>
                <TextButton>
                  {artistFollowingStateQuery.isSuccess &&
                  artistFollowingStateQuery.data.artists.find(
                    itemId => itemId === parseInt(artistId)
                  )
                    ? t('commons.following')
                    : t('commons.follow')}
                </TextButton>
              </Button>
            </Buttons>
          </Details>

          {albumsQuery.isSuccess && albumsQuery.data?.albums?.length > 0 && (
            <ScrollerContainer style={{ marginTop: 0 }}>
              <ScrollerHeader>
                <ScrollerTitleText>{t('commons.albums')}</ScrollerTitleText>
              </ScrollerHeader>
              <List
                data={albumsQuery.data.albums}
                keyExtractor={track => `key-${track.id}`}
                renderItem={({ item }) => (
                  <BigAlbumItem
                    data={item}
                    onPress={() =>
                      navigation.navigate('Album', { id: item.id })
                    }
                  />
                )}
                horizontal
              />
            </ScrollerContainer>
          )}

          {mostPlayedTracksQuery.data?.tracks?.length > 0 && (
            <ScrollerContainer style={{ marginTop: 0 }}>
              <ScrollerHeader>
                <ScrollerTitleText>
                  {t('artist.most_played_tracks')}
                </ScrollerTitleText>
                <TouchableOpacity
                  onPress={() =>
                    dispatch(
                      PlayerActions.playPlaylist({
                        name: `Mais tocadas de ${artistQuery.data.name}`,
                        tracks: mostPlayedTracksQuery.data.tracks,
                      })
                    )
                  }
                  activeOpacity={0.5}
                >
                  <ScrollerHeaderButton />
                </TouchableOpacity>
              </ScrollerHeader>
              {mostPlayedTracksQuery.data?.tracks?.map(item => (
                <TrackItem key={item.id} data={item} />
              ))}
            </ScrollerContainer>
          )}

          {tracksQuery.data?.tracks?.length > 0 && (
            <ScrollerContainer style={{ marginTop: 0 }}>
              <ScrollerHeader>
                <ScrollerTitleText>{t('commons.tracks')}</ScrollerTitleText>
                <TouchableOpacity
                  onPress={() =>
                    dispatch(
                      PlayerActions.playPlaylist({
                        name: artistQuery.data.name,
                        tracks: tracksQuery.data.tracks,
                      })
                    )
                  }
                  activeOpacity={0.5}
                >
                  <ScrollerHeaderButton />
                </TouchableOpacity>
              </ScrollerHeader>
              {tracksQuery.data?.tracks?.map(item => (
                <TrackItem key={item.id} data={item} />
              ))}
            </ScrollerContainer>
          )}
        </Container>
      )}
    </ParentContainer>
  );
}

export default Artist;
