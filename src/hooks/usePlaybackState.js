import { useState, useEffect } from 'react';
import TrackPlayer from 'react-native-track-player';

export default function() {
  const [state, setState] = useState(TrackPlayer.STATE_NONE);

  useEffect(() => {
    async function setPlayerState() {
      const playerState = await TrackPlayer.getState();
      setState(playerState);
    }

    setPlayerState();

    const sub = TrackPlayer.addEventListener(
      TrackPlayer.TrackPlayerEvents.PLAYBACK_STATE,
      data => {
        setState(data.state);
      }
    );

    return () => {
      sub.remove();
    };
  }, []);

  return state;
}
