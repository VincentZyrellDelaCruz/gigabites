import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, Animated, StyleSheet } from 'react-native';
import { getColors } from './colorThemes';
import { useDarkMode } from '../components/DarkMode';
import { getGlobalStyles } from '../components/globalStyles';

const CustomToast = ({ isVisible, message, duration = 3000, onClose }) => {
  const { isDarkMode } = useDarkMode();
  const globalStyles = getGlobalStyles(isDarkMode);
  const colors = getColors(isDarkMode);

  const slideAnimation = useRef(new Animated.Value(1000)).current;

  useEffect(() => {
    if (isVisible) {
      // Reset position
      slideAnimation.setValue(1000);

      // Slide in
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Slide out after duration
      const timer = setTimeout(() => {
        Animated.timing(slideAnimation, {
          toValue: 600,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onClose?.();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    isVisible && (
        <Animated.View style={[styles.toast, globalStyles.shadow,
            { backgroundColor: colors.primaryColor, 
            transform: [{ translateY: slideAnimation }] }]}>
          <Text style={[globalStyles.text, {fontWeight: 500}]}>{message}</Text>
        </Animated.View>
    )
  );
};

const styles = StyleSheet.create({
    toast: {
        position: 'absolute',
        bottom: 50,
        left: 20,
        right: 20,
        padding: 20,
        borderRadius: 10,
    },
});

export default CustomToast;
