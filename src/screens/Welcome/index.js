import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Container, Logo, Description, Button, TextButton } from './styles';

function Welcome({ navigation }) {
  const { t } = useTranslation();

  navigation.setOptions({
    headerShown: false,
  });
  return (
    <Container>
      <Logo />
      <Description>{t('welcome.description')}</Description>

      <View>
        <Button onPress={() => navigation.navigate('Register')}>
          <TextButton>{t('welcome.signup')}</TextButton>
        </Button>

        <Button onPress={() => navigation.navigate('Login')}>
          <TextButton>{t('welcome.login')}</TextButton>
        </Button>
      </View>
    </Container>
  );
}

export default Welcome;
