import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import ArtistItem from '~/components/ArtistItem';
import Loading from '~/components/Loading';
import getPlayerHeight from '~/helpers/getPlayerHeight';
import { Creators as LibraryArtistActions } from '~/store/ducks/libraryArtist';

import { Container, WarningText } from './styles';

function Artists({ navigation }) {
  const { fetchArtists } = LibraryArtistActions;
  const libraryArtist = useSelector(state => state.libraryArtist);
  const dispatch = useDispatch();
  const playerHeight = getPlayerHeight();

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

  return (
    <Container playerHeight={playerHeight}>
      {libraryArtist.loading && <Loading />}

      {!libraryArtist.loading && (
        <>
          {libraryArtist.data.length > 0 ? (
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
              onEndReachedThreshold={0.1}
            />
          ) : (
            <WarningText>Você ainda não segue nenhuma artista.</WarningText>
          )}
        </>
      )}
    </Container>
  );
}

export default Artists;
