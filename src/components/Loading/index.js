import React from 'react';
import { View, ActivityIndicator } from 'react-native';

function Loading({ animating, size = 36, color = '#d99207' }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator color={color} animating={animating} size={size} />
    </View>
  );
}

export default Loading;
