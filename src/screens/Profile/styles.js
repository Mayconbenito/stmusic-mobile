import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #141414;
  align-items: center;
  justify-content: space-around;
  padding-bottom: ${props => (props.theme.showPlayer ? 57 : 0)};
`;

export const User = styled.View`
  flex-direction: column;
  align-items: center;
`;

export const Image = styled.Image`
  width: ${wp(35)};
  height: ${wp(35)};
  border-radius: ${wp(35)};
`;

export const Name = styled.Text`
  color: #d99207;
  font-size: ${hp(2.8)};
  font-weight: bold;
  margin-top: 10;
  text-align: center;
`;

export const LogoutButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.5,
})`
  width: ${wp(40)};
  border-radius: 15;
  height: 35;
  background-color: #d99207;
  justify-content: center;
  align-items: center;
  margin-bottom: 10;
`;

export const LogoutButtonText = styled.Text`
  color: #000;
  font-size: ${hp(2.1)};
  font-weight: bold;
  text-align: center;
`;
