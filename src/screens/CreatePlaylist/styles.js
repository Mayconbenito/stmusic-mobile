import styled from 'styled-components/native';

export const Container = styled.KeyboardAvoidingView.attrs({
  enabled: true,
})`
  flex: 1;
  background-color: #141414;
  justify-content: center;
  align-items: flex-start;
`;

export const InputContainer = styled.View`
  width: 100%;
  flex-direction: column;
  padding-horizontal: 20;
`;

export const InputDescription = styled.Text`
  text-align: center;
  font-size: 20;
  color: #fff;
  font-weight: bold;
`;

export const Input = styled.TextInput.attrs({
  selectionColor: '#fff',
  autoFocus: true,
})`
  height: 40;
  padding-horizontal: 10;
  padding-vertical: 10;
  border-bottom-width: 2;
  border-bottom-color: #000;
  margin-bottom: 5;
  color: #fff;
  border-radius: 2;
`;

export const Submit = styled.TouchableOpacity.attrs({
  activeOpacity: 0.5,
})`
  height: 40;
  padding-horizontal: 10;
  padding-vertical: 10;
  align-items: center;
  justify-content: center;
  background-color: #d99207;
  border-radius: 20;
`;

export const SubmitText = styled.Text`
  color: #fff;
  font-size: 16;
  font-weight: bold;
`;
