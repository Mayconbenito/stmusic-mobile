import styled from 'styled-components/native';

import { getHeaderHeight } from '~/helpers/headerDefaultHeight';

export const Container = styled.View`
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 5;
  elevation: 1;
  justify-content: flex-end;
`;

export const ClickArea = styled.View`
  flex: 1;
  background-color: transparent;
`;

export const Selector = styled.View`
  width: 100%;
  height: 500;
  bottom: 0;
  background-color: #000;
`;

export const Header = styled.View`
  height: ${getHeaderHeight()};
  border-bottom-width: 1;
  border-bottom-color: #141414;
  align-items: center;
  justify-content: center;
`;

export const HeaderText = styled.Text`
  color: #fff;
  font-size: 18;
`;

export const List = styled.FlatList`
  padding-horizontal: 10;
`;
