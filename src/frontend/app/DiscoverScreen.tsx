import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { Alert, ImageSourcePropType, View } from 'react-native';
import { PostPreview } from '@/components/PostPreview';
import { NavBar } from '@/components/NavBar';
import { FlatList, Text } from 'react-native';
import PostCarousel from '@/components/PostCarousel';
import { User, Post } from '@/constants/Types';
import { useCallback, useEffect, useState } from 'react';
import { useUser } from '@/context/user';
import { useAuth } from '@/context/auth';

import { useApi } from '@/context/api';

export default function DiscoverScreen() {

  const {user} = useUser(); // Fetch user details
  const { logout } = useAuth();
  const api = useApi();
  const [posts, setPosts] = useState<Post[]>([]);

  const dummyImages = [
    require('../assets/images/video.png'),
    require('../assets/images/post.png'),
    require('../assets/images/sweater1.png'),
    require('../assets/images/listing2.png'),
    require('../assets/images/listing.png'),
    require('../assets/images/random1.png'),
    require('../assets/images/random2.png'),
    require('../assets/images/random3.png'),
    require('../assets/images/random4.png'),
    require('../assets/images/random5.png'),
  ];
  
  const fetchPosts = async () =>
  {
    try {
      let endpoint = `/posts/`;
      const response = await api.get(endpoint);
      const result = await response.json();
  
      if (response.ok) {
  
        const getRandomImage = () =>
          dummyImages[Math.floor(Math.random() * dummyImages.length)];
  
        const fetchSeller = async (sellerId: string) => {
          try {
            const sellerResponse = await api.get(`/users/${sellerId}/`);
            const sellerData = await sellerResponse.json();
  
            if (sellerResponse.ok) {
              return {
                firstname: sellerData.firstname,
                lastname: sellerData.lastname,
                username: sellerData.username,
                bio: sellerData.bio,
                profilePicture: sellerData.profilePicture,
                isSeller: sellerData.isSeller,
                email: sellerData.email,
                id: sellerData.id,
              };
            }
          } catch (error) {
            console.error(`Error fetching seller with id ${sellerId}:`, error);
          }
        };
  
        const transformedPosts: Post[] = await Promise.all(
          result.map(async (item: any) => {
            const seller = await fetchSeller(item.sellerID);
            return {
              id: item.id,
              createdDate: item.created_at || new Date().toISOString(),
              coverImage: getRandomImage(),
              title: item.title,
              description: item.description,
              brand: item.brand,
              condition: item.condition,
              size: item.size,
              gender: item.gender,
              price: item.price,
              isSold: item.isSold,
              isListing: item.isListing,
              seller,
            };
          })
        );
  
        console.log(`Received posts from ${endpoint}:`, transformedPosts);
        setPosts(transformedPosts);
      } else {
        console.log(response);
        throw new Error('Could not fetch posts.');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new Error('Failed to connect to the server.');
    }
  }

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
