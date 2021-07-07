import {
  createBottomTabNavigator,
  useBottomTabBarHeight,
} from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ThemeContext } from 'styled-components';

import HeaderIcon from '~/components/HeaderIcon';

import Loading from './components/Loading';
import AuthContext from './contexts/AuthContext';
import Album from './screens/Album';
import Artist from './screens/Artist';
import CreatePlaylist from './screens/CreatePlaylist';
import Home from './screens/Home';
import Library from './screens/Library';
import Login from './screens/Login';
import Playlist from './screens/Playlist';
import Profile from './screens/Profile';
import Register from './screens/Register';
import Search from './screens/Search';
import Welcome from './screens/Welcome';
import { navigationRef } from './services/navigation';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = createStackNavigator();

function HomeStackScreen() {
  const tabHeight = useBottomTabBarHeight();
  const theme = useContext(ThemeContext);

  useEffect(() => {
    theme.updateTheme(theme, { tabHeight });
  }, [tabHeight]);

  return (
    <HomeStack.Navigator
      screenOptions={{ headerStyle: { backgroundColor: '#000' } }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Playlist" component={Playlist} />
      <Stack.Screen name="Artist" component={Artist} />
      <Stack.Screen name="Album" component={Album} />
    </HomeStack.Navigator>
  );
}

const SearchStack = createStackNavigator();

function SearchStackScreen() {
  return (
    <SearchStack.Navigator
      screenOptions={{ headerStyle: { backgroundColor: '#000' } }}
    >
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Playlist" component={Playlist} />
      <Stack.Screen name="Artist" component={Artist} />
      <Stack.Screen name="Album" component={Album} />
    </SearchStack.Navigator>
  );
}

const LibraryStack = createStackNavigator();

function LibraryStackScreen() {
  return (
    <LibraryStack.Navigator
      screenOptions={{ headerStyle: { backgroundColor: '#000' } }}
    >
      <Stack.Screen name="Library" component={Library} />
      <Stack.Screen name="CreatePlaylist" component={CreatePlaylist} />
      <Stack.Screen name="Playlist" component={Playlist} />
      <Stack.Screen name="Artist" component={Artist} />
      <Stack.Screen name="Album" component={Album} />
    </LibraryStack.Navigator>
  );
}

const ProfileStack = createStackNavigator();

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator
      screenOptions={{ headerStyle: { backgroundColor: '#000' } }}
    >
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTitle: props => <HeaderIcon {...props} />,
          headerStyle: {
            backgroundColor: '#000',
          },
        }}
      />
    </ProfileStack.Navigator>
  );
}

function Routes() {
  const { t } = useTranslation();
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (!auth.isLoading) {
      RNBootSplash.hide({ fade: true });
    }
  }, [auth.isLoading]);

  if (auth.isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#141414' }}>
        <Loading />
      </View>
    );
  }

  if (!auth.isLoading && auth.isLoggedIn) {
    return (
      <NavigationContainer ref={navigationRef}>
        <Tab.Navigator
          activeColor="#d99207"
          inactiveColor="#fff"
          lazy={false}
          barStyle={{ backgroundColor: '#000' }}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size = 22 }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = 'home';
              }

              if (route.name === 'Search') {
                iconName = 'search';
              }

              if (route.name === 'Library') {
                iconName = 'library-music';
              }

              if (route.name === 'Profile') {
                iconName = 'person';
              }

              return (
                <MaterialIcons name={iconName} color={color} size={size} />
              );
            },
          })}
          tabBarOptions={{
            inactiveBackgroundColor: '#000',
            activeBackgroundColor: '#000',
            activeTintColor: '#d99207',
            inactiveTintColor: '#fff',
            keyboardHidesTabBar: true,
            style: {
              borderTopWidth: 0,
              borderTopColor: 'transparent',
            },
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeStackScreen}
            options={{ title: t('commons.home') }}
          />
          <Tab.Screen
            name="Search"
            component={SearchStackScreen}
            options={{ title: t('commons.search') }}
          />
          <Tab.Screen
            name="Library"
            component={LibraryStackScreen}
            options={{ title: t('commons.library') }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileStackScreen}
            options={{ title: t('commons.profile') }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Routes;
