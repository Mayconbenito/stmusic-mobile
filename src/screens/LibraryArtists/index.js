import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';
import { useInfiniteQuery } from 'react-query';

import ArtistItem from '~/components/ArtistItem';
import Loading from '~/components/Loading';
import api from '~/services/api';

import { Container, WarningText } from './styles';

function Artists({ navigation }) {
  const { t } = useTranslation();
  const [totalArtists, setTotalArtists] = useState(0);

  const artistsQuery = useInfiniteQuery(
    'libraryArtists',
    async (key, page = 1) => {
      const response = await api.get(
        `/app/me/library/following/artists?page=${page}`
      );

      return response.data;
    },
    {
      getFetchMore: lastGroup => {
        if (Math.ceil(lastGroup.meta.total / 10) > lastGroup.meta.page) {
          return lastGroup.meta.page + 1;
        }

        return false;
      },
    }
  );

  const onEndReached = useCallback(() => {
    artistsQuery.fetchMore();
  }, []);

  useEffect(() => {
    if (artistsQuery.isSuccess) {
      artistsQuery.data.forEach(group => {
        setTotalArtists(totalArtists + group.artists.length);
      });
    }
  }, [artistsQuery.isSuccess, artistsQuery.data]);

  return (
    <Container>
      {artistsQuery.isLoading && <Loading />}

      {artistsQuery.isSuccess &&
        (totalArtists > 0 ? (
          <FlatList
            data={artistsQuery.data.reduce(
              (acc, val) => acc.concat(val.artists),
              []
            )}
            keyExtractor={item => `key-${item.id}`}
            renderItem={({ item }) => (
              <ArtistItem
                data={item}
                onPress={() => navigation.navigate('Artist', { id: item.id })}
              />
            )}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.4}
            ListFooterComponent={
              artistsQuery.isFetchingMore && <Loading size={24} />
            }
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
