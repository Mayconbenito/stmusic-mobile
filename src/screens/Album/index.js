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
  Buttons,
  Button,
  List,
  TextButton,
} from './styles';

function Album({ navigation }) {
  const dispatch = useDispatch();
  const albumId = navigation.state.params.id;
  const [loading, setLoading] = useState(true);
  const [album, setAlbum] = useState({
    name: '',
    tracks: 0,
    picture: '',
  });
  const [tracks, setTracks] = useState([]);
  const [tracksMeta, setTracksMeta] = useState({
    loading: true,
    total: 0,
    page: 1,
  });

  const playerHeight = getPlayerHeight();

  async function fetchAlbum() {
    try {
      const response = await api.get(`/albums/${albumId}`);

      setAlbum(response.data.album);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchTracks() {
    try {
      const response = await api.get(`/albums/${albumId}/tracks`, {
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
    fetchAlbum();
    fetchTracks();
  }, []);

  function endReached() {
    if (tracksMeta.total > tracks.length && !tracksMeta.loading) {
      fetchTracks();
    }
  }

  function handlePlaylistPlay() {
    dispatch(PlayerActions.fetchPlaylist(albumId, 'albums'));
  }

  return (
    <ParentContainer>
      {loading && tracksMeta.loading && <Loading />}
      {!loading && !tracksMeta.loading && (
        <Container playerHeight={playerHeight}>
          <List
            ListHeaderComponent={
              <>
                <Details>
                  <Image
                    source={{ uri: album.picture }}
                    fallback={require('~/assets/images/fallback-square.png')}
                  />
                  <DetailsTitle>{album.name}</DetailsTitle>
                  <Buttons>
                    <Button onPress={handlePlaylistPlay}>
                      <TextButton>Tocar</TextButton>
                    </Button>
                  </Buttons>
                </Details>
              </>
            }
            data={tracks}
            keyExtractor={item => `key-${item.id}`}
            renderItem={({ item }) => <TrackItem data={item} margin />}
            onEndReached={endReached}
            onEndReachedThreshold={0.4}
          />
        </Container>
      )}
    </ParentContainer>
  );
}

Album.navigationOptions = ({ navigation }) => ({
  title: 'Album',
  headerTitleStyle: {
    flex: 1,
    textAlign: 'center',
    color: '#FFF',
    textTransform: 'uppercase',
  },
  headerLeft: <HeaderBackButton onPress={() => navigation.goBack()} />,
  headerRight: <View />,
});

export default Album;
