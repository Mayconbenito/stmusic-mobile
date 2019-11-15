import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

import React from 'react';
import { Provider } from 'react-redux';

import store from '~/store';

function Main() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
