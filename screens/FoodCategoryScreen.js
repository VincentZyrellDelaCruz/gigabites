import React, { useRef, useState, useEffect  } from 'react';
import { Animated, StyleSheet, View, Text, FlatList, Image, Pressable } from 'react-native';
import { ref } from 'firebase/database';
import { onValue, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../firebaseConfig';
import { getGlobalStyles } from '../components/globalStyles';
import { useDarkMode } from '../components/DarkMode';
import { getColors } from '../components/colorThemes';
import { filipinoRecipes } from '../components/recipe';
import { CustomBackButton } from '../components/CustomBackButton';

const FoodCategoryScreen = ({ route, navigation }) => {
  const { categoryName } = route.params;
  const { isDarkMode } = useDarkMode();
  const globalStyles = getGlobalStyles(isDarkMode);
  const colors = getColors(isDarkMode);
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
  
      setRecipeRatings(ratingsMap); 
      filtered.sort((a, b) => b.avgRating - a.avgRating);
      setTrendingFilipinoRecipes(filtered.slice(0, 5));
    };
  
      fetchRatings();
  }, []);

  const filteredRecipes = filipinoRecipes.filter(recipe => {
    if (categoryName === 'Meal') {
      return recipe.type === 'Breakfast' || recipe.type === 'Lunch' || recipe.type === 'Dinner';
    }
    return recipe.type === categoryName;
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
        No recipes found for this category.
      </Text>
    </View>
  );

  return (
    <View style={globalStyles.container}>
      <Animated.View style={[globalStyles.header, {opacity: headerOpacity}]}>
        <CustomBackButton /> 
        <Text style={globalStyles.h1}>{categoryName} Recipes</Text>
      </Animated.View>
      <Animated.FlatList
        contentContainerStyle={[{ padding: 15, paddingBottom: 50, flexGrow: 1, backgroundColor: colors.backgroundColor}]}
        data={filteredRecipes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <Text style={[globalStyles.h1, {paddingTop: 50}]}>{categoryName} Recipes</Text>
        }
        ListEmptyComponent={renderEmptyList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  recipeCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  recipeInfo: {
    flex: 1,
    padding: 10,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#333',
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
  },
  recipeType: {
    fontSize: 12,
    color: '#777',
  },
});

export default FoodCategoryScreen;