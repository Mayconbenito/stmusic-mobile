import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import {
  Container,
  Content,
  Title,
  News,
  NewsTitle,
  NewsDescription,
  Progress,
  ProgressText,
} from './styles';

function ProgressBar({ progress }) {
  return (
    <View style={{ width: 260, height: 10, backgroundColor: '#000' }}>
      <View
        style={{
          width: `${progress}%`,
          height: 10,
          backgroundColor: '#d99207',
        }}
      />
    </View>
  );
}

function UpdateModal({ title, progress }) {
  const { t } = useTranslation();

  const [newsDescription, setNewsDescription] = useState(false);
  const updaterURL = 'http://android-app-update.stmusic.tk';

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await axios.get(updaterURL);
        if (response.data.message) {
          setNewsDescription(response.data.message);
        }
      } catch (e) {
        console.log(e);
      }
    }
    fetchNews();
  }, []);
  return (
    <Container>
      <Content>
        <Title>{title}</Title>
        {newsDescription && (
          <News>
            <NewsTitle>{t('update_modal.news')}</NewsTitle>
            <NewsDescription>{newsDescription}</NewsDescription>
          </News>
        )}
        <Progress>
          <ProgressText>
            {t('update_modal.downloading')} {progress}%
          </ProgressText>
          <ProgressBar progress={progress} />
        </Progress>
      </Content>
    </Container>
  );
}

export default UpdateModal;
