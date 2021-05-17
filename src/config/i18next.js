import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import enUS from '../translations/en-us.json';
import ptBR from '../translations/pt-br.json';

const fallbackLng = ['en-US'];

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: cb => {
    const primaryLanguage = RNLocalize.getLocales()[0].languageTag;
    cb(primaryLanguage);
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng,
    debug: false,
    resources: { 'en-US': enUS, 'pt-BR': ptBR },
  });
