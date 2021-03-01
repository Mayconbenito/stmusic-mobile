import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import AlbumItem from '~/components/AlbumItem';
import ArtistItem from '~/components/ArtistItem';
import TrackItem from '~/components/TrackItem';
import isStringEmpty from '~/helpers/isStringEmpty';
import useDebounce from '~/hooks/useDebounce';
import api from '~/services/api';

import { Container, InputContainer, Input, List, SectionTitle } from './styles';

function Search({ navigation }) {
  const { t } = useTranslation();

  navigation.setOptions({
    headerShown: false,
  });

  const [query, setQuery] = useState('');
  const [results, setResults] = useState({
    artists: [],
    albums: [],
    tracks: [],
  });

  const debouncedQuery = useDebounce(query, 500);

  async function fetchSearch() {
    try {
      const response = await api.get(`/app/search/${query}`, {
        params: {
          limit: 10,
          type: 'artist,album,track',
        },
      });

      setResults({ artists: [], albums: [], tracks: [] });
      setResults(response.data.results);

      // eslint-disable-next-line no-empty
    } catch (err) {}
  }

  useEffect(() => {
    if (!isStringEmpty(debouncedQuery)) {
      fetchSearch();
    } else {
      setResults({ artists: [], albums: [], tracks: [] });
    }
  }, [debouncedQuery]);

  function onInputChange(txt) {
    setQuery(txt);
  }

  function clearQuery() {
    setQuery('');
  }

  return (
    <Container>
      <InputContainer>
        <MaterialIcons name="search" size={30} color="#d99207" />
        <Input
          value={query}
          onChangeText={onInputChange}
          onSubmitEditing={fetchSearch}
          returnKeyType="search"
          placeholder={t('search.input')}
        />
        {query !== '' && (
          <TouchableOpacity onPress={clearQuery}>
            <MaterialIcons name="clear" size={30} color="#d99207" />
          </TouchableOpacity>
        )}
      </InputContainer>

      <List>
        {results.artists.length > 0 && (
          <View style={{ marginBottom: 30 }}>
            <SectionTitle>{t('commons.artists')}</SectionTitle>
            {results.artists.map(item => (
              <ArtistItem
                key={item.id}
                data={item}
                onPress={() => navigation.navigate('Artist', { id: item.id })}
              />
            ))}
          </View>
        )}

        {results.albums.length > 0 && (
          <View style={{ marginBottom: 30 }}>
            <SectionTitle>{t('commons.albums')}</SectionTitle>
            {results.albums.map(item => (
              <AlbumItem
                key={item.id}
                data={item}
                onPress={() => navigation.navigate('Album', { id: item.id })}
              />
            ))}
          </View>
        )}

        {results.tracks.length > 0 && (
          <View>
            <SectionTitle>{t('commons.tracks')}</SectionTitle>
            {results.tracks.map(item => (
              <TrackItem key={item.id} data={item} />
            ))}
          </View>
        )}
      </List>
    </Container>
  );
}

export default Search;
