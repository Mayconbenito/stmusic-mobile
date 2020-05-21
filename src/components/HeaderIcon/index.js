import React from 'react';
import { View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

function HeaderIcon() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <MaterialIcons name="audiotrack" color="#D99207" size={36} />
    </View>
  );
}

export default HeaderIcon;
