import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #141414;
  align-items: center;
  justify-content: space-between;
  padding-top: ${hp(25)};
  padding-bottom: ${hp(10)};
`;

export const Logo = styled.Image.attrs({
  resizeMode: 'contain',
  source: require('~/assets/images/logo.png'),
})`
  width: ${wp(70)};
`;

export const Button = styled.TouchableOpacity.attrs({
  activeOpacity: 0.5,
})`
  width: ${wp(70)};
  height: 40;
  border-radius: 15;
  background-color: #d99207;
  justify-content: center;
  align-items: center;
  margin-bottom: 10;
`;

export const TextButton = styled.Text`
  font-size: ${hp(2.4)};
  color: #000;
  font-weight: bold;
  text-align: center;
`;

export const Description = styled.Text`
  width: ${wp(70)};
  margin-bottom: 50;
  font-size: ${hp(3)};
  font-weight: bold;
  color: #fff;
  text-align: center;
`;
