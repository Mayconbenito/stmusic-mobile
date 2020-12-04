import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import Fallback from '~/assets/images/fallback-square.png';
import HeaderBackButton from '~/components/HeaderBackButton';
import Loading from '~/components/Loading';
import TrackItem from '~/components/TrackItem';
import api from '~/services/api';
import { Creators as PlayerActions } from '~/store/ducks/player';

import HeaderToolBar from './HeaderToolBar';
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

function Playlist({ navigation, route }) {
  const { t } = useTranslation();
  const playlistId = route.params.id;
  const dispatch = useDispatch();

  navigation.setOptions({
    title: t('commons.playlist'),
    headerTitleStyle: {
      flex: 1,
      textAlign: 'center',
      color: '#FFF',
      textTransform: 'uppercase',
    },
    headerLeft: () => <HeaderBackButton onPress={() => navigation.goBack()} />,
    headerRight: () => (
      <HeaderToolBar playlistId={route.params.id} navigation={navigation} />
    ),
  });

  const [state, setState] = useState({
    error: false,
    loading: true,
    data: {
      name: '',
      tracks: 0,
      picture: '',
    },
    tracks: {
      error: false,
      loading: true,
      data: [],
      total: 0,
      page: 1,
    },
  });

  useEffect(() => {
    async function fetchPlaylist() {
      try {
        const [playlist, tracks] = await Promise.all([
          api.get(`/playlists/${playlistId}`),
          api.get(`/playlists/${playlistId}/tracks`, {
            params: {
              page: state.tracks.page,
            },
          }),
        ]);

        setState({
          ...state,
          error: false,
          loading: false,
          data: playlist.data.playlist,
          tracks: {
            error: false,
            loading: false,
            data: tracks.data.tracks,
            total: tracks.data.meta.total,
            page: tracks.data.meta.page + 1,
          },
        });
      } catch (err) {
        setState({ ...state, error: true, loading: false });
      }
    }
    fetchPlaylist();
  }, []);

  async function fetchTracks() {
    try {
      setState({ ...state, tracks: { ...state.tracks, loading: true } });
      const response = await api.get(`/playlists/${playlistId}/tracks`, {
        params: {
          page: state.tracks.page,
        },
      });

      setState({
        ...state,
        tracks: {
          error: false,
          loading: false,
          data: [...state.tracks.data, ...response.data.tracks],
          total: response.data.meta.total,
          page: response.data.meta.page + 1,
        },
      });
    } catch (err) {
      setState({
        ...state,
        tracks: { ...state.tracks, error: true, loading: false },
      });
    }
  }

  async function handleRemoveTrackFromPlaylist(trackId) {
    try {
      const response = await api.delete(
        `/me/library/playlists/${playlistId}/tracks`,
        {
          data: { tracks: [trackId] },
        }
      );

      if (response.status === 204) {
        setState({
          ...state,
          tracks: {
            ...state.tracks,
            total: state.tracks.total - 1,
            data: state.tracks.data.filter(track => track.id !== trackId),
          },
        });
      }
      // eslint-disable-next-line no-empty
    } catch (err) {}
  }

  function endReached() {
    if (
      state.tracks.total > state.tracks.data.length &&
      !state.tracks.loading
    ) {
      fetchTracks();
    }
  }

  function handlePlaylistPlay() {
    dispatch(PlayerActions.fetchPlaylist(playlistId, 'playlists'));
  }

  return (
    <ParentContainer>
      {state.loading && <Loading />}
      {!state.loading && (
        <Container>
          <List
            ListHeaderComponent={
              <Details>
                <Image
                  source={{ uri: state.data.picture }}
                  fallback={Fallback}
                />
                <DetailsTitle>{state.data.name} </DetailsTitle>
                {state.tracks.data.length > 0 ? (
                  <Button onPress={handlePlaylistPlay}>
                    <TextButton>{t('commons.play_tracks_button')}</TextButton>
                  </Button>
                ) : (
                  <WarningText>{t('commons.no_track_available')}</WarningText>
                )}
              </Details>
            }
            data={state.tracks.data}
            keyExtractor={item => `key-${item.id}`}
            renderItem={({ item }) => (
              <TrackItem
                data={item}
                margin
                isPlaylist
                onRemoveTrackFromPlaylist={handleRemoveTrackFromPlaylist}
              />
            )}
            onEndReached={endReached}
            onEndReachedThreshold={0.4}
            ListFooterComponent={state.tracks.loading && <Loading size={24} />}
            ListFooterComponentStyle={{
              marginTop: 10,
            }}
          />
        </Container>
      )}
    </ParentContainer>
  );
}

export default Playlist;
