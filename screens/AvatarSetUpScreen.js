import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, database } from '../firebaseConfig';
import { ref, get, update } from 'firebase/database';
import { getGlobalStyles } from '../components/globalStyles';
import { useDarkMode } from '../components/DarkMode';
import { getColors } from '../components/colorThemes';
import CustomModal from '../components/CustomModal';
import avatar from '../components/avatar';

const AvatarSetUpScreen = ({ navigation, route }) => {
    const { isDarkMode, setIsDarkMode } = useDarkMode();
    
    const globalStyles = getGlobalStyles(isDarkMode);
    const colors = getColors(isDarkMode);
    const [modalVisible, setModalVisible] = useState(false);
    
    const { avatarId } = route.params;
    const [selectedAvatar, setSelectedAvatar] = useState(avatar.find((item) => item.id === avatarId));

    // Sets the avatar/profile image of the new user
    const saveHandler = async () => {
        const user = auth.currentUser;
        if (!user) return;
    
        try {
            const userRef = ref(database, `users/${user.uid}`);
            await update(userRef, {
                avatar: selectedAvatar.id
            });
            setModalVisible(true);
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Error saving profile');
        } 
    };  

    const selectAvatar = (id) => {
        const userAvatar = avatar.find((item) => item.id === id);
        setSelectedAvatar(userAvatar);
    }
  
  return (
    <View style={globalStyles.container}>
        <View style={globalStyles.headerContainer}>
            <Text style={globalStyles.h1}>Set Your Avatar</Text>
        </View>

        <View style={[globalStyles.userContainer, globalStyles.shadow, {flexDirection: 'column'}]}>
            <Image source={selectedAvatar.source} style={[globalStyles.altProfileImg, {alignSelf: 'center'}]} />
        </View>
      
        <View style={[styles.editContainer, {backgroundColor: colors.surfaceColor}]}>
            <View style={{flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap'}}>
                {avatar.map((item) => (
                    <TouchableOpacity key={item.id} onPress={() => selectAvatar(item.id)}>
                    <View style={{
                        alignItems: 'center',
                        margin: 5,
                        borderColor: selectedAvatar.id === item.id ? colors.accentColor : 'transparent',
                        borderWidth: 3,
                        borderRadius: 50
                    }}>
                        <Image source={item.source} style={{width: 80, height: 80, borderRadius: 40}} />
                    </View>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity onPress={saveHandler}>
                <View style={[globalStyles.button]} >
                    <Text style={globalStyles.buttonText}>Save</Text>
                </View>
            </TouchableOpacity>
            
        </View>
        
        <CustomModal isVisible={modalVisible} onClose={() => setModalVisible(false)}
            title='Setup Success!'
            message='Your profile avatar has been set successfully.'
            isSingleBtn={true} 
            accept={() => 
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'GigaBites++' }],
                })
            }
        />

    </View>
  );
};

const styles = StyleSheet.create({
    editContainer: {
        flexDirection: 'column',
        marginVertical: 10,
        marginHorizontal: 15,
        padding: 20,
        borderRadius: 20,
    }
});
export default AvatarSetUpScreen;
