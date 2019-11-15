import { FlatList } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styled from 'styled-components/native';

import ImageFallback from '~/components/ImageFallback';

export const ParentContainer = styled.View`
  flex: 1;
  background-color: #141414;
`;

export const Container = styled.View`
  flex: 1;
  background-color: #141414;
  padding-bottom: ${props => props.playerHeight};
`;

export const Details = styled.View`
  align-items: center;
  border-bottom-width: 1;
  border-bottom-color: #000;
  padding-vertical: 25;
`;

export const Image = styled(ImageFallback)`
  width: 90;
  height: 90;
  border-radius: 2;
`;

export const DetailsTitle = styled.Text`
  font-size: 22;
  color: #d99207;
  font-weight: bold;
  margin-top: 10;
`;

export const Button = styled.TouchableOpacity.attrs({
  activeOpacity: 0.5,
})`
  margin-top: 10;
  height: 30;
  border-radius: 15;
  background-color: #d99207;
  justify-content: center;
  align-items: center;
  margin-horizontal: 5;
  padding-vertical: ${hp(2.4)};
  padding-horizontal: ${hp(3.4)};
`;

export const TextButton = styled.Text`
  font-size: ${hp(2.3)};
  font-weight: bold;
  color: #000;
`;

export const List = styled(FlatList).attrs({
  contentContainerStyle: {
    paddingVertical: 10,
  },
})``;

export const WarningText = styled.Text`
  color: #d99207;
  font-size: ${hp(2.2)};
`;
