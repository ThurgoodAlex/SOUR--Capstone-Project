import { View, ScrollView, Alert, Text } from 'react-native';
import { Styles } from '@/constants/Styles';
import { PostPreview } from './PostPreview';
import { useApi } from '@/context/api';
import { useCallback, useEffect, useState } from 'react';
import { Post } from '@/constants/Types';
import { useUser } from '@/context/user';
import { useAuth } from '@/context/auth';
import { usePosts } from '@/hooks/usePosts';

// export default function PostCarousel() {
    
//     const user = useUser(); // Fetch user details
//     const { logout } = useAuth();
//     const api = useApi();
//     const [posts, setPosts] = useState<Post[]>([]);

//     const dummyImages = [
//     require('../assets/images/video.png'),
//     require('../assets/images/post.png'),
//     require('../assets/images/sweater1.png'),
//     require('../assets/images/listing2.png'),
//     require('../assets/images/listing.png'),
//     require('../assets/images/random1.png'),
//     require('../assets/images/random2.png'),
//     require('../assets/images/random3.png'),
//     require('../assets/images/random4.png'),
//     require('../assets/images/random5.png'),
//     ];
    
//     const fetchPosts = async () =>
//     {
//     try {
//         let endpoint = `/posts/new`;
//         const response = await api.get(endpoint);
//         const result = await response.json();
    
//         if (response.ok) {
    
//         const getRandomImage = () =>
//             dummyImages[Math.floor(Math.random() * dummyImages.length)];
    
//         const fetchSeller = async (sellerId: string) => {
//             try {
//             const sellerResponse = await api.get(`/users/${sellerId}/`);
//             const sellerData = await sellerResponse.json();
    
//             if (sellerResponse.ok) {
//                 return {
//                 firstname: sellerData.firstname,
//                 lastname: sellerData.lastname,
//                 username: sellerData.username,
//                 bio: sellerData.bio,
//                 profilePicture: sellerData.profilePicture,
//                 isSeller: sellerData.isSeller,
//                 email: sellerData.email,
//                 id: sellerData.id,
//                 };
//             }
//             } catch (error) {
//             console.error(`Error fetching seller with id ${sellerId}:`, error);
//             }
//         };
    
//         const transformedPosts: Post[] = await Promise.all(
//             result.map(async (item: any) => {
//             const seller = await fetchSeller(item.sellerID);
//             return {
//                 id: item.id,
//                 createdDate: item.created_at || new Date().toISOString(),
//                 coverImage: getRandomImage(),
//                 title: item.title,
//                 description: item.description,
//                 brand: item.brand,
//                 condition: item.condition,
//                 size: item.size,
//                 gender: item.gender,
//                 price: item.price,
//                 isSold: item.isSold,
//                 isListing: item.isListing,
//                 seller,
//             };
//             })
//         );
    
//         console.log(`Received posts from ${endpoint}:`, transformedPosts);
//         setPosts(transformedPosts);
//         } else {
//         console.log(response);
//         throw new Error('Could not fetch posts.');
//         }
//     } catch (error) {
//         console.error('Error fetching posts:', error);
//         throw new Error('Failed to connect to the server.');
//     }
//     }

//     // Fetch listings on page load
//     useEffect(() => {fetchPosts(); }, []);

//     return (
//     <View style={[Styles.row, {marginBottom:18}]}>
//         <ScrollView horizontal={true}>
//                 {posts.map((post) => (
//                     <PostPreview
//                         key={post.id}
//                         post={post}
//                         size={350}
//                         thumbnailSize='big'
//                     />
//                 ))}
//         </ScrollView>
//     </View>
//     );

// }

export default function PostCarousel() {
    const { posts, loading, error } = usePosts('/posts/new');
  
    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error}</Text>;
  
    return (
      <View style={[Styles.row, { marginBottom: 18 }]}>
        <ScrollView horizontal={true}>
          {posts.map((post) => (
            <PostPreview key={post.id} post={post} size={350} thumbnailSize="big" />
          ))}
        </ScrollView>
      </View>
    );
  }