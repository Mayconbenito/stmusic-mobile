import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import styled from 'styled-components/native';

export const Container = styled.KeyboardAvoidingView.attrs({
  enabled: true,
})`
  flex: 1;
  background-color: #141414;
  align-items: center;
  padding-top: ${hp(20)};
  padding-bottom: ${hp(20)};
  justify-content: center;
`;

export const Form = styled.View`
  align-items: center;
`;

export const InputGroup = styled.View`
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 5;
  height: 75;
`;

export const Input = styled.TextInput.attrs({
  placeholderTextColor: '#D99207',
  selectionColor: '#D99207',
})`
  color: #d99207;
  width: ${wp(70)};
  height: 55;
  border-radius: 2;
  background-color: #000;
  padding-vertical: 5;
  padding-horizontal: 10;
  font-weight: bold;
`;

export const InputError = styled.Text`
  color: #d99207;
  line-height: 20;
  font-size: ${hp(2)};
`;

export const FormMessage = styled.Text`
  color: #d99207;
  font-size: ${hp(2.3)};
  margin-top: 5;
`;

export const Button = styled.TouchableOpacity.attrs({
  activeOpacity: 0.5,
})`
  width: ${wp(70)};
  border-radius: 20;
  height: 40;
  background-color: #d99207;
  align-items: center;
  justify-content: center;
  padding-horizontal: 30;
  padding-vertical: 10;
`;

export const TextButton = styled.Text`
  font-size: ${hp(2.4)};
  color: #fff;
  font-weight: bold;
  text-align: center;
`;
