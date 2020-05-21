import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #141414;
  padding-horizontal: 10;
  padding-vertical: 5;
  margin-bottom: ${props => (props.theme.showPlayer ? 57 : 0)};
`;

export const WarningText = styled.Text`
  color: #d99207;
  font-size: ${hp(2.1)};
`;
