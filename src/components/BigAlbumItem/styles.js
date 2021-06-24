import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styled from 'styled-components/native';

import ImageFallback from '~/components/ImageFallback';

export const Container = styled.TouchableOpacity.attrs({
  activeOpacity: 0.5,
})`
  flex-direction: column;
  align-items: flex-start;
  margin-right: 10;
  margin-top: 7;
`;

export const Image = styled(ImageFallback)`
  width: ${props => (props.medium ? 130 : 180)};
  height: ${props => (props.medium ? 130 : 180)};
  border-radius: 2;
`;

export const Details = styled.View`
  flex-direction: column;
`;

export const Name = styled.Text.attrs({
  ellipsizeMode: 'tail',
  numberOfLines: 1,
})`
  width: ${props => (props.medium ? 130 : 180)};
  color: #d99207;
  font-size: ${hp(2.6)};
`;

export const TextList = styled.Text.attrs({
  ellipsizeMode: 'tail',
  numberOfLines: 2,
})`
  flex-direction: row;
`;

export const Type = styled.Text`
  color: #606060;
  font-size: ${hp(1.9)};
`;

export const ArtistName = styled.Text`
  color: #606060;
  font-size: ${hp(1.9)};
`;
