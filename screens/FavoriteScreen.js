import React, { useRef, useState, useEffect } from 'react';
import { Animated, StyleSheet, Image, Text, Pressable, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ref, get } from 'firebase/database';
import { onValue, query, orderByChild, equalTo } from 'firebase/database';
import { auth, database } from '../firebaseConfig';
import { getGlobalStyles } from '../components/globalStyles';
import { getColors } from '../components/colorThemes';
import { useDarkMode } from '../components/DarkMode';
import { filipinoRecipes } from '../components/recipe';

const FavoriteScreen = ({ navigation }) => {
  const { isDarkMode } = useDarkMode();
  const colors = getColors(isDarkMode);
  const globalStyles = getGlobalStyles(isDarkMode);
  const [favorites, setFavorites] = useState([]);
  const [recipeRatings, setRecipeRatings] = useState({});  

  const scrollY = useRef(new Animated.Value(0)).current;
  
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    const fetchRatings = async () => {
      const ratingsMap = {};
      const filtered = [];
  
      for (const recipe of filipinoRecipes) {
        const reviewsRef = query(ref(database, 'reviews'), orderByChild('recipeId'), equalTo(recipe.id));
  
        await new Promise((resolve) => {
          onValue(reviewsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              const reviews = Object.values(data);
              const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  
              ratingsMap[recipe.id] = avgRating;
  
              if (avgRating >= 4.0) {
                filtered.push({ ...recipe, avgRating });
              }
            } else {
              ratingsMap[recipe.id] = 0;
            }
            resolve();
          }, { onlyOnce: true });
        });
      }
  
      setRecipeRatings(ratingsMap); // ⬅️ Save all ratings
      filtered.sort((a, b) => b.avgRating - a.avgRating);
      setTrendingFilipinoRecipes(filtered.slice(0, 5));
    };
  
      fetchRatings();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchFavorites = async () => {
        const user = auth.currentUser;
        if (!user) {
          console.error('The current user is null.');
          return;
        }

        try {
          const favoriteRef = ref(database, `favorites/${user.uid}`);
          const snapshot = await get(favoriteRef);

          if (snapshot.exists()) {
            const favoritesObj = snapshot.val();
            const favoriteKeys = Object.keys(favoritesObj).filter(key => favoritesObj[key] === true);
            const filteredRecipes = filipinoRecipes.filter(recipe => favoriteKeys.includes(recipe.id));
            setFavorites(filteredRecipes);
          } else {
            console.log('No favorites found');
            setFavorites([]);
          }
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      };

      fetchFavorites();
    }, [])
  );

  const handleRecipePress = (recipe) => {
    navigation.navigate('RecipeDetails', {
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      recipeImg: recipe.image,
      recipeDesc: recipe.description,
      recipeType: recipe.type,
      recipeDetails: recipe.details,
      recipeIngredients: recipe.ingredients,
      recipeInstructions: recipe.instructions
    });
  };

  const renderItem = ({ item }) => (
    <Pressable style={[globalStyles.recipeCard, globalStyles.shadow]} onPress={() => handleRecipePress(item)}>
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      <View style={globalStyles.recipeInfo}>
        <Text style={globalStyles.h4}>{item.title}</Text>
        <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
          <Text style={globalStyles.smallText}>({item.type})</Text>
          {recipeRatings[item.id] !== undefined && (
          <View style={globalStyles.ratingAltContainer}>
            <Text style={globalStyles.ratingText}>⭐ {recipeRatings[item.id].toFixed(1)}</Text>
          </View>
          )}
        </View>
        {item.description && <Text style={globalStyles.smallParagraph}>{item.description.substring(0, 50)}...</Text>}
      </View>
    </Pressable>
  );

  const renderEmptyList = () => (
    <View style={[globalStyles.recipeCard, globalStyles.shadow, { justifyContent: 'center', paddingVertical: 10 }]}>
      <Text style={[globalStyles.text, { textAlign: 'center' }]}>
        No favorite recipes yet. Start adding some!
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Animated.View style={[globalStyles.header, {opacity: headerOpacity}]}>
        <Text style={globalStyles.h1}>Flavorites</Text>
      </Animated.View>
      <Animated.FlatList
        contentContainerStyle={[{ padding: 15, paddingBottom: 80, flexGrow: 1, backgroundColor: colors.backgroundColor}]}
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <View style={globalStyles.headerContainer}>
            <Text style={globalStyles.h1}>Flavorites</Text>
          </View>
        }
        ListEmptyComponent={renderEmptyList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  recipeImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  recipeType: {
    fontSize: 12,
    color: '#777',
  },
});

export default FavoriteScreen;
