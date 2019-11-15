import { Dimensions } from 'react-native';
import styled from 'styled-components/native';

const { width, height } = Dimensions.get('window');

export const Container = styled.View`
  position: absolute;
  width: ${width};
  height: ${height};
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
`;

export const Content = styled.View`
  width: 300;
  min-height: 200;
  background-color: #141414;
  padding-horizontal: 20;
  padding-top: 10;
  padding-bottom: 15;
  border-radius: 3;
`;

export const Title = styled.Text`
  text-align: center;
  font-weight: bold;
  font-size: 24;
  margin-bottom: 10;
  color: #d99207;
`;

export const News = styled.View``;

export const NewsTitle = styled.Text`
  font-size: 20;
  color: #d99207;
  font-weight: bold;
`;

export const NewsDescription = styled.Text`
  font-size: 16;
  color: #d99207;
`;

export const Progress = styled.View`
  flex: 1;
  align-self: flex-end;
  justify-content: flex-end;
`;

export const ProgressText = styled.Text`
  font-size: 20;
  color: #d99207;
  font-weight: bold;
  margin-bottom: 3;
`;
