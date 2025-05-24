import React from 'react';
import { StyleSheet, Text, View, Pressable, ImageBackground } from 'react-native';
import { getGlobalStyles } from '../components/globalStyles';
import { useDarkMode } from '../components/DarkMode';

const CategoryScreen = ({ navigation }) => {
  const { isDarkMode } = useDarkMode();
  const globalStyles = getGlobalStyles(isDarkMode);

    const categories = [
         { name: 'Breakfast', image: require('../assets/breakfast.jpg') },
        { name: 'Lunch', image: require('../assets/lunch.webp') },
        { name: 'Dinner', image: require('../assets/dinner.jpg') },
        { name: 'Appetizers', image: require('../assets/appetizers.webp') },
        { name: 'Dessert', image: require('../assets/dessert.webp') },
        { name: 'Drinks', image: require('../assets/drinks.jpg') },
    ];

    const handleCategoryPress = (categoryName) => {
        navigation.navigate('FoodCategory', { categoryName });
    };

    return (
        <View style={globalStyles.container}>
          <View style={globalStyles.headerContainer}>
            <Text style={globalStyles.h1}>Category</Text>
          </View>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around',}}>
            {categories.map((category, index) => (
                <Pressable
                    key={index}
                    style={styles.categoryItem}
                    onPress={() => handleCategoryPress(category.name)}
                >
                    <ImageBackground source={category.image} style={styles.backgroundImage} resizeMode="cover">
                        <View style={globalStyles.textContainer}>
                            <Text style={globalStyles.categoryText}>{category.name}</Text>
                        </View>
                    </ImageBackground>
                </Pressable>
            ))}
          </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    categoryItem: {
        width: '45%',
        aspectRatio: 1,
        borderRadius: 8,
        marginBottom: 20,
        overflow: 'hidden',
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CategoryScreen;