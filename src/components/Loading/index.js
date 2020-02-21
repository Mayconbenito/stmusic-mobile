import React from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function Loading({ animating, size = 36 }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator color="#d99207" animating={animating} size={size} />
    </View>
  );
}
