import React from 'react';
import { View } from 'react-native';

import { Container, Logo, Description, Button, TextButton } from './styles';

function Welcome({ navigation }) {
  navigation.setOptions({
    headerShown: false,
  });
  return (
    <Container>
      <Logo />
      <Description>Ouça milhares de músicas gratuitamente.</Description>

      <View>
        <Button onPress={() => navigation.navigate('Register')}>
          <TextButton>Criar Conta</TextButton>
        </Button>

        <Button onPress={() => navigation.navigate('Login')}>
          <TextButton>Fazer Login</TextButton>
        </Button>
      </View>
    </Container>
  );
}

export default Welcome;
