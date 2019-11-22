import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #141414;
  padding-top: 10;
  padding-bottom: ${props => 10 + props.playerHeight};
`;

export const ScrollerContainer = styled.View`
  padding-left: 10;
  margin-bottom: 30;
`;

export const ScrollerHeader = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ScrollerHeaderButton = styled(MaterialIcons).attrs({
  size: hp(3.4),
  color: '#d99207',
  name: 'play-arrow',
})``;

export const ScrollerTitleText = styled.Text`
  font-size: ${hp(3.4)};
  color: #d99207;
  margin-bottom: 5;
`;

export const List = styled.FlatList.attrs({
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: {
    alignItems: 'flex-start',
  },
})``;
