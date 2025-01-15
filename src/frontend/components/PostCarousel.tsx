import { View, ScrollView, Alert} from 'react-native';
import { Styles } from '@/constants/Styles';
import { PostPreview } from './PostPreview';
import { useApi } from '@/context/api';
import { useEffect, useState } from 'react';
import { Post } from '@/constants/Types';

export default function PostCarousel() {
    const api = useApi();
  
    const [posts, setPosts] = useState<Post[]>([]);

    // Require dummy images
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

    

    
    //TODO: this fetches all listings and keeps only newest 4. 
    // We need to change this to an actual db query (or long term use reccomendation alg to choose the 4).
    const fetchPosts = async () => {
        try {
            const response = await api.get(`/listing/`);
            const result = await response.json();

            if (response.ok) {
                // Function to get a random image
                const getRandomImage = () => dummyImages[Math.floor(Math.random() * dummyImages.length)];
                // Transform the listings data to match the Post type
                const transformedPosts: Post[] = result.map((item: any) => ({
                    id: item.id,
                    createdDate: item.created_at || new Date().toISOString(),
                    data: getRandomImage(),
                    author: {
                        name: item.seller || "Unknown poster", // Fallback to a default value
                        username: item.seller || "unknown", // Fallback to a default value
                        id: item.seller_id,
                    },
                }));

                // Sort by createdDate (newest first) and keep only the newest 4 listings
                const newestPosts = transformedPosts
                    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
                    .slice(0, 4);

                console.log("newest 4 posts", newestPosts)
                setPosts(newestPosts); // Update state with the newest 4 posts
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

    

    // const dummyPosts = [
    //     {
    //         id: 1,
    //         data: require('../assets/images/video.png'),
    //         author: {name: "Dummy Data Name 1", username: "dummyuser1", id:1},
    //         type: 'video',
    //     },
    //     {
    //         id: 2,
    //         data: require('../assets/images/post.png'),
    //         author: {name: "Dummy Data Name 2", username: "dummyuser2", id:2},
    //         type: 'post',
    //     },
    //     {
    //         id: 3,
    //         data: require('../assets/images/sweater1.png'),
    //         author: {name: "Dummy Data Name 3", username: "dummyuser3", id:3},
    //         type: 'listing',
    //     },
    //     {
    //         id: 4,
    //         data: require('../assets/images/listing2.png'),
    //         author: {name: "Dummy Data Name 4", username: "dummyuser4", id:4},
    //         type: 'listing',
    //     },
    // ];


      return (
        <View style={[Styles.row, {marginBottom:18}]}>
            <ScrollView horizontal={true} >
                {posts.map((post) => (
                    <View style={Styles.column}>
                        <PostPreview
                            key={post.id}
                            post={post}
                            size={350}
                            thumbnailSize='big'
                        />
                       
                    </View>
                ))}
            </ScrollView>
        </View>
      );

}