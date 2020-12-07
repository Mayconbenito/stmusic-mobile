import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';

import BigAlbumItem from '~/components/BigAlbumItem';
import HeaderBackButton from '~/components/HeaderBackButton';
import Loading from '~/components/Loading';
import TrackItem from '~/components/TrackItem';
import api from '~/services/api';
import { Creators as LibraryArtistsActions } from '~/store/ducks/libraryArtist';
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

  const artistId = route.params.id;
  const [state, setState] = useState({
    error: false,
    loading: true,
    data: {
      name: '',
      tracks: 0,
      picture: '',
    },
    albums: {
      data: [],
    },
    mostPlayedTracks: {
      data: [],
    },
    tracks: {
      data: [],
    },
  });

  useEffect(() => {
    async function fetchArtist() {
      try {
        const [artist, albums, mostPlayedTracks, tracks] = await Promise.all([
          api.get(`/artists/${artistId}`),
          api.get(`/artists/${artistId}/albums`, {
            params: {
              page: 1,
              limit: 100,
            },
          }),
          api.get(`/artists/${artistId}/most-played-tracks`, {
            params: {
              page: 1,
              limit: 10,
            },
          }),
          api.get(`/artists/${artistId}/tracks`, {
            params: {
              page: 1,
              limit: 15,
            },
          }),
        ]);

        const followingState = await api.get(
          `/me/library/following/artists/contains?artists=${artistId}`
        );

        setState({
          ...state,
          error: false,
          loading: false,
          data: {
            ...artist.data.artist,
            followingState: followingState.data.artists.find(
              itemId => itemId === parseInt(artistId)
            ),
          },
          albums: {
            data: albums.data.albums,
          },
          mostPlayedTracks: {
            data: mostPlayedTracks.data.tracks,
          },
          tracks: {
            data: tracks.data.tracks,
          },
        });
        // eslint-disable-next-line no-empty
      } catch (err) {}
    }
    fetchArtist();
  }, []);

  async function handleArtistFollow() {
    try {
      const response = await api.put('/me/library/following/artists', {
        artists: [artistId],
      });

      if (response.status === 204) {
        setState({ ...state, data: { ...state.data, followingState: true } });
        dispatch(LibraryArtistsActions.clearState());
        dispatch(LibraryArtistsActions.fetchArtists());
      }
      // eslint-disable-next-line no-empty
    } catch (err) {}
  }

  async function handleArtistUnfollow() {
    try {
      const response = await api.delete('/me/library/following/artists', {
        data: {
          artists: [artistId],
        },
      });

      if (response.status === 204) {
        setState({ ...state, data: { ...state.data, followingState: false } });
        dispatch(LibraryArtistsActions.clearState());
        dispatch(LibraryArtistsActions.fetchArtists());
      }
      // eslint-disable-next-line no-empty
    } catch (err) {}
  }

  return (
    <ParentContainer>
      {state.loading && <Loading />}
      {!state.loading && (
        <Container>
          <Details>
            <Image
              source={{ uri: state.data.picture }}
              fallback={require('~/assets/images/fallback-square.png')}
            />
            <DetailsTitle>{state.data.name}</DetailsTitle>
            <Buttons>
              {state.data.followingState ? (
                <Button onPress={handleArtistUnfollow}>
                  <TextButton>{t('commons.following')}</TextButton>
                </Button>
              ) : (
                <Button onPress={handleArtistFollow}>
                  <TextButton>{t('commons.follow')}</TextButton>
                </Button>
              )}
            </Buttons>
          </Details>

          {state.albums.data.length > 0 && (
            <ScrollerContainer style={{ marginTop: 0 }}>
              <ScrollerHeader>
                <ScrollerTitleText>{t('commons.albums')}</ScrollerTitleText>
              </ScrollerHeader>
              <List
                data={state.albums.data}
                keyExtractor={item => `key-${item.id}`}
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

          {state.mostPlayedTracks.data.length > 0 && (
            <ScrollerContainer style={{ marginTop: 0 }}>
              <ScrollerHeader>
                <ScrollerTitleText>
                  {t('artist.most_played_tracks')}
                </ScrollerTitleText>
                <TouchableOpacity
                  onPress={() =>
                    dispatch(
                      PlayerActions.playPlaylist({
                        name: `Mais tocadas de ${state.data.name}`,
                        tracks: state.mostPlayedTracks.data,
                      })
                    )
                  }
                  activeOpacity={0.5}
                >
                  <ScrollerHeaderButton />
                </TouchableOpacity>
              </ScrollerHeader>
              {state.mostPlayedTracks.data.map(item => (
                <TrackItem key={item.id} data={item} />
              ))}
            </ScrollerContainer>
          )}

          {state.tracks.data.length > 0 && (
            <ScrollerContainer style={{ marginTop: 0 }}>
              <ScrollerHeader>
                <ScrollerTitleText>{t('commons.tracks')}</ScrollerTitleText>
                <TouchableOpacity
                  onPress={() =>
                    dispatch(
                      PlayerActions.playPlaylist({
                        name: state.data.name,
                        tracks: state.tracks.data,
                      })
                    )
                  }
                  activeOpacity={0.5}
                >
                  <ScrollerHeaderButton />
                </TouchableOpacity>
              </ScrollerHeader>
              {state.tracks.data.map(item => (
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
