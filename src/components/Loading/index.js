import React from 'react';
import { View, ActivityIndicator } from 'react-native';

function Loading({ animating = true, size = 36, color = '#d99207', style }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator
        style={style}
        color={color}
        animating={animating}
        size={size}
      />
    </View>
  );
}

export default Loading;
