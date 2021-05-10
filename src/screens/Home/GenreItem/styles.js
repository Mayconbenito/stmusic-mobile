import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity.attrs({
  activeOpacity: 0.5,
})`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 130;
  height: 130;
  background-color: #4d120f;
  margin-right: 10;
`;

export const Name = styled.Text`
  color: #d99207;
  font-size: ${hp(2.8)};
`;
