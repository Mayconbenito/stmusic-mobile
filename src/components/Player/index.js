import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Keyboard, BackHandler } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';

import env from '~/config/env';
import useCurrentTrack from '~/hooks/useCurrentTrack';
import usePlaybackState from '~/hooks/usePlaybackState';
import api from '~/services/api';
import { Creators as PlayerActions } from '~/store/ducks/player';
import { Creators as PlaylistModalActions } from '~/store/ducks/playlistModal';

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
  BigPlayerMainControls,
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

function Player() {
  const { pause, resume, prev, next, showPlayer } = PlayerActions;

  const player = useSelector(state => state.player);
  const dispatch = useDispatch();

  const playbackState = usePlaybackState();
  const currentTrack = useCurrentTrack();

  const [showBigPlayer, setShowBigPlayer] = useState(false);
  const [playCountStatus, setPlayCountStatus] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeCounter, setActiveCounter] = useState(0);

  const [paused, setPaused] = useState(false);

  useEffect(() => {
    function handleBackHandler() {
      if (showBigPlayer) {
        setShowBigPlayer(false);
        return true;
      }

      return false;
    }

    BackHandler.addEventListener('hardwareBackPress', handleBackHandler);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackHandler);
    };
  }, [showBigPlayer]);

  useEffect(() => {
    function handleKeyboardDidShow() {
      dispatch(showPlayer(false));
    }

    function handleKeyboardDidHide() {
      dispatch(showPlayer(true));
    }

    Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow);
    Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide);

    return () => {
      Keyboard.removeEventListener('keyboardDidShow', handleKeyboardDidShow);
      Keyboard.removeEventListener('keyboardDidHide', handleKeyboardDidHide);
    };
  }, []);

  // async function handleSetPlayCount() {
  //   try {
  //     await api.post(`/app/tracks/plays/${player.active.id}`);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  function formatTime(millis = 0) {
    const minutes = Math.floor(millis / 60);
    const seconds = (millis % 60).toFixed(0);

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  // function handleOnProgress(event) {
  //   setCurrentTime(event.currentTime);

  //   const percentage = Math.round(
  //     (currentTime * 100) / player.active.duration || 0
  //   );
  //   if (!playCountStatus && percentage === 45) {
  //     handleSetPlayCount();
  //     setPlayCountStatus(true);
  //   }
  // }

  // function handleFinishedPlaying() {
  //   dispatch(next());
  // }

  const showPauseButton =
    playbackState === TrackPlayer.STATE_PLAYING ||
    playbackState === TrackPlayer.STATE_BUFFERING ||
    playbackState === TrackPlayer.STATE_NONE;

  return (
    <>
      {!!player.active && player.showPlayer && (
        <Container showBigPlayer={showBigPlayer}>
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

            <BigPlayerTrackImage
              source={{
                uri:
                  currentTrack?.artwork ||
                  player?.queue?.preloadedTrack?.artwork,
              }}
              defaultSource={require('~/assets/images/fallback-square.png')}
            />
            <BigPlayerDetails>
              <BigPlayerNames>
                <BigPlayerTrackName>
                  {currentTrack?.title || player?.queue?.preloadedTrack?.title}
                </BigPlayerTrackName>
                <ArtistsNames>
                  <BigPlayerArtistName>
                    {currentTrack?.artist ||
                      player?.queue?.preloadedTrack?.artist}
                  </BigPlayerArtistName>
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
                  <View style={{ width: 40, height: 40 }} />
                  <BigPlayerMainControls>
                    <Control onPress={() => dispatch(prev())}>
                      <MaterialIcons
                        name="skip-previous"
                        size={40}
                        color="#d99207"
                      />
                    </Control>
                    {showPauseButton && (
                      <Control onPress={() => dispatch(pause())}>
                        <MaterialIcons name="pause" size={60} color="#d99207" />
                      </Control>
                    )}
                    {!showPauseButton && (
                      <Control onPress={() => dispatch(resume())}>
                        <MaterialIcons
                          name="play-arrow"
                          size={60}
                          color="#d99207"
                        />
                      </Control>
                    )}
                    <Control onPress={() => dispatch(next())}>
                      <MaterialIcons
                        name="skip-next"
                        size={40}
                        color="#d99207"
                      />
                    </Control>
                  </BigPlayerMainControls>
                  {console.log(currentTrack?.id)}
                  <Control
                    onPress={() =>
                      dispatch(PlaylistModalActions.openModal(currentTrack?.id))
                    }
                  >
                    <MaterialIcons
                      name="playlist-add"
                      size={40}
                      color="#D99207"
                    />
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
                    source={{
                      uri:
                        currentTrack?.artwork ||
                        player?.queue?.preloadedTrack?.artwork,
                    }}
                    defaultSource={require('~/assets/images/fallback-square.png')}
                  />
                  <Info>
                    <TrackName>
                      {currentTrack?.title ||
                        player?.queue?.preloadedTrack?.title}
                    </TrackName>
                    <ArtistsNames>
                      <ArtistName>
                        {currentTrack?.artist ||
                          player?.queue?.preloadedTrack?.artist}
                      </ArtistName>
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
                  {showPauseButton && (
                    <Control onPress={() => dispatch(pause())}>
                      <MaterialIcons name="pause" size={30} color="#d99207" />
                    </Control>
                  )}
                  {!showPauseButton && (
                    <Control onPress={() => dispatch(resume())}>
                      <MaterialIcons
                        name="play-arrow"
                        size={30}
                        color="#d99207"
                      />
                    </Control>
                  )}
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

export default Player;
