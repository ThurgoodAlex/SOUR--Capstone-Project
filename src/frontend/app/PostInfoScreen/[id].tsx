import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import ProfileThumbnail from '@/components/ProfileThumbnail';
import PhotoCarousel from '@/components/PhotoCarousel';
import { NavBar } from '@/components/NavBar';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useApi } from '@/context/api';
import { Post } from '@/constants/Types';
import { Ionicons } from '@expo/vector-icons';
import  CartButton  from '@/components/CartButton';

import { LinkedItems } from '@/components/LinkedItems';
import { usePost } from '@/hooks/usePost';
import { usePosts } from '@/hooks/usePosts';
import { Colors } from '@/constants/Colors';
import { useUser } from '@/context/user';
import { boolean } from 'yup';

export default function PostInfoScreen() {
    const api = useApi();
    const { id } = useLocalSearchParams(); 

    const { post, loading: postsLoading } = usePost(`${id}`);
    const { posts: linkedItems } = usePosts(`/posts/${id}/links/`);
    const { user } = useUser();
    const [liked, setLike] = useState(false);

    useEffect(() => {
        if (post?.id) {
            const fetchLike = async () => {
                try {
                    const response = await api.get(`/posts/${post.id}/like/`);
                    const data = await response.json();
    
                    console.log("\n LIKED:", data, "\n");
                    setLike(Boolean(data)); 
                } catch (error) {
                    console.error('Error fetching like status:', error);
                }
            };
            fetchLike();
        }
    }, [post?.id]); 

  

    const toggleLike = async () => {
        if (!post?.id) return;
        try {
            if (liked) {
                await api.post(`/posts/${post.id}/unlike/`, {});
            } else {
                await api.post(`/posts/${post.id}/like/`);
            }
            setLike(!liked);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleMessage = async () => {
            try {
                //chat already exists
          
                const checkChatResponse = await api.get(`/users/${user?.id}/chats/${post?.seller.id}/`);
                if (checkChatResponse.ok) {
                    let chat = await checkChatResponse.json();
                    router.push({
                        pathname: '/MessagesScreen',
                        params: { chatID: chat.id },
                    })
                } else if (checkChatResponse.status === 404) {
                    // create new chat
                    const response = await api.post('/chats/', { reciepientID: post?.seller.id });
                    const chat = await response.json();
                    if (response.ok) {
                        router.push({
                            pathname: '/MessagesScreen',
                            params: { chatID: chat.id },
                        })
                    } else {
                        Alert.alert('Failed to create chat.');
                    }
                } else {
                    Alert.alert('Failed to check chat existence.');
                }
            } catch (error) {
                console.error('Error creating chat:', error);
                Alert.alert('Failed to connect to the server.');
            }
        }

    if (postsLoading) {
        return (
            <View style={ScreenStyles.screen}>
                <ActivityIndicator size="large" color={Colors.orange} />
            </View>
        );
    }

    if (post) {
        return (
            <>
                <Stack.Screen
                    options={{
                        headerBackButtonDisplayMode: 'minimal',
                        headerRight: () => (
                            <TouchableOpacity onPress={() => router.push('/CartScreen')}>
                                <Ionicons size={30} name="cart-outline" color="#692b20" />
                            </TouchableOpacity>
                        ),
                    }}
                />
                <View style={ScreenStyles.screen}>
                    <ScrollView contentContainerStyle={{ gap: 6 }}>
                        <ProfileThumbnail user={post.seller} />
                        {post.seller.id != user?.id ? 
                            <TouchableOpacity 
                                onPress={handleMessage}
                                style={{ alignSelf:'flex-end', position:'absolute', top: 3}}
                            >
                                <Ionicons name="chatbubble-outline" size={28} color={Colors.dark60} />
                            </TouchableOpacity>
                            : null
                        }
                        <PhotoCarousel postId={Number(post.id)} />
                        {post.isListing ? (
                            <ListingInfo post={post} liked={liked} toggleLike={toggleLike} userID={user?.id ?? 0} />
                        ) : (
                            <PostInfo post={post} liked={liked} toggleLike={toggleLike} />
                        )}
                        {linkedItems.length > 0 && (
                            <>
                                <View style={{ borderBottomColor: Colors.dark60, borderBottomWidth: 1, marginVertical: 10 }} />
                                <Text style={[TextStyles.h2, TextStyles.uppercase]}>
                                    {post.isListing ? "Posts" : "Featured Listings"}
                                </Text>
                                <LinkedItems posts={linkedItems} columns={post.isListing ? 3 : 1} />
                            </>
                        )}
                    </ScrollView>
                </View>
                <NavBar />
            </>
        );
    }

    return (
        <View style={ScreenStyles.screen}>
            <Text>Post information not available.</Text>
        </View>
    );
}

// ListingInfo Component
function ListingInfo({ post, liked, toggleLike, userID }: { post: Post, liked: boolean, toggleLike: () => void, userID:number }) {
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(parseFloat(post.price));

    const handleItemAdded = (item: any) => {
        console.log('Item added to cart:', item);
    };

    return (
        <View style={Styles.column}>
            <View style={[Styles.row, { justifyContent: 'space-between' }]}>
                <Text style={[TextStyles.h1, TextStyles.uppercase, {width:'90%'}]}>{post.title}</Text>
                {!post.isSold && <LikeButton liked={liked} onPress={toggleLike} />}
            </View>

            <View style={[Styles.row, { justifyContent: 'space-between', marginBottom: -10, marginTop: -2 }]}>
                <Text style={[TextStyles.h2, { textAlign: 'left' }]}>{formattedPrice}</Text>
                {!post.isSold && post.seller.id != userID && <CartButton listingID={post.id} onItemAdded={handleItemAdded} />}
            </View>

            <Text style={[TextStyles.h3, { textAlign: 'left', marginBottom: -1 }]}>Size: {post.size}</Text>
            <Text style={[TextStyles.p, { textAlign: 'left' }]}>
                {[post.brand, post.gender, post.condition].filter(Boolean).join('  |  ')}
            </Text>
            {post.description && 
                <View>
                    <View style={{ borderBottomColor: Colors.dark60, borderBottomWidth: 1, marginVertical: 10 }} />
                    <Text style={[TextStyles.h3, {textAlign:'left'}]}>Description</Text>
                    <Text style={TextStyles.p}>{post.description}</Text>
                   
                </View>
            }
            
        </View>
    );
}

// PostInfo Component
function PostInfo({ post, liked, toggleLike }: { post: Post, liked: boolean, toggleLike: () => void }) {
    return (
        <View style={Styles.column}>
            <View style={[Styles.row, { justifyContent: 'space-between' }]}>
                <Text style={[TextStyles.h1, TextStyles.uppercase]}>{post.title}</Text>
                <LikeButton liked={liked} onPress={toggleLike} />
            </View>
            <Text style={TextStyles.p}>{post.description}</Text>
        </View>
    );
}

// LikeButton Component
function LikeButton({ liked, onPress }: { liked: boolean, onPress: () => void }) {
    return (
        <TouchableOpacity onPress={onPress}>
            <Ionicons 
                name={liked ? "heart" : "heart-outline"} 
                size={30} 
                color={liked ? Colors.grapefruit : Colors.dark60} 
            />
        </TouchableOpacity>
    );
}
