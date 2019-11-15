import AsyncStorage from '@react-native-community/async-storage';
import React, { useState, useRef } from 'react';
import { View } from 'react-native';
import * as Yup from 'yup';

import HeaderBackButton from '~/components/HeaderBackButton';
import api from '~/services/api';

import {
  Container,
  Form,
  InputGroup,
  Input,
  InputError,
  FormMessage,
  Button,
  TextButton,
} from './styles';

function Register(props) {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [errors, setErrors] = useState();
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState();

  const inputEmailRef = useRef();
  const inputPasswordRef = useRef();

  function handleNameChange(txt) {
    setName(txt);
  }

  function handleEmailChange(txt) {
    setEmail(txt);
  }

  function handlePasswordChange(txt) {
    setPassword(txt);
  }

  async function handleRegister() {
    try {
      setLoading(true);
      const response = await api.post('/register', {
        name,
        email,
        password,
      });

      if (response.status === 200) {
        setLoading(false);

        await AsyncStorage.setItem('@STMusic:JWT', response.data.jwt);
        await AsyncStorage.setItem(
          '@STMusic:user',
          JSON.stringify(response.data.user)
        );

        props.navigation.navigate('AppStack');
      }
    } catch (err) {
      setLoading(false);
      if (err.response.data.error.code === 'EmailAlreadyUsed') {
        setMessage('Endereço de email já cadastrado');
      }
    }
  }

  async function handleSubmit() {
    try {
      const schema = Yup.object().shape({
        name: Yup.string()
          .max(30, 'Nome deve ter no maximo 30 caracteres')
          .required('Nome é obrigatório'),
        email: Yup.string()
          .email('O formato de é email inválido')
          .required('O email é obrigatório'),
        password: Yup.string()
          .min(6, 'A senha deve ter no mínimo 6 caracteres')
          .required('A senha é obrigatória'),
      });

      const validation = await schema.validate(
        { name, email, password },
        { abortEarly: false }
      );

      if (validation) {
        setErrors();
        handleRegister();
      }
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach(error => {
        validationErrors[error.path] = error.message;
      });

      setErrors(validationErrors);
    }
  }

  return (
    <Container>
      <Form>
        <InputGroup>
          <Input
            value={name}
            onChangeText={handleNameChange}
            placeholder="Seu nome"
            returnKeyType="next"
            autoCompleteType="name"
            onSubmitEditing={() => inputEmailRef.current.focus()}
          />
          {errors && errors.name && <InputError>{errors.name}</InputError>}
        </InputGroup>
        <InputGroup>
          <Input
            ref={inputEmailRef}
            value={email}
            onChangeText={handleEmailChange}
            placeholder="Seu endereço de email"
            returnKeyType="next"
            keyboardType="email-address"
            autoCompleteType="email"
            onSubmitEditing={() => inputPasswordRef.current.focus()}
          />
          {errors && errors.email && <InputError>{errors.email}</InputError>}
        </InputGroup>
        <InputGroup>
          <Input
            ref={inputPasswordRef}
            value={password}
            onChangeText={handlePasswordChange}
            placeholder="Sua senha"
            returnKeyType="done"
            secureTextEntry
            onSubmitEditing={handleSubmit}
          />
          {errors && errors.password && (
            <InputError>{errors.password}</InputError>
          )}
        </InputGroup>

        <Button onPress={handleSubmit}>
          <TextButton>{loading ? 'Carregando...' : 'Criar Conta'}</TextButton>
        </Button>

        {message && <FormMessage>{message}</FormMessage>}
      </Form>
    </Container>
  );
}

Register.navigationOptions = ({ navigation }) => ({
  headerStyle: {
    backgroundColor: '#141414',
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
    },
    shadowColor: 'transparent',
    elevation: 0,
  },
  headerLeft: <HeaderBackButton onPress={() => navigation.goBack()} />,
  title: 'Registrar',
  headerTitleStyle: {
    flex: 1,
    textAlign: 'center',
    color: '#FFF',
    textTransform: 'uppercase',
  },
  headerRight: <View />,
});

export default Register;
