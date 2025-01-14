import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { Alert, ImageSourcePropType, View } from 'react-native';
import { PostPreview } from '@/components/PostPreview';
import { NavBar } from '@/components/NavBar';
import { FlatList, Text } from 'react-native';
import PostCarousel from '@/components/PostCarousel';
import { Listing, Post } from '@/constants/Types';
import React, { useEffect, useState } from 'react';
import { api, useApi } from '@/context/api';
import { useUser } from '@/context/user';
import { useAuth } from '@/context/auth';

export default function DiscoverScreen() {

  const user = useUser(); // Fetch user details
  const { logout } = useAuth();
  const api = useApi();

  const [posts, setPosts] = useState<Post[]>([]);

    const dummyImages = [
        {
          data: require('../assets/images/video.png'),
        },
        {
          data: require('../assets/images/post.png'),
        },
        {
          data: require('../assets/images/sweater1.png'),
        },
        {
          data: require('../assets/images/listing.png'),
        },
    ];


  // Fetch posts from the API
  const fetchPosts = async () => {
      try {

          //TODO: right now this just fetches listings, but we will need to get all posts and listings
          const response = await api.get(`/listing/`);
          const result = await response.json();

          if (response.ok) {
              console.log("Received all listings: ", result);

              // Transform the listings data to match the Post type
              const transformedPosts: Post[] = result.map((item: any, index: number) => ({
                id: item.id,
                createdDate: item.created_at || new Date().toISOString(), 
                
                author: {
                  name: item.seller|| "Unknown poster", // Fallback to a default value
                  username: item.seller || "unknown", // Fallback to a default value
                  id: item.seller_id,
              
                },
              }));

              setPosts(transformedPosts); // Update state with fetched posts

          } else {
              console.log(response);
              Alert.alert('Error', 'Could not fetch listings.');
          }
      } catch (error) {
          console.error('Error fetching listings:', error);
          Alert.alert('Error', 'Failed to connect to the server. Please check your connection.');
      }
  };
  
  // Fetch listings on page load
  useEffect(() => {fetchPosts(); }, []);

  const renderPost = ({ item }: {item: Post}) => (
    <PostPreview
      post={item}
      size={160}
      thumbnailSize='small'
    />
  );

  return (
    <>
    <View style={ScreenStyles.screen}>
      <FlatList
        ListHeaderComponent={
          <>
          <Text style={[TextStyles.h2, TextStyles.uppercase]} >What's New Today?</Text>
          <PostCarousel />
          <Text style={[TextStyles.h2, TextStyles.uppercase]} >You Might Like</Text>
          </>
        } // Carousel at the top
        data={posts} // Data for FlatList
        keyExtractor={(item) => item.id.toString()} // Unique key for each item
        renderItem={renderPost} // Function to render each item
        numColumns={2} // Grid layout with 2 columns
        columnWrapperStyle={Styles.grid} // Style for the row container
        showsVerticalScrollIndicator={false}
      />
      
    </View>
    <NavBar />
    </>
    
  );
}
