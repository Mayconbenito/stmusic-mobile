import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';

import HeaderIcon from '~/components/HeaderIcon';

import Album from './screens/Album';
import Artist from './screens/Artist';
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
import { navigationRef } from './services/navigation';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{ headerStyle: { backgroundColor: '#000' } }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Playlist" component={Playlist} />
      <Stack.Screen name="Genre" component={Genre} />
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
      <Stack.Screen name="Genre" component={Genre} />
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
      <Stack.Screen
        name="Library"
        component={Library}
        options={{
          headerTitle: props => <HeaderIcon {...props} />,
          headerStyle: {
            backgroundColor: '#000',
          },
        }}
      />
      <Stack.Screen name="CreatePlaylist" component={CreatePlaylist} />
      <Stack.Screen name="Playlist" component={Playlist} />
      <Stack.Screen name="Genre" component={Genre} />
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
  const session = useSelector(state => state.session);

  return (
    <NavigationContainer ref={navigationRef}>
      {session.jwt ? (
        <>
          <Tab.Navigator
            activeColor="#d99207"
            inactiveColor="#fff"
            shifting={false}
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
              activeTintColor: '#d99207',
              inactiveTintColor: '#fff',
            }}
          >
            <Tab.Screen
              name="Home"
              component={HomeStackScreen}
              options={{ title: 'Ínicio' }}
            />
            <Tab.Screen
              name="Search"
              component={SearchStackScreen}
              options={{ title: 'Busca' }}
            />
            <Tab.Screen
              name="Library"
              component={LibraryStackScreen}
              options={{ title: 'Biblioteca' }}
            />
            <Tab.Screen
              name="Profile"
              component={ProfileStackScreen}
              options={{ title: 'Perfil' }}
            />
          </Tab.Navigator>
        </>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default Routes;
