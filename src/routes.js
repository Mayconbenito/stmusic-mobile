import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { createStackNavigator } from 'react-navigation-stack';

import Album from './screens/Album';
import Artist from './screens/Artist';
import AuthHandler from './screens/AuthHandler';
import CreatePlaylist from './screens/CreatePlaylist';
import Genre from './screens/Genre';
import Home from './screens/Home';
import Library from './screens/Library';
import Login from './screens/Login';
import Playlist from './screens/Playlist';
import Profile from './screens/Profile';
import Register from './screens/Register';
import Search from './screens/Search';
import Welcome from './screens/Welcome';

const HomeStack = createStackNavigator(
  {
    Home,
    Playlist,
    Genre,
    Artist,
    Album,
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#000',
      },
    },
  }
);

const SearchStack = createStackNavigator(
  {
    Search,
    Playlist,
    Genre,
    Artist,
    Album,
  },
  {
    initialRouteName: 'Search',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#000',
      },
    },
  }
);

const LibraryStack = createStackNavigator(
  {
    Library,
    CreatePlaylist,
    Playlist,
    Genre,
    Artist,
    Album,
  },
  {
    initialRouteName: 'Library',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#000',
      },
    },
  }
);

const ProfileStack = createStackNavigator(
  {
    Profile,
  },
  {
    initialRouteName: 'Profile',
  }
);

const AppStack = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: {
        tabBarLabel: 'Inicio',
        labeled: true,
        tabBarIcon: ({ tintColor }) => (
          <MaterialIcons name="home" color={tintColor} size={22} />
        ),
      },
    },
    Search: {
      screen: SearchStack,
      navigationOptions: {
        tabBarLabel: 'Busca',
        labeled: true,
        tabBarIcon: ({ tintColor }) => (
          <MaterialIcons name="search" color={tintColor} size={22} />
        ),
      },
    },
    Library: {
      screen: LibraryStack,
      navigationOptions: {
        tabBarLabel: 'Biblioteca',
        labeled: true,
        tabBarIcon: ({ tintColor }) => (
          <MaterialIcons name="library-music" color={tintColor} size={22} />
        ),
      },
    },
    Profile: {
      screen: ProfileStack,
      navigationOptions: {
        tabBarLabel: 'Meu Perfil',
        labeled: true,
        tabBarIcon: ({ tintColor }) => (
          <MaterialIcons name="person" color={tintColor} size={22} />
        ),
      },
    },
  },
  {
    initialRouteName: 'Home',
    activeTintColor: '#D99207',
    activeColor: '#D99207',
    inactiveColor: '#fff',
    labeled: true,
    shifting: false,
    barStyle: { backgroundColor: '#000' },
  }
);

const AuthStack = createStackNavigator(
  {
    Welcome,
    Login,
    Register,
  },
  {
    initialRouteName: 'Welcome',
  }
);

const SwitchNavigator = createSwitchNavigator(
  {
    AuthHandler,
    AuthStack,
    AppStack,
  },
  {
    initialRouteName: 'AuthHandler',
  }
);

export default createAppContainer(SwitchNavigator);
