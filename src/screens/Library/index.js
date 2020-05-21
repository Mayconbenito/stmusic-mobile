import React, { useState } from 'react';
import Animated from 'react-native-reanimated';
import { TabView, SceneMap } from 'react-native-tab-view';

import HeaderIcon from '~/components/HeaderIcon';

import Artists from '../LibraryArtists';
import Playlists from '../LibraryPlaylists';
import { TabBar, TabItem, TabItemText } from './styles';

export default function Library({ navigation, route }) {
  navigation.setOptions({
    headerStyle: {
      backgroundColor: '#000',
    },
    headerTitle: () => <HeaderIcon />,
  });

  const [state, setState] = useState({
    index: 0,
    routes: [
      { key: 'playlists', title: 'Playlists' },
      { key: 'artists', title: 'Artists' },
    ],
  });

  function handleIndexChange(index) {
    setState({ ...state, index });
  }

  const renderTabBar = ({ navigationState, position }) => {
    const inputRange = navigationState.routes.map((x, i) => i);

    return (
      <TabBar>
        {navigationState.routes.map((scene, i) => {
          const color = Animated.color(
            Animated.round(
              Animated.interpolate(position, {
                inputRange,
                outputRange: inputRange.map(inputIndex =>
                  inputIndex === i ? 217 : 255
                ),
              })
            ),
            Animated.round(
              Animated.interpolate(position, {
                inputRange,
                outputRange: inputRange.map(inputIndex =>
                  inputIndex === i ? 146 : 255
                ),
              })
            ),
            Animated.round(
              Animated.interpolate(position, {
                inputRange,
                outputRange: inputRange.map(inputIndex =>
                  inputIndex === i ? 7 : 255
                ),
              })
            )
          );

          return (
            <TabItem
              onPress={() => setState({ ...state, index: i })}
              key={scene.key}
            >
              <TabItemText style={{ color }}>{scene.title}</TabItemText>
            </TabItem>
          );
        })}
      </TabBar>
    );
  };

  const renderScene = SceneMap({
    playlists: () => <Playlists navigation={navigation} route={route} />,
    artists: () => <Artists navigation={navigation} route={route} />,
  });

  return (
    <TabView
      navigationState={state}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={handleIndexChange}
    />
  );
}
