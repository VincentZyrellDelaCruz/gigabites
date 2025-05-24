import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../firebaseConfig';
import { useDarkMode } from '../components/DarkMode';
import { getGlobalStyles } from '../components/globalStyles';
import { getColors } from '../components/colorThemes';
import { FontAwesome } from '@expo/vector-icons';
import avatar from '../components/avatar';
import { CustomBackButton } from '../components/CustomBackButton';
const CommentsScreen = ({ route }) => {
  const { recipeId, recipeTitle } = route.params;
  const { isDarkMode } = useDarkMode();
  const globalStyles = getGlobalStyles(isDarkMode);
  const colors = getColors(isDarkMode);
  
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState({});

  useEffect(() => {
    const fetchReviews = async () => {
      const reviewsRef = query(ref(database, 'reviews'), orderByChild('recipeId'), equalTo(recipeId));
      const snapshot = await get(reviewsRef);
      const data = snapshot.val();
      if (data) {
        const reviewList = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value
        }));
        setReviews(reviewList);

        // Fetch user info
        const userInfo = {};
        await Promise.all(reviewList.map(async (review) => {
          const snap = await get(ref(database, `users/${review.userId}`));
          if (snap.exists()) userInfo[review.userId] = snap.val();
        }));
        setUsers(userInfo);
      }
    };

    fetchReviews();
  }, [recipeId]);

  const renderStars = (rating) => {
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

  return (
    <View style={globalStyles.container}>
      <Animated.View style={[globalStyles.header, globalStyles.shadow, {opacity: headerOpacity}]}>
        <CustomBackButton /> 
        <Text style={globalStyles.h4}>All Reviews</Text>
      </Animated.View>
      <Animated.ScrollView style={[globalStyles.container, {padding: 15}]}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false}
        )}
        scrollEventThrottle={15}>
        <Text style={[globalStyles.h2, {marginTop: 45}]}>All Reviews for {recipeTitle}</Text>

        {reviews.length === 0 ? (
          <Text style={globalStyles.h3}>No reviews yet.</Text>
        ) : (
          reviews.map((review) => (
            <View key={review.id} style={[globalStyles.reviewItem, globalStyles.shadow]}>
              <View style={globalStyles.reviewHeader}>
                {
                  users[review.userId]?.avatar ? (
                    <Image
                      source={avatar.find(a => a.id === users[review.userId].avatar)?.source}
                      style={{ width: 45, height: 45, borderRadius: 50 }}
                    />
                  ) : (
                    <FontAwesome name="user-circle" size={25} color={globalStyles.text.color} />
                  )
                }
                <Text style={globalStyles.reviewUser}>
                  {users[review.userId]?.username || 'Anonymous'}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                {renderStars(review.rating)}
                <Text style={[globalStyles.text, { marginLeft: 10 }]}>{review.date}</Text>
              </View>
              <Text style={globalStyles.reviewComment}>{review.comment}</Text>
            </View>
          ))
        )}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  reviewItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewUser: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  reviewComment: {
    fontSize: 16,
    marginTop: 5,
  },
  username: {
    marginLeft: 10
  },
  comment: {
    marginTop: 6
  },
  ratingContainer: {
    flexDirection: 'row',
    marginVertical: 5
  }
});

export default CommentsScreen;
