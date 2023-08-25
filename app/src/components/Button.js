import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {TextHandler} from './TextHandler';

export function Button({
  ButtonContainerStyle,
  onPress,

  textstyle,
  title,
}) {
  return (
    <TouchableOpacity
      style={[Styles.ButtonContainer, ButtonContainerStyle || {}]}
      onPress={() => (onPress ? onPress() : {})}>
      <TextHandler style={[Styles.localtextstyle, textstyle || {}]}>
        {title}
      </TextHandler>
    </TouchableOpacity>
  );
}
const Styles = StyleSheet.create({
  ButtonContainer: {
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 3,
    shadowRadius: 10,
    marginVertical: 10,
  },
  localtextstyle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 24,
  },
  inner: {},
});
