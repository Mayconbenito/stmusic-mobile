import 'react-native-gesture-handler';

import React from 'react';
import { AppRegistry } from 'react-native';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { Provider } from 'react-redux';

import { name as appName } from './app.json';
import App from './src/App';
import store from './src/store';

const queryCache = new QueryCache();

function Main() {
  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <Provider store={store}>
        <App />
      </Provider>
    </ReactQueryCacheProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
