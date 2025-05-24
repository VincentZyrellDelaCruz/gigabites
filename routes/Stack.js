import React, { useEffect, useState } from 'react';
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"; 
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { useDarkMode } from "../components/DarkMode";
import { useUser } from '../components/UserContext';
import { CustomBackButton } from '../components/CustomBackButton';
import Tabs from './Tabs';
import LogIn from '../screens/LogIn';
import EditProfile from "../screens/EditProfileScreen";
import About from "../screens/About";
import RecipeDetailsScreen from '../screens/RecipeDetailsScreen';
import CategoryScreen from '../screens/CategoryScreen';
import FoodCategoryScreen from '../screens/FoodCategoryScreen';
import AvatarSetUpScreen from "../screens/AvatarSetUpScreen";
import WriteReviewScreen from "../screens/WriteReviewScreen";
import CommentsScreen from "../screens/CommentsScreen";

import { getColors } from "../components/colorThemes";
import { getGlobalStyles } from "../components/globalStyles";

const Stack = createStackNavigator();

const HomeStack = () => {
  const { isDarkMode } = useDarkMode();
  const globalStyles = getGlobalStyles(isDarkMode);
  const colors = getColors(isDarkMode);
  const { isLoggedIn } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  if (isLoading) return null; 

  return(
    <Stack.Navigator initialRouteName={isLoggedIn ? 'GigaBites++' : 'Log In'}
      screenOptions={{
        headerTitleAlign: 'center',
        headerTintColor: colors.textColor,
        ...TransitionPresets.SlideFromRightIOS,
        headerTitle: '', 
        headerTransparent: true,
        headerStyle: {backgroundColor: 'transparent'},
        headerBackTitleVisible: false,
    }}>
      <Stack.Screen name='GigaBites++' component={Tabs} 
        options={{headerShown: false}}/>
      <Stack.Screen name='Log In' component={LogIn}
        options={{
        headerTitle: '', 
        headerTransparent: true,
        headerStyle: {backgroundColor: 'transparent'},
        headerBackTitleVisible: false,
      }} />
      <Stack.Screen name='Edit Profile' component={EditProfile} 
        options={{
          headerLeft: ({ navigation }) => <CustomBackButton/>,
        }}/>
      <Stack.Screen name='About' component={About} 
        options={{
          headerLeft: ({ navigation }) => <CustomBackButton/>,
        }}
      />
      {/* Add the RecipeDetailsScreen to the stack navigator */}
      <Stack.Screen name='RecipeDetails' component={RecipeDetailsScreen}
        options={{
          headerLeft: ({ navigation }) => <CustomBackButton/>,
        }}
      />
      {/* Add CategoryScreen and FoodCategoryScreen */}
      <Stack.Screen
        name='Category'
        component={CategoryScreen}
        options={{ 
          headerLeft: ({ navigation }) => <CustomBackButton/>, 
        }} 
      />
      <Stack.Screen
        name='FoodCategory'
        component={FoodCategoryScreen}
        options={({ route }) => ({  // Get category name from route params
          headerLeft: ({ navigation }) => <CustomBackButton/>,
        })}
      />
      <Stack.Screen
        name='Create Review'
        component={WriteReviewScreen}
        options={{
          headerLeft: ({ navigation }) => <CustomBackButton/>,
        }}
      />
      <Stack.Screen
        name='Avatar Setup'
        component={AvatarSetUpScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='Comments'
        component={CommentsScreen}
        options={{
          headerLeft: ({ navigation }) => <CustomBackButton/>,
        }}
      />
    </Stack.Navigator>
  );
} 

export default HomeStack;