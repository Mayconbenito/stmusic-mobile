import { Dimensions, DeviceInfo, Platform } from 'react-native';

export const LANDSCAPE = 'landscape';
export const PORTRAIT = 'portrait';

export const getOrientation = () => {
  const { width, height } = Dimensions.get('window');
  return width > height ? LANDSCAPE : PORTRAIT;
};

export const getHeaderSafeAreaHeight = () => {
  const orientation = getOrientation();
  if (Platform.OS === 'ios' && orientation === LANDSCAPE && !Platform.isPad) {
    return 32;
  }

  return 56;
};

export const getHeaderHeight = () => {
  let height;
  const orientation = getOrientation();
  height = getHeaderSafeAreaHeight();
  height +=
    DeviceInfo.isIPhoneX_deprecated && orientation === PORTRAIT ? 24 : 0;

  return height;
};
