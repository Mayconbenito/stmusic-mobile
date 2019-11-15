import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import HeaderBackButton from '~/components/HeaderBackButton';
import Loading from '~/components/Loading';
import TrackItem from '~/components/TrackItem';
import getPlayerHeight from '~/helpers/getPlayerHeight';
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

function Genre({ navigation }) {
  const dispatch = useDispatch();
  const genreId = navigation.state.params.id;

  const [loading, setLoading] = useState(true);
  const [genre, setGenre] = useState();
  const [tracks, setTracks] = useState([]);
  const [tracksMeta, setTracksMeta] = useState({
    loading: true,
    total: 0,
    page: 1,
  });

  const playerHeight = getPlayerHeight();

  async function fetchGenre() {
    try {
      const response = await api.get(`/genres/${genreId}`);

      setGenre(response.data.genre);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchTracks() {
    try {
      const response = await api.get(`/genres/${genreId}/tracks`, {
        params: {
          page: tracksMeta.page,
        },
      });

      setTracks([...tracks, ...response.data.tracks]);
      setTracksMeta({
        loading: false,
        page: response.data.meta.page + 1,
        total: response.data.meta.total,
      });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchGenre();
    fetchTracks();
  }, []);

  function endReached() {
    if (tracksMeta.total > tracks.length) {
      fetchTracks();
    }
  }

  function handlePlaylistPlay() {
    dispatch(PlayerActions.fetchPlaylist(genreId, 'genres'));
  }

  return (
    <ParentContainer>
      {loading && tracksMeta.loading && <Loading />}
      {!loading && !tracksMeta.loading && (
        <Container playerHeight={playerHeight}>
          <List
            ListHeaderComponent={
              <Details>
                <Image
                  source={require('~/assets/images/fallback-square.png')}
                />
                <DetailsTitle>{genre.name} </DetailsTitle>
                {tracks.length > 0 ? (
                  <Button onPress={handlePlaylistPlay}>
                    <TextButton>Tocar</TextButton>
                  </Button>
                ) : (
                  <WarningText>Nenhuma música adicionada</WarningText>
                )}
              </Details>
            }
            data={tracks}
            keyExtractor={item => `key-${item.id}`}
            renderItem={({ item }) => <TrackItem data={item} margin />}
            onEndReached={endReached}
            onEndReachedThreshold={0.1}
          />
        </Container>
      )}
    </ParentContainer>
  );
}

Genre.navigationOptions = ({ navigation }) => ({
  title: 'Gênero',
  headerTitleStyle: {
    flex: 1,
    textAlign: 'center',
    color: '#FFF',
    textTransform: 'uppercase',
  },
  headerLeft: <HeaderBackButton onPress={() => navigation.goBack()} />,
  headerRight: <View />,
});

export default Genre;
