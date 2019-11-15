import styled from 'styled-components/native';

import ImageFallback from '~/components/ImageFallback';

export const Container = styled.TouchableOpacity.attrs({
  activeOpacity: 0.5,
})`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

export const Image = styled(ImageFallback)`
  width: 50px;
  height: 50px;
  border-radius: 50px;
`;

export const Name = styled.Text`
  color: #d99207;
  font-size: 16;
  text-align: center;
`;
