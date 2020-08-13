import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

import HeaderBackButton from '~/components/HeaderBackButton';
import Loading from '~/components/Loading';
import api from '~/services/api';
import { Creators as SessionActions } from '~/store/ducks/session';

import { InputLabel } from '../Login/styles';
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

function Register({ navigation }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  navigation.setOptions({
    headerStyle: {
      backgroundColor: '#141414',
      shadowRadius: 0,
      shadowOffset: {
        height: 0,
      },
      shadowColor: 'transparent',
      elevation: 0,
    },
    headerLeft: () => <HeaderBackButton onPress={() => navigation.goBack()} />,
    title: t('signup.title'),
    headerTitleStyle: {
      flex: 1,
      textAlign: 'center',
      color: '#FFF',
      textTransform: 'uppercase',
    },
    headerRight: () => <View />,
  });

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
        dispatch(
          SessionActions.createSession({
            jwt: response.data.jwt,
            user: response.data.user,
          })
        );
      }
    } catch (err) {
      setLoading(false);
      if (err.response.data.error.code === 'EmailAlreadyUsed') {
        setMessage(t('signup.email_already_used'));
      }
    }
  }

  async function handleSubmit() {
    try {
      const schema = Yup.object().shape({
        name: Yup.string()
          .max(30, t('signup.name_length'))
          .required(t('signup.name_is_required')),
        email: Yup.string()
          .email(t('signup.invalid_email_format'))
          .required(t('signup.email_is_required')),
        password: Yup.string()
          .min(6, t('signup.password_length'))
          .required(t('signup.password_is_required')),
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
          <InputLabel>{t('signup.name_input')}</InputLabel>
          <Input
            value={name}
            onChangeText={handleNameChange}
            placeholder={t('signup.name_input_placeholder')}
            returnKeyType="next"
            autoCompleteType="name"
            onSubmitEditing={() => inputEmailRef.current.focus()}
          />
          {errors && errors.name && <InputError>{errors.name}</InputError>}
        </InputGroup>
        <InputGroup>
          <InputLabel>{t('signup.email_input')}</InputLabel>
          <Input
            ref={inputEmailRef}
            value={email}
            onChangeText={handleEmailChange}
            placeholder={t('signup.email_input_placeholder')}
            returnKeyType="next"
            keyboardType="email-address"
            autoCompleteType="email"
            onSubmitEditing={() => inputPasswordRef.current.focus()}
          />
          {errors && errors.email && <InputError>{errors.email}</InputError>}
        </InputGroup>
        <InputGroup>
          <InputLabel>{t('signup.password_input')}</InputLabel>
          <Input
            ref={inputPasswordRef}
            value={password}
            onChangeText={handlePasswordChange}
            placeholder={t('signup.password_input_placeholder')}
            returnKeyType="done"
            secureTextEntry
            onSubmitEditing={handleSubmit}
          />
          {errors && errors.password && (
            <InputError>{errors.password}</InputError>
          )}
        </InputGroup>

        <Button onPress={handleSubmit}>
          {!loading ? (
            <TextButton>{t('signup.sign_up')}</TextButton>
          ) : (
            <Loading animating size={24} color="#000" />
          )}
        </Button>

        {message && <FormMessage>{message}</FormMessage>}
      </Form>
    </Container>
  );
}

export default Register;
