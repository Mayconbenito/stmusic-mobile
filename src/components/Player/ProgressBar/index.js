import React from 'react';
import { View } from 'react-native';

function ProgressBar({ style, value }) {
  return (
    <View style={style}>
      <View
        style={{
          backgroundColor: '#d99207',
          width: `${value}%`,
          height: '100%',
        }}
      />
    </View>
  );
}

export default ProgressBar;
