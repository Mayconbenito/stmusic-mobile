import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  margin-bottom: ${props => props.playerHeight};
`;

export const WarningText = styled.Text`
  color: #d99207;
  font-size: ${hp(2.1)};
`;
