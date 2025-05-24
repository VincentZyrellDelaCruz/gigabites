import React, { useState } from 'react';
import { StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { DarkModeProvider } from './components/DarkMode';
import { getColors } from './components/colorThemes';
import { UserProvider } from './components/UserContext';
import HomeStack from './routes/Stack';

export default function App() {
  const [isDarkMode] = useState(false);
  const colors = getColors(isDarkMode);

  return (
    <DarkModeProvider>
      <UserProvider>
        <NavigationContainer>
          <SafeAreaView style={styles.container}>
            <StatusBar barStyle={isDarkMode ? "dark-content" : "light-content"} translucent={true} backgroundColor={colors.primaryColor} />
            <HomeStack isDarkMode={isDarkMode} />
          </SafeAreaView>
        </NavigationContainer>
      </UserProvider>
    </DarkModeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight, 
  },
});
