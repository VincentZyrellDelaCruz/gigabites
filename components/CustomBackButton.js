import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getColors } from '../components/colorThemes';

export const CustomBackButton = () => {
  const navigation = useNavigation();
  const colors = getColors();

  return (
    <View style={[styles.backBtn, {backgroundColor: colors.primaryColor,}]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={24} color={colors.buttonTextColor} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  backBtn: {
    position: 'absolute', 
    top: 10, 
    left: 10, 
    zIndex: 999, 
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
    width: 40,
    height: 40,
    borderRadius: 20,
  }
});