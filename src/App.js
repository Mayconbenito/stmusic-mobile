import React, { useEffect, useState } from 'react';
import { YellowBox, StatusBar, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import * as UpdateAPK from 'rn-update-apk';

import Player from '~/components/Player';
import PlaylistModal from '~/components/PlaylistModal';
import UpdateModal from '~/components/UpdateModal';

import Routes from './routes';
import NavigationService from './services/navigation';

YellowBox.ignoreWarnings([
  'Warning: componentWillReceiveProps has been renamed',
  'VirtualizedLists',
  'React.createElement',
  'Warning: Failed prop type: The prop `source`',
  'Warning: Failed prop type: Invalid prop `component`',
  'Soruce.uri',
]);

function App() {
  const playlistModal = useSelector(state => state.playlistModal);
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
        console.log('downloadApkEnd callback called');
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
      <Routes
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
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
    </>
  );
}

export default App;
