import './config/i18next';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LogBox, StatusBar, Alert } from 'react-native';
import codePush from 'react-native-code-push';
import { useSelector } from 'react-redux';
import * as UpdateAPK from 'rn-update-apk';
import { ThemeProvider } from 'styled-components';

import Player from '~/components/Player';
import PlaylistModal from '~/components/PlaylistModal';
import UpdateModal from '~/components/UpdateModal';
import env from '~/config/env';

import Routes from './routes';

LogBox.ignoreLogs([
  'Warning: componentWillReceiveProps has been renamed',
  'VirtualizedLists',
  'React.createElement',
  'Warning: Failed prop type: The prop `source`',
  'Warning: Failed prop type: Invalid prop `component`',
  'Source.uri',
  'Cannot update a component',
  'currentlyFocusedField',
]);

function App() {
  const { t } = useTranslation();
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

  useEffect(() => {
    const updater = new UpdateAPK.UpdateAPK({
      apkVersionUrl: env.UPDATER_URL,
      fileProviderAuthority: 'com.mayconbenito.stmusic.provider',

      needUpdateApp: needUpdate => {
        Alert.alert(t('update_modal.new_update'), '', [
          { text: t('update_modal.cancel'), onPress: () => {} },
          {
            text: t('update_modal.update'),
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
                ? t('update_modal.force_update')
                : t('update_modal.title')
            }
            progress={progress}
          />
        )}
      </ThemeProvider>
    </>
  );
}

export default codePush({
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
})(App);
