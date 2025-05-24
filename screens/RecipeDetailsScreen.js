import React, { useRef, useState, useCallback } from 'react';
import { Animated, StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { ref, set, get, remove } from 'firebase/database';
import { onValue, query, orderByChild, equalTo } from 'firebase/database';
import { auth, database } from '../firebaseConfig';
import { getGlobalStyles } from '../components/globalStyles';
import { getColors } from '../components/colorThemes';
import { useDarkMode } from '../components/DarkMode';
import { FontAwesome } from '@expo/vector-icons'; // Ensure you have this installed: yarn add @expo/vector-icons
import CustomToast from '../components/CustomToast';
import avatar from '../components/avatar';
import { CustomBackButton } from '../components/CustomBackButton';

const RecipeDetailsScreen = ({ route, navigation }) => {
  const { recipeId, recipeTitle, recipeImg, recipeDesc, recipeType, recipeDetails, recipeIngredients, recipeInstructions, recipeVideo} = route.params;
  const { isDarkMode } = useDarkMode();
  const globalStyles = getGlobalStyles(isDarkMode);
  const colors = getColors(isDarkMode);

  const [showIngredients, setShowIngredients] = useState(true);
  const [recipeReviews, setRecipeReviews] = useState([]);
  const [reviewUsers, setReviewUsers] = useState({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Generates star that indicates user-defined rating 
  const renderStarRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesome
          key={i}
          name={i <= rating ? 'star' : 'star-o'}
          size={18}
          color="#FFC107"
        />
      );
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  };

  const favoriteHandler = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert('You must be logged in to favorite recipes.');
      return;
    }
  
    const favRef = ref(database, `favorites/${user.uid}/${recipeId}`);
    try {
      if (isFavorite) {
        await remove(favRef); // Unfavorite
      } else {
        await set(favRef, true); // Favorite
      }
      setToastMessage(isFavorite ? 'The recipe is removed from Flavorite!' :'The recipe is added to Flavorite!');
      setIsFavorite(!isFavorite);
      setToastVisible(true);
    } catch (error) {
      console.error('Failed to update favorite:', error);
    }
  };
  
  // Automatically sets the favorite icon to on once it adds to favorites
  useFocusEffect(
    useCallback(() => {
      const checkFavorite = async () => {
        const user = auth.currentUser;
        if (!user) return;
  
        const favRef = ref(database, `favorites/${user.uid}/${recipeId}`);
        try {
          const snapshot = await get(favRef);
          setIsFavorite(snapshot.exists());
        } catch (error) {
          console.error('Error checking favorite:', error);
        }
      };
  
      checkFavorite();
    }, [recipeId])
  );   

  useFocusEffect(
    useCallback(() => {
      const reviewsRef = query(ref(database, 'reviews'), orderByChild('recipeId'), equalTo(recipeId));

      const unsubscribe = onValue(reviewsRef, (snapshot) => {
        const reviewsData = snapshot.val();
        if (reviewsData) {
          const reviewsList = Object.entries(reviewsData).map(([key, value]) => ({
            id: key,
            ...value
          }));
          setRecipeReviews(reviewsList);
        } else {
          setRecipeReviews([]);
        }
      });

      return () => unsubscribe(); // Detaches listener when leaving screen
    }, [recipeId])
  );

  useFocusEffect(
    useCallback(() => {
      const fetchReviewUserInfo = async () => {
        if (!recipeReviews || recipeReviews.length === 0) return;

        const userInfo = {};

        await Promise.all(recipeReviews.map(async (review) => {
          const userId = review.userId;
          if (!userId) return;

          try {
            const snapshot = await get(ref(database, `users/${userId}`));
            if (snapshot.exists()) {
              userInfo[userId] = snapshot.val(); // Contains username + avatar ID
            }
          } catch (err) {
            console.error(`Failed to fetch user info for ${userId}`, err);
          }
        }));

        setReviewUsers(userInfo);
      };

      fetchReviewUserInfo();
    }, [recipeReviews])
  );
  
  // If only the food recipe has empty details 
  if (!recipeDetails) {
    return (
      <View style={[globalStyles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={globalStyles.body}>Recipe details not found.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color={globalStyles.text.color} />
          <Text style={[styles.backButtonText, globalStyles.text]}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const averageRating = recipeReviews.length > 0
        ? recipeReviews.reduce((sum, review) => sum + review.rating, 0) / recipeReviews.length
        : 0;

  return (
    <View style={{flex: 1}}>
      <Animated.View style={[globalStyles.header, globalStyles.shadow, {opacity: headerOpacity}]}>
        <CustomBackButton /> 
        <Text style={globalStyles.h4}>{recipeTitle}</Text>
      </Animated.View>
      <Animated.ScrollView style={[globalStyles.container, { padding: 15 }]}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false}
        )}
        scrollEventThrottle={15}>

        {/* RECIPE IMAGE */}
        {recipeImg && <Image source={{ uri: recipeImg }} style={styles.recipeImage} />}

        {/* FOOD NAME PLUS FAVORITE BUTTON */}
        <View style={styles.titleRow}>
          <Text style={[globalStyles.h1, styles.foodName]}>{recipeTitle}</Text>
          <TouchableOpacity style={styles.favoriteButton} onPress={favoriteHandler}>
            <FontAwesome name={isFavorite ? 'heart' : 'heart-o'} size={24} color={isFavorite ? colors.accentColor : globalStyles.text.color} />
          </TouchableOpacity>
        </View>

        {/* RATING */}
        {recipeReviews.length > 0 && (
          <View style={styles.ratingContainer}>
            {renderStarRating(Math.round(averageRating))}
            <Text style={[globalStyles.body, globalStyles.text, {marginLeft: 10}]}>
              {averageRating.toFixed(1)} / 5
            </Text>
          </View>
        )}

        {/* DESCRIPTION */}
        <View style={[styles.titleRow, {marginBottom: 10}]}>
          <Text style={[globalStyles.smallParagraph]}>{recipeDesc}</Text>
        </View>

        {/* DETAILS */}
        <View style={[styles.detailsContainer, globalStyles.shadow, {backgroundColor: colors.secondaryColor}]}>
          <View style={styles.detailItem}>
            <Text style={globalStyles.h6}>Serving</Text>
            <Text style={globalStyles.text}>{recipeDetails.servings}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={globalStyles.h6}>Cook Time</Text>
            <Text style={globalStyles.text}>{recipeDetails.cookTime}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={globalStyles.h6}>Difficulty</Text>
            <Text style={globalStyles.text}>{recipeDetails.difficulty}</Text>
          </View>
        </View>

        {/* YOUTUBE VIDEO */}
        <View style={{ marginBottom: 20 }}>
          <YoutubePlayer
            height={200}
            play={false}
            videoId={recipeVideo} 
          />
        </View>

        {/* SELECTION TAB */}
        <View style={[globalStyles.selectionContainer]}>
          <View style={[globalStyles.selectedTabContainer, globalStyles.leftSelectedTContainer,
            showIngredients && {backgroundColor: colors.primaryColor, color: colors.altTextColor}]}>
            <Pressable onPress={() => setShowIngredients(true)}>
              <Text style={[globalStyles.h5, showIngredients && {color: colors.altTextColor}]}>Ingredients</Text>
            </Pressable>
          </View>
          <View style={[globalStyles.selectedTabContainer, globalStyles.rightSelectedTContainer,
            !showIngredients && {backgroundColor: colors.primaryColor}]}>
            <Pressable onPress={() => setShowIngredients(false)}>
              <Text style={[globalStyles.h5, !showIngredients && {color: colors.altTextColor}]}>Instructions</Text>
            </Pressable>
          </View>
        </View>
        {
          showIngredients ?
          /* INGREDIENTS */
          <View style={[globalStyles.tabSection, globalStyles.shadow, {backgroundColor: colors.surfaceColor}]}>
            <Text style={globalStyles.h3}>Ingredients</Text>
            {recipeIngredients.map((ingredient, index) => (
              <Text key={index} style={[globalStyles.text, styles.listItem]}>
                • {ingredient}
              </Text>
            ))}
          </View>
          :
          /* INSTRUCTIONS */
          <View style={[globalStyles.tabSection, globalStyles.shadow, {backgroundColor: colors.surfaceColor}]}>
            <Text style={globalStyles.h3}>Instructions</Text>
            {recipeInstructions.map((step, index) => (
              <Text key={index} style={[globalStyles.text, styles.listItem]}>
                {index + 1}. {step}
              </Text>
            ))}
          </View>
        }

        {/* REVIEWS */}
        <View style={styles.section}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <Text style={globalStyles.h3}>Reviews</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Create Review', 
              {id: recipeId, title: recipeTitle, image: recipeImg, desc: recipeDesc, type: recipeType})}>
              <Text style={[globalStyles.text, styles.smallBtn, {backgroundColor: colors.accentColor, color: colors.backgroundColor}]}>Write a review</Text>
            </TouchableOpacity>
          </View>
          {recipeReviews === null ? (
            <Text style={globalStyles.body}>Loading reviews...</Text>
          ) : recipeReviews.length > 0 ? (
            recipeReviews.slice(0, 2).map((review, index) => (
              <View key={index} style={[globalStyles.reviewItem, globalStyles.shadow]}>
                <View style={globalStyles.reviewHeader}>
                  {
                    reviewUsers[review.userId]?.avatar ? (
                      <Image
                        source={avatar.find(a => a.id === reviewUsers[review.userId].avatar)?.source}
                        style={{ width: 45, height: 45, borderRadius: 50}}
                      />
                    ) : (
                      <FontAwesome
                        name="user-circle"
                        size={25}
                        color={globalStyles.text.color}
                        style={{ marginRight: 6 }}
                      />
                    )
                  }
                  <View style={{ marginLeft: 10 }}>
                    <Text style={globalStyles.reviewUser}>{reviewUsers[review.userId]?.username || 'Anonymous'}</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  {renderStarRating(review.rating)}
                  <Text style={[globalStyles.text, {marginLeft: 10}]}>{review.date}</Text>
                </View>
                <Text style={globalStyles.reviewComment}>{review.comment}</Text>
              </View>
            ))
          ) : (
            <Text style={globalStyles.text}>No reviews yet.</Text>
          )}

          {recipeReviews.length > 0 && (
            <TouchableOpacity style={styles.viewAllButton}
              onPress={() => navigation.navigate('Comments', {recipeId, recipeTitle})}
            >
              <Text style={[styles.smallBtn, { textAlign: 'center', marginBottom: 20, backgroundColor: colors.accentColor, color: colors.backgroundColor }]}>View All</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.ScrollView>
      <CustomToast 
        isVisible={toastVisible}
        message={toastMessage}
        onClose={() => setToastVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButtonText: {
    marginLeft: 10,
    fontSize: 16,
  },
  recipeImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 15,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  foodName: {
    flex: 1,
    marginRight: 10,
  },
  favoriteButton: {
    padding: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 15,
    borderRadius: 15,
  },
  detailItem: {
    alignItems: 'center',
  },
  section: {
    marginBottom: 20,
  },
  listItem: {
    marginVertical: 5,
  },
  viewAllButton: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 5,
  },
  smallBtn: {
    padding: 5,
    borderRadius: 20,
  }
});

export default RecipeDetailsScreen;