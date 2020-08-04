import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import ArtistItem from '~/components/ArtistItem';
import Loading from '~/components/Loading';
import { Creators as LibraryArtistActions } from '~/store/ducks/libraryArtist';

import { Container, WarningText } from './styles';

function Artists({ navigation }) {
  const { t } = useTranslation();
  const { fetchArtists } = LibraryArtistActions;
  const libraryArtist = useSelector(state => state.libraryArtist);
  const dispatch = useDispatch();

  useEffect(() => {
    if (libraryArtist.data.length === 0) dispatch(fetchArtists());
  }, []);

  function endReached() {
    if (
      libraryArtist.total > libraryArtist.data.length &&
      !libraryArtist.loading
    ) {
      dispatch(fetchArtists(libraryArtist.page));
    }
  }

  const showLoadingSpinner = function() {
    if (libraryArtist.loading && libraryArtist.page === 1) {
      return true;
    }
    return false;
  };

  return (
    <Container>
      {showLoadingSpinner() && <Loading />}

      {!showLoadingSpinner() &&
        (libraryArtist.data.length > 0 ? (
          <FlatList
            data={libraryArtist.data}
            keyExtractor={item => `key-${item.id}`}
            renderItem={({ item }) => (
              <ArtistItem
                data={item}
                onPress={() => navigation.navigate('Artist', { id: item.id })}
              />
            )}
            onEndReached={endReached}
            onEndReachedThreshold={0.4}
            ListFooterComponent={libraryArtist.loading && <Loading size={24} />}
            ListFooterComponentStyle={{
              marginTop: 10,
            }}
          />
        ) : (
          <WarningText>
            {t('library.you_are_not_following_any_artist')}
          </WarningText>
        ))}
    </Container>
  );
}

export default React.memo(Artists);
