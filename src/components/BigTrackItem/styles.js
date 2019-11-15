import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styled from 'styled-components/native';

import ImageFallback from '~/components/ImageFallback';

export const Container = styled.TouchableOpacity.attrs({
  activeOpacity: 0.5,
})`
  width: 130;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10;
`;

export const Image = styled(ImageFallback)`
  width: 130;
  height: 130;
`;

export const Details = styled.View`
  flex-direction: column;
`;

export const Name = styled.Text.attrs({
  ellipsizeMode: 'tail',
  numberOfLines: 1,
})`
  width: 130;
  color: #d99207;
  font-size: ${hp(2.2)};
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
