import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Keyboard } from 'react-native';
import { STREAMER_URL } from 'react-native-dotenv';
import MusicControl from 'react-native-music-control';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';
import { useSelector, useDispatch } from 'react-redux';

import api from '~/services/api';

import { Creators as PlayerActions } from '../../store/ducks/player';
import {
  Container,
  BigPlayerContainer,
  BigPlayerHeader,
  BigPlayerTrackImage,
  BigPlayerDetails,
  BigPlayerNames,
  BigPlayerTrackName,
  BigPlayerArtistName,
  BigPlayerBottom,
  BigPlayerProgress,
  BigPlayerProgressTime,
  BigPlayerProgressBar,
  BigPlayerControls,
  SmallPlayerContainer,
  Details,
  Image,
  Info,
  TrackName,
  ArtistsNames,
  ArtistName,
  Controls,
  Control,
  SmallPlayerProgress,
  SmallPlayerInfo,
} from './styles';

export default function Player() {
  const { pause, resume, prev, next } = PlayerActions;

  const player = useSelector(state => state.player);
  const dispatch = useDispatch();

  const [showPlayer, setShowPlayer] = useState(true);
  const [showBigPlayer, setShowBigPlayer] = useState(false);
  const [playCountStatus, setPlayCountStatus] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeCounter, setActiveCounter] = useState(0);

  const [paused, setPaused] = useState(false);
  const [notificationControls, setNotificationControls] = useState(false);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => {
      setShowPlayer(false);
    });

    Keyboard.addListener('keyboardDidHide', () => {
      setShowPlayer(true);
    });

    MusicControl.enableBackgroundMode(true);

    MusicControl.on('play', () => {
      dispatch(resume());
    });

    MusicControl.on('pause', () => {
      dispatch(pause());
    });

    MusicControl.on('previousTrack', () => {
      dispatch(prev());
    });

    MusicControl.on('nextTrack', () => {
      dispatch(next());
    });
  }, []);

  useEffect(() => {
    if (player.active.name) {
      setNotificationControls(true);
      MusicControl.enableControl('play', true);
      MusicControl.enableControl('pause', true);
      MusicControl.enableControl('stop', false);
      MusicControl.enableControl('nextTrack', true);
      MusicControl.enableControl('previousTrack', true);

      MusicControl.setNowPlaying({
        title: player.active.name,
        artwork: player.active.picture,
        artist: player.active.artists.map(artist => artist.name).join(', '),
        duration: player.active.duration,
        color: 0x141414,
        notificationIcon: 'ic_stat_icon',
      });
      setActiveCounter(activeCounter + 1);
    }

    if (!player.active && activeCounter > 0) {
      setNotificationControls(false);
      MusicControl.setNowPlaying({
        notificationIcon: 'ic_stat_icon',
      });
      MusicControl.enableControl('closeNotification', true, { when: 'always' });
    }

    setPlayCountStatus(false);
  }, [player.active.name]);

  useEffect(() => {
    if (notificationControls) {
      if (player.isPlaying === 'STOPPED') {
        MusicControl.updatePlayback({
          state: MusicControl.STATE_STOPPED,
        });
        setPaused(true);
      }

      if (player.isPlaying === 'PAUSED') {
        MusicControl.updatePlayback({
          state: MusicControl.STATE_PAUSED,
        });
        setPaused(true);
      }

      if (player.isPlaying === 'PLAYING') {
        MusicControl.updatePlayback({
          state: MusicControl.STATE_PLAYING,
        });
        setPaused(false);
      }
    }
  }, [player.isPlaying, notificationControls]);

  async function handleSetPlayCount() {
    try {
      await api.post(`/tracks/plays/${player.active.id}`);
    } catch (e) {
      console.log(e);
    }
  }

  function formatTime(millis = 0) {
    const minutes = Math.floor(millis / 60);
    const seconds = (millis % 60).toFixed(0);

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  function handleOnProgress(event) {
    setCurrentTime(event.currentTime);

    const percentage = Math.round(
      (currentTime * 100) / player.active.duration || 0
    );
    if (!playCountStatus && percentage === 45) {
      handleSetPlayCount();
      setPlayCountStatus(true);
    }
  }

  function handleFinishedPlaying() {
    dispatch(next());
  }

  return (
    <>
      {!!player.active && (
        <Container showPlayer={showPlayer} showBigPlayer={showBigPlayer}>
          <BigPlayerContainer showBigPlayer={showBigPlayer}>
            <BigPlayerHeader>
              <TouchableOpacity onPress={() => setShowBigPlayer(false)}>
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={26}
                  color="#fff"
                />
              </TouchableOpacity>
            </BigPlayerHeader>
            <Video
              source={{
                uri: `${STREAMER_URL}/yt?url=${player.active.youtubeId}`,
              }}
              paused={paused}
              playInBackground
              onEnd={handleFinishedPlaying}
              onProgress={handleOnProgress}
            />
            <BigPlayerTrackImage
              source={{ uri: player.active.picture }}
              defaultSource={require('~/assets/images/fallback-square.png')}
            />
            <BigPlayerDetails>
              <BigPlayerNames>
                <BigPlayerTrackName>{player.active.name}</BigPlayerTrackName>
                <ArtistsNames>
                  {player.active.artists.map((artist, index) => (
                    <BigPlayerArtistName key={artist.id}>
                      {(index ? ', ' : '') + artist.name}
                    </BigPlayerArtistName>
                  ))}
                </ArtistsNames>
              </BigPlayerNames>

              <BigPlayerBottom>
                {player.active.duration && (
                  <BigPlayerProgress>
                    <BigPlayerProgressTime>
                      {formatTime(currentTime)}
                    </BigPlayerProgressTime>
                    <BigPlayerProgressBar
                      value={(currentTime * 100) / player.active.duration || 0}
                    />
                    <BigPlayerProgressTime>
                      {formatTime(player.active.duration)}
                    </BigPlayerProgressTime>
                  </BigPlayerProgress>
                )}

                <BigPlayerControls>
                  <Control onPress={() => dispatch(prev())}>
                    <MaterialIcons
                      name="skip-previous"
                      size={40}
                      color="#d99207"
                    />
                  </Control>
                  {player.isPlaying === 'PLAYING' && (
                    <Control onPress={() => dispatch(pause())}>
                      <MaterialIcons name="pause" size={60} color="#d99207" />
                    </Control>
                  )}
                  {player.isPlaying === 'PLAYING' ||
                    ('STOPPED' && (
                      <Control onPress={() => dispatch(resume())}>
                        <MaterialIcons
                          name="play-arrow"
                          size={50}
                          color="#d99207"
                        />
                      </Control>
                    ))}
                  <Control onPress={() => dispatch(next())}>
                    <MaterialIcons name="skip-next" size={40} color="#d99207" />
                  </Control>
                </BigPlayerControls>
              </BigPlayerBottom>
            </BigPlayerDetails>
          </BigPlayerContainer>
          {!showBigPlayer && (
            <SmallPlayerContainer>
              <SmallPlayerProgress
                value={(currentTime * 100) / player.active.duration || 0}
              />
              <SmallPlayerInfo>
                <Details
                  onStartShouldSetResponder={() => setShowBigPlayer(true)}
                >
                  <Image
                    source={{ uri: player.active.picture }}
                    defaultSource={require('~/assets/images/fallback-square.png')}
                  />
                  <Info>
                    <TrackName>{player.active.name}</TrackName>
                    <ArtistsNames>
                      {player.active.artists.map((artist, index) => (
                        <ArtistName key={artist.id}>
                          {(index ? ', ' : '') + artist.name}
                        </ArtistName>
                      ))}
                    </ArtistsNames>
                  </Info>
                </Details>
                <Controls>
                  <Control onPress={() => dispatch(prev())}>
                    <MaterialIcons
                      name="skip-previous"
                      size={30}
                      color="#d99207"
                    />
                  </Control>
                  {player.isPlaying === 'PLAYING' && (
                    <Control onPress={() => dispatch(pause())}>
                      <MaterialIcons name="pause" size={30} color="#d99207" />
                    </Control>
                  )}
                  {player.isPlaying === 'PLAYING' ||
                    ('STOPPED' && (
                      <Control onPress={() => dispatch(resume())}>
                        <MaterialIcons
                          name="play-arrow"
                          size={30}
                          color="#d99207"
                        />
                      </Control>
                    ))}
                  <Control onPress={() => dispatch(next())}>
                    <MaterialIcons name="skip-next" size={30} color="#d99207" />
                  </Control>
                </Controls>
              </SmallPlayerInfo>
            </SmallPlayerContainer>
          )}
        </Container>
      )}
    </>
  );
}
