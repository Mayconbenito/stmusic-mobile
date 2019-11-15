import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #141414;
  padding-horizontal: 10;
  padding-vertical: 5;
`;

export const MenuContainer = styled.View`
  flex-direction: row;
  justify-content: flex-start;
`;

export const MenuItem = styled.TouchableOpacity`
  margin-right: 10;
  border-bottom-color: #d99207;
  padding-bottom: 3;
  border-bottom-width: ${props => (props.active ? 2 : 0)};
`;

export const MenuText = styled.Text`
  color: #fff;
  font-size: ${hp(2.3)};
  font-weight: bold;
`;
