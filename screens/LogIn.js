import React, { useState, useRef, useEffect } from 'react';
import { Animated, StyleSheet, Text, TextInput, TouchableOpacity, View, Image} from 'react-native';
import { auth, database } from '../firebaseConfig';
import { query, orderByChild, equalTo } from 'firebase/database';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import avatar from '../components/avatar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getGlobalStyles } from '../components/globalStyles';
import { getColors } from '../components/colorThemes';
import { useDarkMode } from '../components/DarkMode';
import { useUser } from '../components/UserContext';

import CheckBox from '../components/CheckBox';
import CustomModal from '../components/CustomModal';

const LogInScreen = ({ navigation }) => {
  const { isDarkMode } = useDarkMode();
  const colors = getColors(isDarkMode);
  const globalStyles = getGlobalStyles(isDarkMode);
  const { setIsLoggedIn, isLoggedIn } = useUser(false);

  const [showLogin, setShowLogin] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [remember, setRemember] = useState(false);
  
  // Animation for header that fills up the whole screen first at given value
  const headerHeight = useRef(new Animated.Value(1000)).current; 
  // Animation for moving the logo slightly upwards 
  const logoTranslateY = useRef(new Animated.Value(0)).current; 
  const componentFade = useRef(new Animated.Value(1)).current;

  // Funtion that handles moving the header from bottom (whole screen) to top (almost half screen)
  const animateHeader = (isLogin) => {
    Animated.parallel([
      Animated.timing(headerHeight, {
        toValue: 180,
        duration: 700,
        useNativeDriver: false, // Uses JS thread for transition
      }),
      Animated.timing(logoTranslateY, {
        toValue: -40,
        duration: 700,
        useNativeDriver: false, // Uses JS thread for transition
      }),
      Animated.timing(componentFade, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ])
    .start(() => {
      setShowWelcome(false);
      setShowLogin(isLogin);
    });
  };

  // To ensure if the user is already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'GigaBites++' }],
      });
    }
  }, [isLoggedIn]);

  // Retrives recent email and password if the 'Remember Me' enabled
  useEffect(() => {
    const loadRememberedCredentials = async () => {
      const rememberMe = await AsyncStorage.getItem('rememberMe');
      if (rememberMe === 'true') {
        const savedEmail = await AsyncStorage.getItem('savedEmail');
        const savedPassword = await AsyncStorage.getItem('savedPassword');
        if (savedEmail && savedPassword) {
          setUserInput(savedEmail); // or setUsername if you separate
          setPassword(savedPassword);
          setRemember(true); // check the checkbox
        }
      }
    };

    loadRememberedCredentials();
  }, []);

  // To validate the new password based on the requirements needed
  const passwordReq = {
    isLengthValid: password.length >= 8, // Password must be at least 8 characters
    hasNumber: /\d/.test(password), // Password contains a number
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password), // Password must contain at least one special character (e.g. @, $, &)
  };

  // The button will be disabled if every fields are empty, or if the password contains a number, a symbol, and has valid length
  const isDisabled = () => {
    if (showLogin) return userInput === '' || password === '';
    else return !passwordReq.isLengthValid || !passwordReq.hasNumber || !passwordReq.hasSpecialChar || email === '' || password === '' || username === '' || repeatPassword === '';
  };

  // Varifies if the email format is valid
  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email format validation
    const emailTld = /\.(com|net|org|edu|gov|mil|io|co)$/i.test(email.trim()); // Check specific TLDs

    return emailRegex.test(email.trim()) && emailTld;
  };

  const isUserName = (input) => { 
    const trimmedInput = input.trim(); // Removes whitespace
  
    if (isEmailValid(trimmedInput)) { //Checks if the input is an email address
      console.log('The input is email')
      return { isEmail: true, email: trimmedInput, username: '' }; // Returns an object
    } else {
      console.log('The input is username')
      return { isEmail: false, email: '', username: trimmedInput }; 
    }
  };

  // Function to prevent username duplication
  const usernameExists = async (username) => {
    try {
      const usersRef = ref(database, 'users');
      const q = query(usersRef, orderByChild('username'), equalTo(username));
      const snapshot = await get(q);

      return snapshot.exists();
    } catch (error) {
      console.error('Error checking username:', error);
      return false; // Fallback if something goes wrong
    }
  };
  
  // Log In Function
  const logInHandler = async () => {
    try {
      const result = isUserName(userInput); // Call isUserName and store the result
  
      let logInEmail = '';
      let logInUsername = '';
  
      if (result.isEmail) {
        logInEmail = result.email.trim();
      } else {
        logInUsername = result.username;
  
        const usersRef = ref(database, 'users');
        const snapshot = await get(usersRef);
  
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          let found = false;
  
          for (let uid in usersData) {
            if (usersData[uid].username === logInUsername) {
              logInEmail = usersData[uid].email.trim();
              found = true;
              break;
            }
          }
  
          if (!found) {
            throw new Error('Username not found');
          }
        } else {
          throw new Error('No users found in database');
        }
      }
  
      // logInEmail should have the correct email, either from direct input or database lookup.
      const userCredential = await signInWithEmailAndPassword(auth, logInEmail.trim(), password);
      const user = userCredential.user;
      console.log('Logged in user:', user.uid);
  
      setIsLoggedIn(true);

      // If 'Remember Me' is checked, the last entered email and password will stored locally
      if (remember) {
        await AsyncStorage.setItem('rememberMe', 'true');
        await AsyncStorage.setItem('savedEmail', logInEmail);
        await AsyncStorage.setItem('savedPassword', password);
      } 
      else {
        await AsyncStorage.removeItem('rememberMe');
        await AsyncStorage.removeItem('savedEmail');
        await AsyncStorage.removeItem('savedPassword');
      }

      // User cannot go back to login unless when the user is logging out
      navigation.reset({
        index: 0,
        routes: [{ name: 'GigaBites++' }], 
      });

    } catch (e) {
      console.error('Login error:', e);
      setError('Incorrect Email/Username or Password! Please Try again.');
      setModalVisible(true);
    }
  };
  
  // Sign Up Function
  const registerHandler = async () => {
    if (password !== repeatPassword) {
      setError('The password does not match!');
      setModalVisible(true);
    } 
    else if (!isEmailValid(email.trim())) {
      setError('Invalid email address!');
      setModalVisible(true);
    }
    else if (await usernameExists(username.trim())) {
      setError('Username already taken!');
      setModalVisible(true);
    }
    else {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const user = userCredential.user;

        await set(ref(database, `users/${user.uid}`), {
          username: username,
          email: email.trim(),
          avatar: avatar[0].id
        });

        console.log('User registered and data saved');
        setIsLoggedIn(true);

        navigation.reset({
          index: 0,
          routes: [{ name: 'Avatar Setup', params: { avatarId: avatar[0].id } }],
        });
      } 
      catch (e) {
        console.error('Register error:', e);
        if (e.code === 'auth/email-already-in-use') {
          setError('Email is already in use!');
        } else {
          setError('Failed to register. Try again.');
        }
        setModalVisible(true);
      }
    }
  };

  return (
    <View style={globalStyles.container}>
      <Animated.View style={[globalStyles.headerExtend, { height: headerHeight }]}>
        <Image
          source={require('../assets/welcomeBg.png')}
          style={{
            position: 'absolute',
            top: -100,
            width: '100%', 
            height: '100%', 
            opacity: 0.15,
            zIndex: -1, 
          }}
        />
        <Animated.View style={{flexDirection: 'row', alignItems: 'center', transform: [{ translateY: logoTranslateY }]}}>
          <Image
            source={require('../assets/logoIcon.png')}
            style={{width: 50, height: 50, borderRadius: 10}}
          />
          <Text style={[globalStyles.h1, {marginLeft: 5}]}>GigaBites++</Text>
        </Animated.View>
        {showWelcome && (
          <>
            <Animated.Text style={[globalStyles.h2, { marginTop: 20, opacity: componentFade }]}>Welcome!</Animated.Text>
            <Animated.View style={{ marginTop: 230, opacity: componentFade }}>
              <TouchableOpacity
                onPress={() => animateHeader(true)}
                style={[globalStyles.button, styles.startBtn]}
              >
                <Text style={[globalStyles.text, globalStyles.buttonText]}>Log In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => animateHeader(false)}
                style={[globalStyles.button, styles.startBtn]}
              >
                <Text style={[globalStyles.text, globalStyles.buttonText]}>Sign Up</Text>
              </TouchableOpacity>
            </Animated.View>
          </>
        )}
      </Animated.View>

      {!showWelcome && (
        <>
          <Text style={[globalStyles.h3, { textAlign: 'center', marginTop: 15 }]}>
            {showLogin ? 'Log In' : 'Create Account'}
          </Text>

          <View style={styles.form}>

            {!showLogin ? (
              <TextInput
                style={globalStyles.textBox}
                value={username}
                onChangeText={setUsername}
                placeholder='Username'
                placeholderTextColor={colors.textColor}
              />
            ) : (
              <TextInput
                style={globalStyles.textBox}
                value={userInput}
                onChangeText={setUserInput}
                placeholder='Email Address or Username'
                placeholderTextColor={colors.textColor}
              />
            )}
            
            {!showLogin && (
              <TextInput
                style={globalStyles.textBox}
                value={email}
                onChangeText={setEmail}
                placeholder='Email Address'
                placeholderTextColor={colors.textColor}
              />
            )}

            <TextInput
              style={globalStyles.textBox}
              value={password}
              onChangeText={setPassword}
              placeholder='Password'
              placeholderTextColor={colors.textColor}
              secureTextEntry
            />
            
            { !showLogin &&
              <View style={styles.requirementsContainer}>
                <Text style={passwordReq.isLengthValid || password === '' ? styles.valid : [styles.invalid, {color: colors.errorColor}]}>
                  At least 8 characters
                </Text>
                <Text style={passwordReq.hasNumber || password === '' ? styles.valid : [styles.invalid, {color: colors.errorColor}]}>
                  Includes number or special character
                </Text>
                <Text style={passwordReq.hasSpecialChar || password === '' ? styles.valid : [styles.invalid, {color: colors.errorColor}]}>
                  Includes special character
                </Text>
              </View>
            }

            {!showLogin && (
              <TextInput
                style={globalStyles.textBox}
                value={repeatPassword}
                onChangeText={setRepeatPassword}
                placeholder='Repeat Password'
                placeholderTextColor={colors.textColor}
                secureTextEntry
              />
            )}

            {showLogin && (
              <View style={styles.remember}>
                <CheckBox value={remember} onValueChange={setRemember} />
                <Text style={globalStyles.text}>Remember Me</Text>
              </View>
            )}

            <TouchableOpacity
              disabled={isDisabled()}
              onPress={showLogin ? logInHandler : registerHandler}
              style={[styles.longBtn, { backgroundColor: colors.accentColor, opacity: isDisabled() ? 0.5 : 1}]}
            >
              <Text style={[globalStyles.text, globalStyles.buttonText]}>
                {showLogin ? 'Log In' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

            <View>
              <Text style={[globalStyles.text, { textAlign: 'center', marginTop: 60 }]}>
                {showLogin ? 'First time?' : 'Have already account?'}
              </Text>
              <TouchableOpacity
                onPress={() => setShowLogin(prev => !prev)}
                style={[
                  styles.longBtn,
                  {
                    borderColor: colors.accentColor,
                    borderWidth: 3,
                    backgroundColor: 'transparent',
                  },
                ]}
              >
                <Text style={[globalStyles.text, globalStyles.altButtonText]}>
                  {showLogin ? 'Create New Account' : 'Log In'}
                </Text>
              </TouchableOpacity>
            </View>

            <CustomModal
              isVisible={modalVisible}
              onClose={() => setModalVisible(false)}
              title={showLogin ? 'Unable to Log In' : 'Unable to Register'}
              message={error}
              isSingleBtn={true}
              isError={true}
              accept={() => {}}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    marginVertical: 20,
    marginHorizontal: '10%',
  },
  longBtn: {
    borderRadius: 20,
    padding: 10,
    marginTop: 15,
  },
  remember: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  startBtn: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 110,
  },
  requirementsContainer: {
    marginTop: -10,
    marginBottom: 10,
  },
  valid: {
    display: 'none',
  },
  invalid: {
    display: 'inline',
  }
});

export default LogInScreen;
