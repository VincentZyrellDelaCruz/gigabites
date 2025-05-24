import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { auth, database } from '../firebaseConfig';
import { push, ref, set } from 'firebase/database';
import { getGlobalStyles } from '../components/globalStyles';
import { useDarkMode } from '../components/DarkMode';
import { getColors } from '../components/colorThemes';
import { MaterialIcons } from '@expo/vector-icons';

const WriteReviewScreen = ({ navigation, route }) => {
    const { isDarkMode } = useDarkMode();
    const globalStyles = getGlobalStyles(isDarkMode);
    const colors = getColors(isDarkMode);

    const {id, title, image, desc, type} = route.params;
    const [starRating, setStarRating] = useState(0);
    const [comment, setComment] = useState('');
    const [strCtr, setStrCtr] = useState(0);

    const publishReview = async () => {
        const user = auth.currentUser;
        if (!user) return;

        // Format the current date as MM/DD/YYYY
        const date = new Date();
        const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/` +
                            `${date.getDate().toString().padStart(2, '0')}/` +
                            `${date.getFullYear()}`;

        try {
            const reviewRef = ref(database, 'reviews');
            const newReviewRef = push(reviewRef); // Generates an unique review ID

            await set(newReviewRef, {
                recipeId: id,            
                userId: user.uid,        
                rating: starRating,
                comment: comment.trim() || "", 
                date: formattedDate
            });

            navigation.goBack();
        } catch (error) {
            console.error('Failed to publish review:', error);
            alert('Error publishing review');
        }
    }; 
    
    const isStringExceed = () => {
        return strCtr > 100;
    }
    const isDisabled = () => {
        return starRating < 1 || isStringExceed(); // If the rating is 0 or below 1, the button will be disabled
    }

  return (
    <KeyboardAvoidingView behavior='padding' style={globalStyles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={[globalStyles.recipeCard, globalStyles.shadow, {marginTop: 80, marginHorizontal: 20}]}>
                <Image source={{ uri: image }} style={globalStyles.recipeImage} />
                <View style={globalStyles.recipeInfo}>
                    <Text style={globalStyles.h4}>{title}</Text>
                    <Text style={globalStyles.smallText}>({type})</Text>
                    <Text style={globalStyles.smallParagraph}>{desc.substring(0, 50)}...</Text>
                </View>
            </View>

            <View style={[styles.editContainer, globalStyles.shadow, {backgroundColor: colors.surfaceColor}]}>
                <View style={styles.ratingContainer}>
                    <TouchableOpacity onPress={() => setStarRating(1)}>
                        <MaterialIcons
                            name={starRating >= 1 ? 'star' : 'star-border'}
                            size={40}
                            style={{color: starRating >= 1 ? colors.accentColor : colors.accentColor}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setStarRating(2)}>
                        <MaterialIcons
                            name={starRating >= 2 ? 'star' : 'star-border'}
                            size={40}
                            style={{color: starRating >= 1 ? colors.accentColor : colors.accentColor}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setStarRating(3)}>
                        <MaterialIcons
                            name={starRating >= 3 ? 'star' : 'star-border'}
                            size={40}
                            style={{color: starRating >= 1 ? colors.accentColor : colors.accentColor}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setStarRating(4)}>
                        <MaterialIcons
                            name={starRating >= 4 ? 'star' : 'star-border'}
                            size={40}
                            style={{color: starRating >= 1 ? colors.accentColor : colors.accentColor}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setStarRating(5)}>
                        <MaterialIcons
                            name={starRating >= 5 ? 'star' : 'star-border'}
                            size={40}
                            style={{color: starRating >= 1 ? colors.accentColor : colors.accentColor}}
                        />
                    </TouchableOpacity>
                </View>
                
                <TextInput 
                    style={[globalStyles.textBox, globalStyles.smallText, styles.commentBox, {color: colors.textColor}]}
                    placeholder='Write your own review/comment (optional)'
                    placeholderTextColor={colors.textColor}
                    value={comment}
                    onChangeText={(text) => {
                        setComment(text);
                        setStrCtr(text.length);
                    }}
                    multiline={true}
                />
                <View style={styles.stringCtr}>
                    <Text style={{color: isStringExceed() ? colors.errorColor : colors.textColor}}>{strCtr} / 100</Text>
                </View>
                <TouchableOpacity onPress={publishReview} disabled={isDisabled()} style={{opacity: isDisabled() ? 0.5 : 1}}>
                    <View style={[globalStyles.button]} >
                        <Text style={globalStyles.buttonText}>Publish</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    commentBox: {
        alignItems: 'flex-start',
        fontSize: 16, 
        height: 100, 
    },
    editContainer: {
        flexDirection: 'column',
        marginVertical: 10,
        marginHorizontal: 15,
        padding: 20,
        borderRadius: 20,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15,
        padding: 20,
    },
    stringCtr: {
        alignItems: 'flex-end',
        marginRight: 5,
        marginVertical: 10,
    }
});
export default WriteReviewScreen;
