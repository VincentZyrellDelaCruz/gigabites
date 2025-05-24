import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getColors } from "../components/colorThemes";
import { getGlobalStyles } from '../components/globalStyles';
import { useDarkMode } from '../components/DarkMode';

import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';

import HomeScreen from '../screens/Home';
import UserCenter from '../screens/UserCenter';
import CategoryScreen from '../screens/CategoryScreen';
import FavoriteScreen from '../screens/FavoriteScreen';

const Tab = createBottomTabNavigator();

const Tabs = () => {
    const { isDarkMode } = useDarkMode();
    const globalStyles = getGlobalStyles(isDarkMode);
    const colors = getColors(isDarkMode);

    return(
        <Tab.Navigator 
        screenOptions={{
            headerTitle: '', 
            headerTransparent: true,
            headerStyle: {backgroundColor: 'transparent'},
            tabBarStyle: [globalStyles.tabContainer, globalStyles.shadow],
            tabBarLabelStyle: globalStyles.tabLabel,
            tabBarActiveTintColor: colors.accentColor,
            tabBarInactiveTintColor: colors.textColor,
            tabBarItemStyle: {fontWeight: 900},
        }}>
            <Tab.Screen name='Home' component={HomeScreen}
            options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{
                      backgroundColor: focused ? colors.textColor : 'transparent',
                      width: 50,
                      height: 30,
                      borderRadius: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                        <Feather name='home' size={25} color={focused ? colors.buttonTextColor : colors.textColor} />
                    </View>
                ),
            }}/>
            <Tab.Screen name='Category' component={CategoryScreen}
              options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{
                      backgroundColor: focused ? colors.textColor : 'transparent',
                      width: 50,
                      height: 30,
                      borderRadius: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                        <MaterialIcons name='category' size={25} color={focused ? colors.buttonTextColor : colors.textColor}/>
                    </View>
                ),
            }}/>
            <Tab.Screen name='Favorite' component={FavoriteScreen} 
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{
                          backgroundColor: focused ? colors.textColor : 'transparent',
                          width: 50,
                          height: 30,
                          borderRadius: 20,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                            <MaterialIcons name='favorite-border' size={30} color={focused ? colors.buttonTextColor : colors.textColor}/>
                        </View>
                    ),
            }}/>
            <Tab.Screen name='User' component={UserCenter} 
            options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{
                      backgroundColor: focused ? colors.textColor : 'transparent',
                      width: 50,
                      height: 30,
                      borderRadius: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                        <MaterialIcons name='account-circle' size={30} color={focused ? colors.buttonTextColor : colors.textColor}/>
                    </View>
                ),
            }}/>
        </Tab.Navigator>
    );
}

export default Tabs;