import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';

import BigTrackItem from '~/components/BigTrackItem';
import HeaderIcon from '~/components/HeaderIcon';
import Loading from '~/components/Loading';
import { isLoggedIn } from '~/helpers/isLoggedIn';
import { useFetch } from '~/hooks/useFetch';
import { Creators as PlayerActions } from '~/store/ducks/player';

import GenreItem from './GenreItem';
import HomeArtistItem from './HomeArtistItem';
import {
  Container,
  ScrollerContainer,
  ScrollerHeader,
  ScrollerHeaderButton,
  ScrollerHeaderButtonIcon,
  ScrollerTitleText,
  List,
} from './styles';

function Home({ navigation }) {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  navigation.setOptions({
    headerStyle: {
      backgroundColor: '#000',
    },
    headerTitle: () => <HeaderIcon />,
  });

  let recentlyPlayedQuery;

  if (isLoggedIn()) {
    recentlyPlayedQuery = useFetch(
      isLoggedIn() ? 'recentlyPlayed' : null,
      '/app/me/recently-played?page=1&limit=30'
    );
  }

  const genresQuery = useFetch('genres', '/app/genres?page=1&limit=30');
  const trendingQuery = useFetch(
    'trending',
    '/app/browse/tracks/trending?page=1&limit=30'
  );
  const mostPlayedTracksQuery = useFetch(
    'mostPlayedTracks',
    '/app/browse/tracks/most-played?page=1&limit=30'
  );
  const mostFollowedArtistsQuery = useFetch(
    'mostFollowedArtists',
    '/app/browse/artists/most-followed?page=1&limit=30'
  );

  function handleQueuePlay({ name, tracks, nameKey }) {
    dispatch(
      PlayerActions.loadQueue(null, {
        id: nameKey,
        name,
        tracks,
      })
    );
  }

  function handleQueueTrackPlay(track, nameKey) {
    dispatch(PlayerActions.play(track, nameKey));
  }

  function isLoading() {
    if (!recentlyPlayedQuery?.isLoading) {
      return false;
    }

    if (!genresQuery.isLoading) {
      return false;
    }

    if (!trendingQuery.isLoading) {
      return false;
    }

    if (!mostPlayedTracksQuery.isLoading) {
      return false;
    }

    if (!mostFollowedArtistsQuery.isLoading) {
      return false;
    }

    return true;
  }

  return (
    <Container>
      {isLoading() && <Loading />}

      {!isLoading() && (
        <ScrollView>
          {recentlyPlayedQuery.data?.tracks?.length > 0 && (
            <ScrollerContainer>
              <ScrollerHeader>
                <ScrollerTitleText>
                  {t('home.recently_played')}
                </ScrollerTitleText>
                <ScrollerHeaderButton
                  onPress={() => {
                    handleQueuePlay({
                      name: t('home.recently_played'),
                      tracks: recentlyPlayedQuery?.data?.tracks,
                      nameKey: 'recently_played',
                    });
                  }}
                >
                  <ScrollerHeaderButtonIcon />
                </ScrollerHeaderButton>
              </ScrollerHeader>
              <List
                data={recentlyPlayedQuery.data?.tracks}
                keyExtractor={item => `key-${item.id}`}
                renderItem={({ item }) => (
                  <BigTrackItem
                    data={item}
                    onPress={() =>
                      handleQueueTrackPlay(item, 'recently_played')
                    }
                  />
                )}
                horizontal
              />
            </ScrollerContainer>
          )}

          {trendingQuery.data?.tracks?.length > 0 && (
            <ScrollerContainer>
              <ScrollerHeader>
                <ScrollerTitleText>{t('home.trending')}</ScrollerTitleText>
                <ScrollerHeaderButton
                  onPress={() => {
                    handleQueuePlay({
                      name: t('home.trending'),
                      tracks: trendingQuery?.data?.tracks,
                      nameKey: 'trending',
                    });
                  }}
                >
                  <ScrollerHeaderButtonIcon />
                </ScrollerHeaderButton>
              </ScrollerHeader>

              <List
                data={trendingQuery.data?.tracks}
                keyExtractor={item => `key-${item.id}`}
                renderItem={({ item }) => (
                  <BigTrackItem
                    data={item}
                    onClick={() => handleQueueTrackPlay(item, 'trending')}
                  />
                )}
                horizontal
              />
            </ScrollerContainer>
          )}

          {genresQuery.data?.genres?.length > 0 && (
            <ScrollerContainer>
              <ScrollerTitleText>{t('home.genres')}</ScrollerTitleText>

              <List
                data={genresQuery.data?.genres}
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

          {mostPlayedTracksQuery.data?.tracks?.length > 0 && (
            <ScrollerContainer>
              <ScrollerHeader>
                <ScrollerTitleText>
                  {t('home.most_played_tracks')}
                </ScrollerTitleText>
                <ScrollerHeaderButton
                  onPress={() => {
                    handleQueuePlay({
                      name: t('home.most_played_tracks'),
                      tracks: mostPlayedTracksQuery?.data?.tracks,
                      nameKey: 'most_played_tracks',
                    });
                  }}
                >
                  <ScrollerHeaderButtonIcon />
                </ScrollerHeaderButton>
              </ScrollerHeader>
              <List
                data={mostPlayedTracksQuery.data?.tracks}
                keyExtractor={item => `key-${item.id}`}
                renderItem={({ item }) => (
                  <BigTrackItem
                    data={item}
                    onPress={() =>
                      handleQueueTrackPlay(item, 'most_played_tracks')
                    }
                  />
                )}
                horizontal
              />
            </ScrollerContainer>
          )}

          {mostFollowedArtistsQuery.data?.artists?.length > 0 && (
            <ScrollerContainer style={{ marginBottom: 0 }}>
              <ScrollerTitleText>
                {t('home.most_followed_artists')}
              </ScrollerTitleText>

              <List
                data={mostFollowedArtistsQuery.data?.artists}
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

export default Home;
