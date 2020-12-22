import { useState, useEffect } from 'react';
import TrackPlayer from 'react-native-track-player';

function formatTime(millis = 0) {
  const minutes = Math.floor(millis / 60);
  const seconds = (millis % 60).toFixed(0);

  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export default function useTrackPlayerProgress() {
  const initialState = {
    position: 0,
    duration: 0,
    formatedPosition: '00:00',
    formatedDuration: '00:00',
  };

  const [data, setData] = useState(initialState);

  useEffect(() => {
    async function getInformations() {
      const position = await TrackPlayer.getPosition();
      const duration = await TrackPlayer.getDuration();

      const formatedPosition = formatTime(position);
      const formatedDuration = formatTime(duration);

      setData({ position, duration, formatedPosition, formatedDuration });
    }

    const time = setInterval(() => getInformations(), 1000);

    return () => {
      clearInterval(time);
      setData(initialState);
    };
  }, []);

  return data;
}
