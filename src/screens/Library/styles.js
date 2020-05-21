import Animated from 'react-native-reanimated';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styled from 'styled-components/native';

export const TabBar = styled.View`
  flex-direction: row;
  align-items: center;
  height: 40;
  padding-top: 5;
  background-color: #141414;
  justify-content: flex-start;
  padding-horizontal: 10;
`;

export const TabItem = styled.TouchableOpacity`
  align-items: center;
  margin-right: 10;
  border-bottom-color: #fff;
`;

export const TabItemText = styled(Animated.Text)`
  font-weight: bold;
  font-size: ${hp(2.3)};
`;
