import React, { useEffect } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import BigTrackItem from '~/components/BigTrackItem';
import HeaderIcon from '~/components/HeaderIcon';
import Loading from '~/components/Loading';
import { Creators as BrowseActions } from '~/store/ducks/browse';
import { Creators as PlayerActions } from '~/store/ducks/player';

import GenreItem from './GenreItem';
import HomeArtistItem from './HomeArtistItem';
import {
  Container,
  ScrollerContainer,
  ScrollerHeader,
  ScrollerHeaderButton,
  ScrollerTitleText,
  List,
} from './styles';

function Home({ navigation }) {
  const browse = useSelector(state => state.browse);
  const dispatch = useDispatch();

  const {
    fetchGenres,
    fetchRecentlyPlayed,
    fetchTrending,
    fetchMostPlayed,
    fetchMostFollowed,
  } = BrowseActions;
  useEffect(() => {
    dispatch(fetchGenres());
    dispatch(fetchRecentlyPlayed());
    dispatch(fetchTrending());
    dispatch(fetchMostPlayed());
    dispatch(fetchMostFollowed());
  }, []);

  function loading() {
    if (
      browse.loadingGenres ||
      browse.loadingRecentlyPlayed ||
      browse.loadingTrending ||
      browse.loadingMostPlayed ||
      browse.loadingMostFollowed
    ) {
      return true;
    }
  }

  return (
    <Container>
      {loading() === true && <Loading />}
      {!loading() && (
        <ScrollView>
          {browse.recentlyPlayed.length > 0 && (
            <ScrollerContainer>
              <ScrollerHeader>
                <ScrollerTitleText>Ouvir novamente</ScrollerTitleText>
                <TouchableOpacity
                  onPress={() =>
                    dispatch(
                      PlayerActions.playPlaylist({
                        name: 'Ouvir novamente',
                        tracks: browse.recentlyPlayed,
                      })
                    )
                  }
                  activeOpacity={0.5}
                >
                  <ScrollerHeaderButton />
                </TouchableOpacity>
              </ScrollerHeader>
              <List
                data={browse.recentlyPlayed}
                keyExtractor={item => `key-${item.id}`}
                renderItem={({ item }) => <BigTrackItem data={item} />}
                horizontal
              />
            </ScrollerContainer>
          )}

          {browse.trending.length > 0 && (
            <ScrollerContainer>
              <ScrollerHeader>
                <ScrollerTitleText>Em alta</ScrollerTitleText>
                <TouchableOpacity
                  onPress={() =>
                    dispatch(
                      PlayerActions.playPlaylist({
                        name: 'Em alta',
                        tracks: browse.trending,
                      })
                    )
                  }
                >
                  <ScrollerHeaderButton />
                </TouchableOpacity>
              </ScrollerHeader>

              <List
                data={browse.trending}
                keyExtractor={item => `key-${item.id}`}
                renderItem={({ item }) => <BigTrackItem data={item} />}
                horizontal
              />
            </ScrollerContainer>
          )}

          {browse.genres.length > 0 && (
            <ScrollerContainer>
              <ScrollerTitleText>Gêneros</ScrollerTitleText>

              <List
                data={browse.genres}
                keyExtractor={item => `key-${item.id}`}
                renderItem={({ item }) => (
                  <GenreItem
                    onPress={() =>
                      navigation.navigate('Genre', { id: item.id })
                    }
                    data={item}
                  />
                )}
                horizontal
              />
            </ScrollerContainer>
          )}

          {browse.mostPlayed.length > 0 && (
            <ScrollerContainer>
              <ScrollerHeader>
                <ScrollerTitleText>Músicas mais tocadas</ScrollerTitleText>
                <TouchableOpacity
                  onPress={() =>
                    dispatch(
                      PlayerActions.playPlaylist({
                        name: 'Músicas mais tocadas',
                        tracks: browse.mostPlayed,
                      })
                    )
                  }
                >
                  <ScrollerHeaderButton />
                </TouchableOpacity>
              </ScrollerHeader>
              <List
                data={browse.mostPlayed}
                keyExtractor={item => `key-${item.id}`}
                renderItem={({ item }) => <BigTrackItem data={item} />}
                horizontal
              />
            </ScrollerContainer>
          )}

          {browse.mostFollowed.length > 0 && (
            <ScrollerContainer style={{ marginBottom: 0 }}>
              <ScrollerTitleText>Artistas mais seguidos</ScrollerTitleText>

              <List
                data={browse.mostFollowed}
                keyExtractor={item => `key-${item.id}`}
                renderItem={({ item }) => (
                  <HomeArtistItem
                    data={item}
                    onPress={() =>
                      navigation.navigate('Artist', { id: item.id })
                    }
                  />
                )}
                horizontal
              />
            </ScrollerContainer>
          )}
        </ScrollView>
      )}
    </Container>
  );
}

Home.navigationOptions = () => ({
  headerStyle: {
    backgroundColor: '#000',
  },
  headerTitle: <HeaderIcon />,
});

export default Home;
