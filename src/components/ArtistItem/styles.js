import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styled from 'styled-components/native';

import ImageFallback from '~/components/ImageFallback';

export const Container = styled.TouchableOpacity.attrs({
  activeOpacity: 0.5,
})`
  flex-direction: row;
  margin-top: 10;
  align-items: center;
`;

export const Image = styled(ImageFallback)`
  width: 60px;
  height: 60px;
  border-radius: 60px;
  margin-right: 10px;
`;

export const Details = styled.View`
  flex-direction: column;
  justify-content: center;
`;

export const Name = styled.Text`
  font-size: ${hp(2.6)};
  color: #d99207;
`;

export const Followers = styled.Text`
  font-size: ${hp(1.9)};
  color: #606060;
`;
