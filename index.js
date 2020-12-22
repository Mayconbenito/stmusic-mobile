import 'react-native-gesture-handler';

import React from 'react';
import { AppRegistry } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { QueryCache, ReactQueryCacheProvider, setConsole } from 'react-query';
import { Provider } from 'react-redux';

import TrackPlayerService from '~/services/TrackPlayerService';

import { name as appName } from './app.json';
import App from './src/App';
import store from './src/store';

setConsole({
  log: console.log,
  warn: console.warn,
  error: console.warn,
});

function Main() {
  const queryCache = new QueryCache({
    defaultConfig: {
      queries: {
        cacheTime: 12000,
      },
    },
  });

  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <Provider store={store}>
        <App />
      </Provider>
    </ReactQueryCacheProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
TrackPlayer.registerPlaybackService(() => TrackPlayerService);
