import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';

import BigAlbumItem from '~/components/BigAlbumItem';
import HeaderBackButton from '~/components/HeaderBackButton';
import Loading from '~/components/Loading';
import TrackItem from '~/components/TrackItem';
import getPlayerHeight from '~/helpers/getPlayerHeight';
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

function Artist({ navigation }) {
  const dispatch = useDispatch();
  const artistId = navigation.state.params.id;
  const [loading, setLoading] = useState(true);
  const [artist, setArtist] = useState({
    name: '',
    followers: 0,
    tracks: 0,
    picture: '',
    followingState: false,
  });
  const [mostPlayedTracks, setMostPlayedTracks] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [albumsMeta, setAlbumsMeta] = useState({
    loading: true,
    total: 0,
    page: 1,
  });

  const playerHeight = getPlayerHeight();

  async function fetchArtist() {
    try {
      const response = await api.get(`/artists/${artistId}`);

      const followingState = await api.get(
        `/me/following/artists/contains?artists=${artistId}`
      );

      setArtist({
        ...response.data.artist,
        followingState: followingState.data.artists.find(
          itemId => itemId === parseInt(artistId)
        ),
      });
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchAlbums() {
    try {
      const response = await api.get(`/artists/${artistId}/albums`, {
        params: {
          page: albumsMeta.page,
        },
      });

      setAlbums([...albums, ...response.data.albums]);
      setAlbumsMeta({
        loading: false,
        page: response.data.meta.page + 1,
        total: response.data.meta.total,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchMostPlayedTracks() {
    try {
      const response = await api.get(
        `/artists/${artistId}/most-played-tracks`,
        {
          params: {
            page: 1,
            limit: 5,
          },
        }
      );

      setMostPlayedTracks(response.data.tracks);
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchTracks() {
    try {
      const response = await api.get(`/artists/${artistId}/tracks`, {
        params: {
          page: 1,
          limit: 10,
        },
      });

      setTracks(response.data.tracks);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchArtist();
    fetchAlbums();
    fetchMostPlayedTracks();
    fetchTracks();
  }, []);

  function albumEndReached() {
    if (albumsMeta.total > albums.length) {
      fetchAlbums();
    }
  }

  async function handleArtistFollow() {
    try {
      const response = await api.put('/me/following/artists', {
        artists: [artistId],
      });

      if (response.status === 204) {
        setArtist({ ...artist, followingState: true });
        dispatch(LibraryArtistsActions.clearState());
        dispatch(LibraryArtistsActions.fetchArtists());
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleArtistUnfollow() {
    try {
      const response = await api.delete('/me/following/artists', {
        data: {
          artists: [artistId],
        },
      });

      if (response.status === 204) {
        setArtist({ ...artist, followingState: false });
        dispatch(LibraryArtistsActions.clearState());
        dispatch(LibraryArtistsActions.fetchArtists());
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <ParentContainer playerHeight={playerHeight}>
      {loading && <Loading />}
      {!loading && (
        <Container>
          <Details>
            <Image
              source={{ uri: artist.picture }}
              fallback={require('~/assets/images/fallback-square.png')}
            />
            <DetailsTitle>{artist.name}</DetailsTitle>
            <Buttons>
              {artist.followingState ? (
                <Button onPress={handleArtistUnfollow}>
                  <TextButton>Deixar de Seguir</TextButton>
                </Button>
              ) : (
                <Button onPress={handleArtistFollow}>
                  <TextButton>Seguir</TextButton>
                </Button>
              )}
            </Buttons>
          </Details>

          {albums.length > 0 && (
            <ScrollerContainer style={{ marginTop: 0 }}>
              <ScrollerHeader>
                <ScrollerTitleText>Albums</ScrollerTitleText>
              </ScrollerHeader>
              <List
                data={albums}
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
                onEndReachedThreshold={0.4}
                onEndReached={albumEndReached}
              />
            </ScrollerContainer>
          )}

          {mostPlayedTracks.length > 0 && (
            <ScrollerContainer style={{ marginTop: 0 }}>
              <ScrollerHeader>
                <ScrollerTitleText>Músicas mais tocadas</ScrollerTitleText>
                <TouchableOpacity
                  onPress={() =>
                    dispatch(
                      PlayerActions.playPlaylist({
                        name: `Mais tocadas de ${artist.name}`,
                        tracks: mostPlayedTracks,
                      })
                    )
                  }
                  activeOpacity={0.5}
                >
                  <ScrollerHeaderButton />
                </TouchableOpacity>
              </ScrollerHeader>
              {mostPlayedTracks.map(item => (
                <TrackItem key={item.id} data={item} />
              ))}
            </ScrollerContainer>
          )}

          {tracks.length > 0 && (
            <ScrollerContainer style={{ marginTop: 0 }}>
              <ScrollerHeader>
                <ScrollerTitleText>Músicas</ScrollerTitleText>
                <TouchableOpacity
                  onPress={() =>
                    dispatch(
                      PlayerActions.playPlaylist({
                        name: artist.name,
                        tracks,
                      })
                    )
                  }
                  activeOpacity={0.5}
                >
                  <ScrollerHeaderButton />
                </TouchableOpacity>
              </ScrollerHeader>
              {tracks.map(item => (
                <TrackItem key={item.id} data={item} />
              ))}
            </ScrollerContainer>
          )}
        </Container>
      )}
    </ParentContainer>
  );
}

Artist.navigationOptions = ({ navigation }) => ({
  title: 'Artista',
  headerTitleStyle: {
    flex: 1,
    textAlign: 'center',
    color: '#FFF',
    textTransform: 'uppercase',
  },
  headerLeft: <HeaderBackButton onPress={() => navigation.goBack()} />,
  headerRight: <View />,
});

export default Artist;
