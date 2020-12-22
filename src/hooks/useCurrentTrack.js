import { useRef, useEffect, useState } from 'react';
import TrackPlayer from 'react-native-track-player';

const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    if (!delay) return;
    const id = setInterval(savedCallback.current, delay);
    return () => clearInterval(id);
  }, [delay]);
};

const useCurrentTrack = (interval = 1000) => {
  const initialState = null;

  const [state, setState] = useState(initialState);

  const getCurrentTrack = async () => {
    const currentTrackId = await TrackPlayer.getCurrentTrack();
    const currentTrack = await TrackPlayer.getTrack(currentTrackId);

    setState(currentTrack);
  };

  useInterval(getCurrentTrack, interval);
  return state;
};

export default useCurrentTrack;
