import React from 'react';
import { TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function HeaderBackButton({ onPress }) {
  return (
    <TouchableOpacity
      hitSlop={{ top: 50, left: 50, bottom: 50, right: 50 }}
      style={{ marginLeft: 5 }}
      activeOpacity={0.5}
      onPress={onPress}
    >
      <MaterialIcons name="navigate-before" size={26} color="#fff" />
    </TouchableOpacity>
  );
}
