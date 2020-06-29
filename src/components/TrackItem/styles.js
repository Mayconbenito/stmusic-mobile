import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styled from 'styled-components/native';

import ImageFallback from '~/components/ImageFallback';

export const Container = styled.TouchableOpacity.attrs({
  activeOpacity: 0.5,
})`
  flex-direction: row;
  margin-top: 10;
  align-items: center;
  justify-content: space-between;
  margin-horizontal: ${props => (props.margin ? 10 : 0)};
`;

export const Image = styled(ImageFallback)`
  width: 60;
  height: 60;
  border-radius: 2;
  margin-right: 10;
`;

export const Details = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-right: 30;
`;

export const Name = styled.Text.attrs({
  ellipsizeMode: 'tail',
  numberOfLines: 1,
})`
  font-size: ${hp(2.6)};
  color: #d99207;
`;

export const TextList = styled.Text.attrs({
  ellipsizeMode: 'tail',
  numberOfLines: 1,
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

export const IconsContainer = styled.View`
  flex-direction: row;
  border-width: 0;
  justify-content: space-between;
  align-items: center;
`;
