import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import AlbumItem from '~/components/AlbumItem';
import ArtistItem from '~/components/ArtistItem';
import TrackItem from '~/components/TrackItem';
import getPlayerHeight from '~/helpers/getPlayerHeight';
import api from '~/services/api';

import { Container, InputContainer, Input, List, SectionTitle } from './styles';

function Search({ navigation }) {
  const playerHeight = getPlayerHeight();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({
    artists: [],
    albums: [],
    tracks: [],
  });

  async function fetchSearch() {
    try {
      const response = await api.get(`/search/${query}`, {
        params: {
          limit: 10,
          type: 'artist,album,track',
        },
      });

      setResults({ artists: [], albums: [], tracks: [] });
      setResults(response.data.results);
    } catch (e) {
      console.log(e);
    }
  }

  function onInputChange(txt) {
    setQuery(txt);
  }

  function clearQuery() {
    setQuery('');
    setResults({ artists: [], albums: [], tracks: [] });
  }

  return (
    <Container playerHeight={playerHeight}>
      <InputContainer>
        <MaterialIcons name="search" size={30} color="#d99207" />
        <Input
          value={query}
          onChangeText={onInputChange}
          onSubmitEditing={fetchSearch}
          returnKeyType="search"
          placeholder="Buscar por artistas e músicas"
          autoFocus
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
            <SectionTitle>Artistas</SectionTitle>
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
            <SectionTitle>Albums</SectionTitle>
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
            <SectionTitle>Músicas</SectionTitle>
            {results.tracks.map(item => (
              <TrackItem key={item.id} data={item} />
            ))}
          </View>
        )}
      </List>
    </Container>
  );
}

Search.navigationOptions = () => ({
  header: null,
});

export default Search;
