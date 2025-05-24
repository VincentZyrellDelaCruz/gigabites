import React, { useRef, useState, useEffect } from 'react';
import { Animated, StyleSheet, View, Text, Image, ImageBackground, ScrollView, Pressable } from 'react-native';
import { ref } from 'firebase/database';
import { onValue, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../firebaseConfig';
import { getGlobalStyles } from '../components/globalStyles';
import { getColors } from '../components/colorThemes';
import { useDarkMode } from '../components/DarkMode';
import { filipinoRecipes } from '../components/recipe';

const HomeScreen = ({ navigation }) => {
  const { isDarkMode } = useDarkMode();
  const globalStyles = getGlobalStyles(isDarkMode);
  const colors = getColors(isDarkMode);
  const [recipeRatings, setRecipeRatings] = useState({});
  const [trendingFilipinoRecipes, setTrendingFilipinoRecipes] = useState([]);

  const scrollY = useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleRecipePress = (recipe) => {
    navigation.navigate('RecipeDetails', { 
      recipeId: recipe.id, 
      recipeTitle: recipe.title,
      recipeImg: recipe.image,
      recipeDesc: recipe.description,
      recipeType: recipe.type,
      recipeDetails: recipe.details,
      recipeIngredients: recipe.ingredients,
      recipeInstructions: recipe.instructions,
      recipeVideo: recipe.video,
    }); 
  };

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

  useEffect(() => {
    const fetchTrendingFilipinoRecipes = async () => {
      const filtered = [];

      for (const recipe of filipinoRecipes) {
        const reviewsRef = query(ref(database, 'reviews'), orderByChild('recipeId'), equalTo(recipe.id));

        await new Promise((resolve) => {
          onValue(reviewsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              const reviews = Object.values(data);
              const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

              if (avgRating >= 4.0) {
                filtered.push({ ...recipe, avgRating });
              }
            }
            resolve();
          }, {
            onlyOnce: true
          });
        });
      }

      // Sort descending and keep top 5
      filtered.sort((a, b) => b.avgRating - a.avgRating);
      setTrendingFilipinoRecipes(filtered.slice(0, 5));
    };

    fetchTrendingFilipinoRecipes();
  }, []);

  return (
    <View style={{flex: 1}}>
      {/* This header only appears when the screen scrolls down */}
      <Animated.View style={[globalStyles.header, globalStyles.shadow, {flexDirection: 'row', opacity: headerOpacity}]}>
        <Image
          source={require('../assets/logoIcon.png')}
          style={{width: 40, height: 40, borderRadius: 10}}
        />
        <Text style={[globalStyles.h1, {marginLeft: 5}]}>GigaBites++</Text>
      </Animated.View>
      <Animated.ScrollView style={[globalStyles.container, { padding: 10 }]}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false}
        )}
        scrollEventThrottle={15}>
        
        {/* HEADER */}
        <View style={[styles.headerContainer, {flexDirection: 'row', alignSelf: 'center', paddingTop: 20 }]}>
          <Image
            source={require('../assets/logoIcon.png')}
            style={{width: 40, height: 40, borderRadius: 10}}
          />
          <Text style={[globalStyles.h1, {marginLeft: 5}]}>GigaBites++</Text>
        </View>

        {/* Food of the day - Static */}
        <Text style={globalStyles.h3}>Food of the Day</Text>
        <View style={[globalStyles.giantBox, globalStyles.shadow]}>
          <Pressable onPress={() => handleRecipePress(filipinoRecipes[1])}>
            <ImageBackground source={{ uri: filipinoRecipes[1].image }} style={globalStyles.mainFoodImage}>
              <View style={globalStyles.insetShadow}/>
              <View style={[{flex: 1, flexDirection: 'column', justifyContent: 'flex-end'}]}>
                <Text style={[globalStyles.h5, {padding: 8, color: colors.white}]}>{filipinoRecipes[1].title}</Text>
                <Text style={[globalStyles.smallText, {paddingHorizontal: 10, color: colors.white}]}>({filipinoRecipes[1].type})</Text>
              </View>
            </ImageBackground>
          </Pressable>
        </View>

        {/* Trending Section */}
        <Text style={globalStyles.h3}>Trending Now</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={globalStyles.trendingContainer}>
          {trendingFilipinoRecipes.map((recipe) => (
            <Pressable
              key={recipe.id}
              style={[globalStyles.trendingCard, globalStyles.shadow]}
              onPress={() => handleRecipePress(recipe)}
            >
              <Image source={{ uri: recipe.image }} style={globalStyles.trendingImage} />
              <Text style={[globalStyles.h5, { padding: 8 }]}>{recipe.title}</Text>
              <Text style={[globalStyles.smallText, { paddingHorizontal: 10 }]}>({recipe.type})</Text>
              <View style={globalStyles.ratingContainer}>
                <Text style={globalStyles.ratingText}>⭐ {recipe.avgRating?.toFixed(1)}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* All Recipes Section */}
        <Text style={globalStyles.h3}>You might try this recipe!</Text>
        <View style={{ marginBottom: 80 }}>
          {filipinoRecipes.slice(0, 10).map((recipe) => ( // Display only the first 10 food recipes
            <Pressable
              key={recipe.id}
              style={[globalStyles.recipeCard, globalStyles.shadow]}
              onPress={() => handleRecipePress(recipe)}
            >
              <Image source={{ uri: recipe.image }} style={globalStyles.recipeImage} />
              <View style={globalStyles.recipeInfo}>
                <Text style={globalStyles.h4}>{recipe.title}</Text>
                <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                  <Text style={globalStyles.smallText}>({recipe.type})</Text>
                  {recipeRatings[recipe.id] !== undefined && (
                    <View style={globalStyles.ratingAltContainer}>
                      <Text style={globalStyles.ratingText}>⭐ {recipeRatings[recipe.id].toFixed(1)}</Text>
                    </View>
                  )}
                </View>
                <Text style={globalStyles.smallParagraph}>
                  {recipe.description.substring(0, 50)}...
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },

});

export default HomeScreen;