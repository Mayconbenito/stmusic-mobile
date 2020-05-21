import { Dimensions, StatusBar } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import styled from 'styled-components/native';

import { getHeaderHeight } from '~/helpers/headerDefaultHeight';

import ProgressBar from './ProgressBar';

const { height } = Dimensions.get('window');

export const Container = styled.View`
  width: 100%;
  height: ${props =>
    props.showBigPlayer ? height - StatusBar.currentHeight : 54};
  position: absolute;
  flex: 1;
  bottom: ${props => (props.showBigPlayer ? 0 : 54)};
  flex-direction: column;
  opacity: ${props => (props.theme.showPlayer ? 1 : 0)};
`;

export const BigPlayerContainer = styled.View`
  width: ${props => (props.showBigPlayer ? '100%' : '0')};
  flex: 1;
  background-color: #141414;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  position: ${props => (props.showBigPlayer ? 'relative' : 'absolute')};
  opacity: ${props => (props.showBigPlayer ? 1 : 0)};
`;

export const BigPlayerHeader = styled.View`
  background-color: #000;
  width: 100%;
  height: ${getHeaderHeight()};
  justify-content: center;
  align-items: flex-start;
  padding-horizontal: 10;
  padding-vertical: 10;
  border-bottom-width: 1;
  border-bottom-color: #141414;
`;

export const BigPlayerTrackImage = styled.Image`
  width: 200;
  height: 200;
  border-radius: 2;
  margin-right: 5;
  border-color: #141414;
  border-width: 1;
  margin-top: 50;
`;

export const BigPlayerDetails = styled.View`
  flex: 1;
  align-items: center;
  padding-horizontal: 30;
  padding-bottom: 20;
  justify-content: space-between;
`;

export const BigPlayerNames = styled.View`
  flex-direction: column;
  align-items: center;
`;

export const BigPlayerTrackName = styled.Text`
  font-size: ${hp(3.5)};
  color: #d99207;
  font-weight: bold;
  margin-top: 5;
  text-align: center;
`;

export const BigPlayerArtistName = styled.Text`
  font-size: ${hp(3)};
  color: #606060;
`;

export const BigPlayerBottom = styled.View`
  width: 100%;
  flex-direction: column;
  justify-content: flex-end;
`;

export const BigPlayerProgress = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const BigPlayerProgressTime = styled.Text`
  color: #fff;
  font-size: 22;
`;

export const BigPlayerProgressBar = styled(ProgressBar)`
  flex: 1;
  height: 5;
  background-color: #fff;
  margin-horizontal: 10;
`;

export const BigPlayerControls = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const BigPlayerMainControls = styled.View`
  flex-direction: row;
  align-items: center;
  align-self: center;
`;

export const SmallPlayerContainer = styled.View`
  flex-direction: column;
  position: absolute;
  width: 100%;
  height: 57;
  bottom: 0;
  background-color: #000;
  border-bottom-color: #141414;
  border-bottom-width: 1;
  align-items: center;
`;

export const SmallPlayerInfo = styled.View`
  flex-direction: row;
  height: 54;
  align-items: center;
`;

export const Details = styled.View`
  flex: 1;
  flex-direction: row;
  padding-horizontal: 10;
  padding-vertical: 10;
`;

export const Image = styled.Image`
  width: 40;
  height: 40;
  border-radius: 2;
  margin-right: 5;
  border-color: #141414;
  border-width: 1;
`;

export const Info = styled.View`
  flex-direction: column;
  justify-content: center;
`;

export const TrackName = styled.Text.attrs({
  ellipsizeMode: 'tail',
  numberOfLines: 1,
})`
  width: ${wp(40)};
  color: #d99207;
  font-weight: bold;
  font-size: 16;
  margin-right: 100;
`;

export const ArtistsNames = styled.View`
  flex-direction: row;
`;

export const ArtistName = styled.Text`
  color: #606060;
  font-size: 14;
`;

export const Controls = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
`;

export const Control = styled.TouchableOpacity.attrs({
  hitSlop: { top: 5, left: 5, bottom: 5, right: 5 },
})``;

export const SmallPlayerProgress = styled(ProgressBar)`
  width: 100%;
  height: 3;
  background-color: #606060;
  margin-horizontal: 10;
`;
