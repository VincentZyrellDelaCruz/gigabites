import React, {useRef, useState, useEffect} from 'react';
import { Animated, StyleSheet, Text, View, ScrollView } from 'react-native';
import { getGlobalStyles } from '../components/globalStyles';
import { useDarkMode } from '../components/DarkMode';
import { getColors } from '../components/colorThemes';
import { CustomBackButton } from '../components/CustomBackButton';

const About = () => {
  const { isDarkMode } = useDarkMode();
  const globalStyles = getGlobalStyles(isDarkMode);
  const colors = getColors(isDarkMode);
  const [appVersion, setAppVersion] = useState('1.0.0'); // Example version

  const scrollY = useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    setTimeout(() => {
      setAppVersion('1.1.0');
    }, 1000);
  }, []);

  return (
    <View style={globalStyles.container}>
      
      {/* This header only appears when the screen scrolls down */}
      <Animated.View style={[globalStyles.header, globalStyles.shadow, {opacity: headerOpacity}]}>
        <CustomBackButton /> 
        <Text style={globalStyles.h1}>About Us</Text>
      </Animated.View>

      <Animated.ScrollView style={globalStyles.container}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false}
        )}
        scrollEventThrottle={15}>

        <Text style={[globalStyles.h1, {paddingTop: 35, textAlign: 'center', marginBottom: 20}]}>About Us</Text>

        <View style={[styles.sectionContainer, globalStyles.shadow]}>
          <Text style={styles.sectionTitle}>Our Story</Text>
          <Text style={styles.sectionText}>
          We started this journey with a simple goal to make home cooking easier, healthier, and more meaningful for families everywhere. As a team, we believe that good food brings people together, and every great meal begins with the right ingredients. That's why we’re building this app to help you find recipes and ingredients that are not just delicious, but also perfect for your family's needs. Whether you're planning a quick dinner or a special weekend feast, we're here to make every meal a little easier, and a lot more memorable.
          </Text>
        </View>

        <View style={[styles.sectionContainer, globalStyles.shadow]}>
          <Text style={styles.sectionTitle}>Our Team</Text>
          <Text style={styles.sectionText}>
            We are a passionate and dedicated team driven by a commitment to excellence. Our diverse backgrounds and unique skill sets allow us to bring fresh perspectives, innovative ideas, and well-rounded solutions to the table.
          </Text>
          {/* You could add more details about team members here if needed */}
        </View>

        <View style={[styles.sectionContainer, globalStyles.shadow]}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.sectionText}>
          Got questions or feedback? We’re all ears, feel free to reach out!
          </Text>
          <Text style={styles.contactInfo}>Email: GigaBites++@gmail.com</Text>
          <Text style={styles.contactInfo}>Website: GigaBites++</Text>
          {/* Add other contact information as needed */}
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>App Version: {appVersion}</Text>
        </View>

      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sectionContainer: {
    padding: 20,
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  contactInfo: {
    fontSize: 16,
    marginTop: 5,
    color: '#007bff',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
    color: 'gray',
  },
});

export default About;