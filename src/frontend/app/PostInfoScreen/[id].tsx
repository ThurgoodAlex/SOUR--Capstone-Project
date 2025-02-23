
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, ScrollView, ViewStyle, ImageBackground, TextComponent, ActivityIndicator, Alert } from 'react-native';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import ProfileThumbnail from '@/components/ProfileThumbnail';
import PhotoCarousel from '@/components/PhotoCarousel';
import { NavBar } from '@/components/NavBar';
import { useLocalSearchParams } from 'expo-router';
import { useApi } from '@/context/api';
import { Post } from '@/constants/Types';
import { Ionicons } from '@expo/vector-icons';
import { LinkedItems } from '@/components/LinkedItems';
import { usePost } from '@/hooks/usePost';
import { usePosts } from '@/hooks/usePosts';


export default function PostInfoScreen() {
    
    const api = useApi();
    
    const { id } = useLocalSearchParams(); // Get the dynamic `id` from the route

    const { post, loading: postsLoading, error: postsError } = usePost(`${id}`);
    const { posts: linkedItems, loading: linkedPostsLoading, error: linkedPostsError } = usePosts(`/posts/${id}/links/`);
    
    const [liked, setLike] = useState(false);

    if (post) {
       
        const fetchLike = async () => {
            const response = await api.get(`/posts/${post.id}/like/`);
            const data = await response.json();
            setLike(data)
        }

        fetchLike();
        
        const toggleLike = async () => {
            try {
                if (liked) {
                    await api.remove(`/posts/${post.id}/unlike/`,{});
                } else {
                    await api.post(`/posts/${post.id}/like/`);
                }
                setLike(!liked); // Update local state
            } catch (error) {
                console.error('Error toggling like:', error);
            }
        };

        const handleItemAdded = (item: any) => {
            console.log('Item added to cart:', item);
            // Alert.alert('Item added to cart', `Item ID: ${item.id}`);
        };
    
        return (
            <>
                <View style={ScreenStyles.screen}>
                    <ScrollView contentContainerStyle={{ gap: 6 }}>
                        <PhotoCarousel />
                        <View style={[Styles.row, { justifyContent: 'space-between' }]}>
                            <ProfileThumbnail user={post.seller} />
                            {post.isListing ? (<CartButton listingID={post.id} onItemAdded={handleItemAdded} />): null  }
                            <TouchableOpacity onPress={toggleLike}>
                                {liked ? (
                                    <Ionicons size={20} name='heart' color='red' />
                                ) : (
                                    <Ionicons size={20} name='heart-outline' color='gray' />
                                )}
                            </TouchableOpacity>
                        </View>
                        {post.isListing ? (<ListingInfo post={post} />): <PostInfo post={post} />  }
                        {linkedItems.length > 0 ? (
                                <>
                                    <Text style={[TextStyles.h2, TextStyles.uppercase]}>
                                        {post.isListing ? "Posts" : "Featured Listings"}
                                    </Text>
                                    <LinkedItems posts={linkedItems} columns={post.isListing ? 3 : 1}/>
                                </>
                            ) : null
                        }
                    </ScrollView>
                </View>
                <NavBar />
            </>
        );
    }

    else {
        return (
            <>
                <View style={ScreenStyles.screen}>
                    <Text>Post information not available.</Text>
                </View>
                <NavBar />
            </>
        );
    }

}

//display Listing details
function ListingInfo({ post }: { post: Post }) {

    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(parseFloat(post.price));

    return (
        <View style={Styles.column}>
            <View style={[Styles.row, {justifyContent:'space-between'}]}>
                <Text style={[TextStyles.h1, TextStyles.uppercase]}>{post.title}</Text>
                <Text style={[TextStyles.h2, {textAlign:'right'}]}>{formattedPrice}</Text>
            </View>
            {post.size != "n/a" ? (<Text style={[TextStyles.h3, {textAlign:'left'}]}>Size: {post.size}</Text>) : null }
            <Text style={TextStyles.p}>{post.description}</Text>
        </View>
    );
}


function PostInfo({ post }: { post: Post }) {
    return (
        <View style={Styles.column}>
            <View style={[Styles.row, {justifyContent:'space-between'}]}>
                <Text style={[TextStyles.h1, TextStyles.uppercase]}>{post.title}</Text>
            </View>
            <Text style={TextStyles.p}>{post.description}</Text>
        </View>
    );
}

