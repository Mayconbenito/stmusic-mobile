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
`;

export const Image = styled(ImageFallback)`
  width: 60;
  height: 60;
  border-radius: 2;
  margin-right: 10;
  border-width: ${props => (props.imageBorder ? 1 : 0)};
  border-color: #141414;
`;

export const Details = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

export const Title = styled.Text`
  font-size: ${hp(2.6)};
  color: #d99207;
`;

export const TracksCount = styled.Text`
  font-size: ${hp(1.9)};
  color: #606060;
`;
