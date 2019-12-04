import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Header } from 'react-navigation-stack';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #141414;
  padding-bottom: ${props => props.playerHeight};
`;

export const InputContainer = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: ${Header.HEIGHT};
  padding-horizontal: 10px;
  border-bottom-width: 2;
  border-bottom-color: #000;
`;

export const Input = styled.TextInput.attrs({
  placeholderTextColor: '#d99207',
  selectionColor: '#d99207',
})`
  flex: 1;
  padding-vertical: 15;
  padding-horizontal: 10;
  color: #d99207;
  font-weight: bold;
`;

export const Results = styled.View``;

export const List = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
})``;

export const SectionTitle = styled.Text`
  color: #d99207;
  font-size: ${hp(3.1)};
  font-weight: bold;
`;
