const dev = {
  API_URL: 'https://stmusic.herokuapp.com',
  STREAMER_URL: 'https://stmusic-streamer.herokuapp.com',
  UPDATER_URL: 'http://android-app-update.easytalk.tk',
};

const prod = {
  API_URL: 'https://stmusic.herokuapp.com',
  STREAMER_URL: 'https://stmusic-streamer.herokuapp.com',
  UPDATER_URL: 'http://android-app-update.stmusic.tk',
};

export default __DEV__ ? dev : prod;
