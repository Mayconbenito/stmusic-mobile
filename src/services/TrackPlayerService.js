import TrackPlayer from 'react-native-track-player';

import { Creators as PlayerActions } from '~/store/ducks/player';

import store from '../store';

export default async () => {
  TrackPlayer.addEventListener('remote-play', () => {
    store.dispatch(PlayerActions.resume());
  });

  TrackPlayer.addEventListener('remote-pause', () => {
    store.dispatch(PlayerActions.pause());
  });

  TrackPlayer.addEventListener('remote-next', () => {
    store.dispatch(PlayerActions.next());
  });

  TrackPlayer.addEventListener('remote-previous', () => {
    store.dispatch(PlayerActions.prev());
  });

  TrackPlayer.addEventListener('remote-stop', () => {
    store.dispatch(PlayerActions.reset());
  });

  // async function handlePlayerProgress() {
  //   const currentTrackId = await TrackPlayer.getCurrentTrack();

  //   // fix find in array
  //   if (currentTrackId) {
  //     const count = [];
  //     const position = await TrackPlayer.getPosition();
  //     const duration = await TrackPlayer.getDuration();

  //     const percentage = Math.round((position * 100) / duration || 0);
  //     if (!count.find(item => item === currentTrackId) && percentage === 5) {
  //       count.push(currentTrackId);
  //       console.log('Should set play count', currentTrackId);
  //       store.dispatch(PlayerActions.setPlayCount(currentTrackId));
  //     }
  //     console.log('Should not set play count', currentTrackId);
  //   }
  // }

  // setInterval(() => handlePlayerProgress(), 1000);
};
