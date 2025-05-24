import React, { useRef, useState } from 'react';
import { Animated, Image, Text, Switch, Pressable, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { auth, database } from '../firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { getGlobalStyles } from '../components/globalStyles';
import { useDarkMode } from '../components/DarkMode';
import { useUser } from '../components/UserContext';
import { getColors } from '../components/colorThemes';
import CustomModal from '../components/CustomModal';
import { AntDesign, MaterialIcons, Octicons } from '@expo/vector-icons';
import avatar from '../components/avatar';

const UserCenter = ({ navigation }) => {
  const { isDarkMode, setIsDarkMode } = useDarkMode();
  const { isLoggedIn, setIsLoggedIn } = useUser();
  
  const globalStyles = getGlobalStyles(isDarkMode);
  const colors = getColors();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [profilePic, setProfilePic] = useState(avatar[0]);

  const scrollY = useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const changeProfilePic = (id) => {
    const userAvatar = avatar.find((item) => item.id === id);
    if(userAvatar) setProfilePic(userAvatar);
    else setProfilePic(avatar[0]);
  }

  // Gets/retrives user data to store to state variables and also to display to screens
  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        const user = auth.currentUser;
        if (user) {
          try {
            const userRef = ref(database, `users/${user.uid}`);
            const snapshot = await get(userRef);
  
            if (snapshot.exists()) {
              const userData = snapshot.val();
              setCurrentUser({
                username: userData.username,
                email: user.email,
                avatar: userData.avatar,
              });
              changeProfilePic(userData.avatar); // Avatar id
            } else {
              console.warn('No user data found');
              setCurrentUser({
                username: 'Unknown',
                email: user.email,
                avatar: null,
              });
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        } else {
          setCurrentUser(null);
        }
      };
  
      fetchUserData();
    }, [])
  );

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setIsLoggedIn(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Log In' }],
      });
    } catch (e) {
      console.error('Logout failed:', e);
    }
  };
  
  return (
    <View style={globalStyles.container}>
      <Animated.View style={[globalStyles.header, globalStyles.shadow, {opacity: headerOpacity}]}>
        <Text style={globalStyles.h1}>User Center</Text>
      </Animated.View>

      <Animated.ScrollView style={globalStyles.container}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false}
        )}
        scrollEventThrottle={15}
      >

        <View style={globalStyles.headerContainer}>
          <Text style={globalStyles.h1}>User Center</Text>
        </View>

        <View style={[globalStyles.userContainer, globalStyles.shadow, 
          {marginVertical: 8, alignItems: 'center', justifyContent: 'center'}]}>
          <Image source={profilePic.source} style={globalStyles.profileImg} />
          <View>
            <Text style={[globalStyles.profileName, {alignSelf: 'center'}]}>{currentUser?.username || 'Guest'}</Text>
            <Text style={[globalStyles.text, {alignSelf: 'center'}]}>{currentUser?.email || 'N/A'}</Text>
          </View>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Edit Profile', {
                username: currentUser?.username || 'Guest',
                avatarId: profilePic.id
              })} 
              style={{alignItems: 'center'}}>
                <AntDesign name='edit' size={30} color={colors.accentColor}/>
                <Text style={globalStyles.text}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={globalStyles.subContainer}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <View style={[globalStyles.selectContainer, {backgroundColor: colors.errorColor}]}>
              <Octicons name='sign-out' size={25} color={colors.buttonTextColor}/>
              <Text style={[globalStyles.text, {marginLeft: 10, color: colors.buttonTextColor}]}>Log Out</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('About')}>
            <View style={globalStyles.selectContainer}>
              <MaterialIcons name='info-outline' size={25} color={colors.textColor}/>
              <Text style={[globalStyles.text, {marginLeft: 8}]}>About App</Text>
            </View>
          </TouchableOpacity>

          <View style={[globalStyles.selectContainer, {justifyContent: 'space-between'}]}>
            <View style={{flexDirection: 'row'}}>
              <MaterialIcons name='dark-mode' size={25} color={colors.textColor}/>
              <Text style={[globalStyles.text, {marginLeft: 8}]}>Dark Mode</Text>
            </View>
            
            <Switch
              value={isDarkMode}
              onValueChange={() => setIsDarkMode((prev) => !prev)}
              trackColor={{ false: '#FFFFFF', true: colors.accentColor}}
            />
          </View>
        </View>

        <CustomModal isVisible={modalVisible} onClose={() => setModalVisible(false)}
          title='Are you sure?'
          message='You will need to login again to access this app.'
          isSingleBtn={false} 
          accept={logoutHandler}
        />
      </Animated.ScrollView>
    </View>
  );
};

export default UserCenter;
