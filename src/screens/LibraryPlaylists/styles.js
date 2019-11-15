import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  margin-bottom: ${props => props.playerHeight};
`;

export const CreatePlaylistButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.5,
})`
  max-width: ${wp(40)};
  margin-top: 10;
  height: 30;
  border-radius: 20;
  background-color: #d99207;
  justify-content: center;
  align-items: center;
  padding-vertical: ${hp(2.3)};
  padding-horizontal: ${hp(3.4)};
`;

export const CreatePlaylistButtonText = styled.Text`
  font-size: ${hp(2.1)};
  font-weight: bold;
  color: #000;
  text-align: center;
`;

export const WarningText = styled.Text`
  color: #d99207;
  margin-top: 2;
  font-size: ${hp(2.1)};
`;
