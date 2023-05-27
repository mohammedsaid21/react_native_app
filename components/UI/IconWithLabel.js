import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const IconWithLabel = ({ iconName, label, styleItem, onPress, disabledClick }) => {
  return (
    <TouchableOpacity style={{ alignItems: 'center',  marginBottom: 10, marginHorizontal: 15 }} onPress={onPress} disabled={disabledClick} >
      {/* style={styleItem} */}
      <View style={{ backgroundColor: disabledClick ? "#ccc" : '#4285F4', width: 40, height: 40, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
        <Ionicons name={iconName} size={26} color="#fff" />
      </View>
      {label &&
        <Text style={{ marginTop: 6, fontSize: 11 }}>{label}</Text>
      }
    </TouchableOpacity>
  );
};

export default IconWithLabel;