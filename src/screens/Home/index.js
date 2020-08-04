import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
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
  ScrollerHeaderButtonIcon,
  ScrollerTitleText,
  List,
} from './styles';

function Home({ navigation }) {
  const { t } = useTranslation();

  const browse = useSelector(state => state.browse);
  const dispatch = useDispatch();

  navigation.setOptions({
    headerStyle: {
      backgroundColor: '#000',
    },
    headerTitle: () => <HeaderIcon />,
  });

  useEffect(() => {
    dispatch(BrowseActions.fetchBrowse());
  }, []);

  return (
    <Container>
      {browse.loading && <Loading />}

      {!browse.loading && (
        <ScrollView>
          {browse.recentlyPlayed.length > 0 && (
            <ScrollerContainer>
              <ScrollerHeader>
                <ScrollerTitleText>
                  {t('home.recently_played')}
                </ScrollerTitleText>
                <ScrollerHeaderButton
                  onPress={() =>
                    dispatch(
                      PlayerActions.playPlaylist({
                        name: t('home.recently_played'),
                        tracks: browse.recentlyPlayed,
                      })
                    )
                  }
                >
                  <ScrollerHeaderButtonIcon />
                </ScrollerHeaderButton>
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
                <ScrollerTitleText>{t('home.trending')}</ScrollerTitleText>
                <ScrollerHeaderButton
                  onPress={() =>
                    dispatch(
                      PlayerActions.playPlaylist({
                        name: t('home.trending'),
                        tracks: browse.trending,
                      })
                    )
                  }
                >
                  <ScrollerHeaderButtonIcon />
                </ScrollerHeaderButton>
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
              <ScrollerTitleText>{t('home.genres')}</ScrollerTitleText>

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
                <ScrollerTitleText>
                  {t('home.most_played_tracks')}
                </ScrollerTitleText>
                <ScrollerHeaderButton
                  onPress={() =>
                    dispatch(
                      PlayerActions.playPlaylist({
                        name: t('home.most_played_tracks'),
                        tracks: browse.mostPlayed,
                      })
                    )
                  }
                >
                  <ScrollerHeaderButtonIcon />
                </ScrollerHeaderButton>
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
              <ScrollerTitleText>
                {t('home.most_followed_artists')}
              </ScrollerTitleText>

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

export default Home;
