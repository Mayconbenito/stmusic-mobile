import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import Fallback from '~/assets/images/fallback-square.png';
import HeaderBackButton from '~/components/HeaderBackButton';
import Loading from '~/components/Loading';
import TrackItem from '~/components/TrackItem';
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
  const dispatch = useDispatch();

  navigation.setOptions({
    title: 'Gênero',
    headerTitleStyle: {
      flex: 1,
      textAlign: 'center',
      color: '#FFF',
      textTransform: 'uppercase',
    },
    headerLeft: () => <HeaderBackButton onPress={() => navigation.goBack()} />,
    headerRight: () => <View />,
  });

  const genreId = route.params.id;
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
    async function fetchGenre() {
      try {
        const [genre, tracks] = await Promise.all([
          api.get(`/genres/${genreId}`),
          api.get(`/genres/${genreId}/tracks`, {
            params: {
              page: state.tracks.page,
            },
          }),
        ]);

        setState({
          ...state,
          error: false,
          loading: false,
          data: genre.data.genre,
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
    fetchGenre();
  }, []);

  async function fetchTracks() {
    try {
      setState({ ...state, tracks: { ...state.tracks, loading: true } });
      const response = api.get(`/genres/${genreId}/tracks`, {
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

  function endReached() {
    if (
      state.tracks.total > state.tracks.data.length &&
      !state.tracks.loading
    ) {
      fetchTracks();
    }
  }

  function handlePlaylistPlay() {
    dispatch(PlayerActions.fetchPlaylist(genreId, 'genres'));
  }

  return (
    <ParentContainer>
      {state.loading && state.tracks.page === 1 && <Loading />}
      {!state.loading && (
        <Container>
          <List
            ListHeaderComponent={
              <Details>
                <Image source={Fallback} local />
                <DetailsTitle>{state.data.name} </DetailsTitle>
                {state.tracks.data.length > 0 ? (
                  <Button onPress={handlePlaylistPlay}>
                    <TextButton>Tocar</TextButton>
                  </Button>
                ) : (
                  <WarningText>Nenhuma música adicionada</WarningText>
                )}
              </Details>
            }
            data={state.tracks.data}
            keyExtractor={item => `key-${item.id}`}
            renderItem={({ item }) => <TrackItem data={item} margin />}
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

export default Genre;
