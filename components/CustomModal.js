import React, { useState, useRef } from 'react';
import { View, Text, Modal, Animated, TouchableOpacity, StyleSheet } from 'react-native';
import { getColors } from './colorThemes';
import { useDarkMode } from '../components/DarkMode';
import { getGlobalStyles } from '../components/globalStyles';

const CustomModal = ({ isVisible, onClose, title, message, isSingleBtn, accept, isError }) => {
  const { isDarkMode } = useDarkMode();
  const globalStyles = getGlobalStyles(isDarkMode);
  const colors = getColors(isDarkMode);

  const slideAnimation = useRef(new Animated.Value(1000)).current; 

  // Handler functions for displaying and hiding modal transitions 
  const handleOpen = () => {
    Animated.timing(slideAnimation, {
      toValue: 0, 
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const handleClose = () => {
    Animated.timing(slideAnimation, {
      toValue: 600, 
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose()); 
  };
  const handleAccept = () => {
    accept();
    handleClose();
  };

  return (
    <Modal visible={isVisible} transparent animationType="none" onShow={handleOpen}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.modalContainer, { backgroundColor: isError ? colors.errorColor : colors.surfaceColor, transform: [{ translateY: slideAnimation }] }]}>
          <View>
            <Text style={[globalStyles.h4, {marginBottom: 15, textAlign: 'center',}, isError && {color: colors.buttonTextColor}]}>{title}</Text>
          </View>
          <Text style={[globalStyles.text, {marginBottom: 15, textAlign: 'center'}, isError && {color: colors.buttonTextColor}]}>{message}</Text>
          {
            isSingleBtn == true ?
            <TouchableOpacity onPress={handleAccept} style={[globalStyles.button, {alignItems: 'center'} ]}>
              <Text style={globalStyles.buttonText}>Ok</Text>
            </TouchableOpacity>
            :
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={handleAccept} style={[globalStyles.button, styles.modalBtns, {marginRight: 5} ]}>
                <Text style={globalStyles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleClose} style={[globalStyles.button, styles.modalBtns, {marginLeftt: 5} ]}>
                <Text style={globalStyles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          }

        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)', 
  },
  modalContainer: { 
    width: 300, 
    padding: 20, 
    borderRadius: 20, 
  },
  modalBtns: {
    flex: 1,
  }
});

export default CustomModal;