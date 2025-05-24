import React, {useState} from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import { getColors } from './colorThemes';
import { useDarkMode } from '../components/DarkMode';

const CheckBox = ({ value, onValueChange }) => {
  const { isDarkMode } = useDarkMode();
  const colors = getColors(isDarkMode);

  return (
    <Pressable
      style={[
        styles.checkBox,
        { borderColor: colors.textColor },
        value && { backgroundColor: colors.primaryColor },
      ]}
      onPress={() => onValueChange(!value)}
    >
      {value && <Text style={{ color: colors.textColor, position: 'absolute' }}>✓</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
    checkBox: {
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 5,
    }
  });

export default CheckBox;