import { StyleSheet } from 'react-native';
import { getColors } from './colorThemes';

export const getGlobalStyles = (isDarkMode) => {
  const colors = getColors(isDarkMode);

  return StyleSheet.create({
    //STACK STYLES
    stackHeader: {
      backgroundColor: colors.primaryColor,
    },

    //TAB STYLES
    tabContainer: {
      position: 'absolute',
      backgroundColor: colors.primaryColor,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 0,
      borderTopWidth: 0,
      height: 70,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
    },
    tabLabel: {
      fontSize: 14,
      fontWeight: 'normal,'
    },
    
    //COMMON STYLES
    container: {
      flex: 1,
      backgroundColor: colors.backgroundColor,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignSelf: 'center',
      alignItems: 'center',
      marginBottom: 20,
      paddingTop: 20,
    },
    header: {
      position: 'absolute',
      top: 0, 
      width: '100%',
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100,
      backgroundColor: colors.primaryColor,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    text: {
      fontSize: 15,
      color: colors.textColor,
    },
    smallText: {
      fontSize: 13,
      color: colors.mutedTextColor,
      marginBottom: 5,
    },
    paragraph: {
      fontSize: 16,
      color: colors.textColor,
    },
    smallParagraph: {
      fontSize: 14,
      color: colors.textColor,
    },
    h1: {
      fontSize: 30,
      fontWeight: 'bold',
      marginVertical: 10,
      color: colors.textColor,
    },
    h2: {
      fontSize: 28,
      fontWeight: 'bold',
      marginVertical: 8,
      color: colors.textColor,
    },
    h3: {
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 6,
      color: colors.textColor,
    },
    h4: {
      fontSize: 20,
      fontWeight: 'bold',
      marginVertical: 5,
      color: colors.textColor,
    },
    h5: {
      fontSize: 16,
      fontWeight: 'bold',
      marginVertical: 4,
      color: colors.textColor,
    },
    h6: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.textColor,
    },  
    button: {
      backgroundColor: colors.accentColor,
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 15,
    },
    buttonText: {
      color: colors.buttonTextColor,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    altButtonText: {
      color: colors.textColor,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    textBox: {
      color: colors.textColor,
      borderColor: colors.textColor,
      borderWidth: 1,
      borderRadius: 20,
      marginBottom: 15,
      padding: 10,
    },
    altTextBox: {
      color: colors.textColor,
      borderColor: colors.textColor,
      borderBottomWidth: 1.5,
      borderRadius: 20,
      marginBottom: 15,
      padding: 10,
    },
    shadow: {
      shadowColor: isDarkMode ? '#FFFFFF' : '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5, // For android
    },
    insetShadow: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '30%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
    },
    giantBox: {
      overflow: 'hidden',
      borderRadius: 20,
      height: 200,
      marginBottom: 10,
    },
    textContainer: {
        backgroundColor: 'rgba(0,0,0,0.5)', // Both light and dark mode
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    categoryText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF', // Both light and dark mode
        textAlign: 'center',
    },

    //FOR LOGIN & SIGNUP SCREEN
    headerExtend: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: colors.primaryColor,
      paddingTop: 120,
      borderBottomLeftRadius: 50,
      borderBottomRightRadius: 50,
      overflow: 'visible',
    },

    // FOR HOME AND CATEGORY
    recipeInfo: {
      flex: 1,
      padding: 10,
    },
    recipeCard: {
      backgroundColor: colors.surfaceColor,
      borderRadius: 8,
      marginBottom: 15,
      overflow: 'hidden',
      flexDirection: 'row',
      alignItems: 'center',
    },
    recipeImage: {
      width: 100,
      height: 100,
      resizeMode: 'cover',
    },
    ratingContainer: {
      paddingHorizontal: 10,
      paddingBottom: 10,
    },
    ratingAltContainer: {
      paddingHorizontal: 5,
    },
    ratingText: {
      fontSize: 14,
      color: '#FFC107', // Fixed color
    },
    trendingContainer: {
      marginBottom: 20,
      paddingBottom: 6,
    },
    trendingCard: {
      backgroundColor: colors.surfaceColor,
      borderRadius: 8,
      height: 220,
      width: 160,
      marginRight: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    trendingImage: {
      width: '100%',
      height: 100,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      resizeMode: 'cover',
    },
    mainFoodImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },

    //FOR USER CENTER SCREEN
    userContainer: {
      flexDirection: 'column',
      backgroundColor: colors.surfaceColor,
      marginVertical: 25,
      marginHorizontal: 15,
      paddingBottom: 20,
      paddingTop: 10,
      paddingHorizontal: 10,
      borderRadius: 20,
    },
    notLoggedContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 25,
      marginHorizontal: 15,
      padding: 20,
      borderRadius: 20,
    },
    userDetail: {
      marginLeft: 10,
    },
    profileName: {
      fontWeight: 'bold',
      fontSize: 20,
      color: colors.textColor,
      textTransform: 'capitalize',
    },
    profileImg: {
      width: 110,
      height: 110,
      borderRadius: 50,
    },
    altProfileImg: {
      width: 120,
      height: 120,
      borderRadius: 100,
    },
    subContainer: {
      marginTop: 20,
    },
    selectContainer: {
      flexDirection: 'row',
      backgroundColor: colors.secondaryColor,
      marginVertical: 5,
      marginHorizontal: 15,
      padding: 20,
      borderRadius: 20,
      alignItems: 'center',
    },

    selectionContainer: {
      flexDirection: 'row',
      marginVertical: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectedTabContainer: {
      paddingHorizontal: 20,
      paddingVertical: 5,
      borderColor: colors.primaryColor,
      borderBottomWidth: 2,
      borderTopWidth: 2,
    },
    leftSelectedTContainer: {
      borderLeftWidth: 2,
      borderTopLeftRadius: 30,
      borderBottomLeftRadius: 30,
    },
    rightSelectedTContainer: {
      borderRightWidth: 2,
      borderTopRightRadius: 30,
      borderBottomRightRadius: 30,
    },
    tabSection: {
      padding: 8,
      marginBottom: 20,
      borderRadius: 20,
    },
    reviewItem: {
      marginBottom: 15,
      padding: 10,
      backgroundColor: colors.surfaceColor,
      borderRadius: 20,
      borderWidth: 0.3,
      borderColor: '#eee',
    },
    reviewHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    reviewUser: {
      color: colors.textColor,
      fontWeight: 'bold',
      fontSize: 16,
    },
    reviewComment: {
      color: colors.textColor,
      fontSize: 15,
      marginTop: 5,
    },
  });
};
