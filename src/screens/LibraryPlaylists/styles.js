import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  margin-bottom: ${props => (props.theme.showPlayer ? 57 : 0)};
`;

export const CreatePlaylistButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.5,
})`
  max-width: ${wp(40)};
  height: 35;
  border-radius: 15;
  background-color: #d99207;
  justify-content: center;
  align-items: center;
  margin-top: 10;
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
