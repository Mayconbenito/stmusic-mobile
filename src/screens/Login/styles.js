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
  padding-bottom: ${hp(15)};
  justify-content: center;
`;

export const Form = styled.View`
  margin-top: -40;
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
  font-size: ${hp(2)};
  line-height: 20;
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
  height: 40;
  border-radius: 15;
  background-color: #d99207;
  justify-content: center;
  align-items: center;
  margin-bottom: 10;
`;

export const TextButton = styled.Text`
  font-size: ${hp(2.4)};
  color: #000;
  font-weight: bold;
  text-align: center;
`;
