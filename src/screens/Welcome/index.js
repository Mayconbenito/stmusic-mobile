import React from 'react';
import { View } from 'react-native';

import { Container, Logo, Description, Button, TextButton } from './styles';

function Welcome({ navigation }) {
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

Welcome.navigationOptions = () => ({
  header: null,
});

export default Welcome;
