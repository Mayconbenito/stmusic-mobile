import React, { useEffect, useState } from 'react';
import { LogBox, StatusBar, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import * as UpdateAPK from 'rn-update-apk';
import { ThemeProvider } from 'styled-components';

import Player from '~/components/Player';
import PlaylistModal from '~/components/PlaylistModal';
import UpdateModal from '~/components/UpdateModal';

import Routes from './routes';

LogBox.ignoreLogs([
  'Warning: componentWillReceiveProps has been renamed',
  'VirtualizedLists',
  'React.createElement',
  'Warning: Failed prop type: The prop `source`',
  'Warning: Failed prop type: Invalid prop `component`',
  'Soruce.uri',
  'Cannot update a component',
  'currentlyFocusedField',
]);

function App() {
  const player = useSelector(state => state.player);
  const playlistModal = useSelector(state => state.playlistModal);

  const [theme, setTheme] = useState({
    showPlayer: false,
  });

  useEffect(() => {
    setTheme({
      showPlayer: player.active ? player.showPlayer : false,
    });
  }, [player.active]);

  const [progress, setProgress] = useState(0);
  const [updateModal, setUpdateModal] = useState(false);

  const updaterURL = 'http://android-app-update.stmusic.tk';

  useEffect(() => {
    const updater = new UpdateAPK.UpdateAPK({
      apkVersionUrl: updaterURL,
      fileProviderAuthority: 'com.mayconbenito.stmusic.provider',

      needUpdateApp: needUpdate => {
        Alert.alert('Nova Atualização disponivel', '', [
          { text: 'Cancelar', onPress: () => {} },
          {
            text: 'Atualizar',
            onPress: () => {
              setUpdateModal('update');
              needUpdate(true);
            },
          },
        ]);
      },
      forceUpdateApp: async () => {
        setUpdateModal('forceUpdate');
      },
      downloadApkProgress: progressCb => {
        setProgress(progressCb);
      },
      downloadApkEnd: () => {
        console.log('Finished APK download');
      },
      onError: err => {
        console.log(err);
      },
    });

    updater.checkUpdate();
  }, []);

  return (
    <>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />

      <ThemeProvider theme={theme}>
        <Routes />

        <Player />
        {playlistModal.open && <PlaylistModal />}

        {!!updateModal && (
          <UpdateModal
            title={
              updateModal === 'forceUpdate'
                ? 'Atualização Obrigatória'
                : 'Atualização'
            }
            progress={progress}
          />
        )}
      </ThemeProvider>
    </>
  );
}

export default App;
