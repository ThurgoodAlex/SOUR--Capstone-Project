import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet, FlatList, ScrollView, ImageBackground } from 'react-native';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';

import { useUser } from '@/context/user';
import { router, Stack } from 'expo-router';
import { useAuth } from '@/context/auth';
import { useApi } from '@/context/api';
import { NavBar } from '@/components/NavBar';
import { StatsBar } from '@/components/StatsBar';
import { Tabs } from '@/components/Tabs';
import PostCarousel from '@/components/PostCarousel';
import { Post } from '@/constants/Types';
import { Ionicons } from '@expo/vector-icons';


export default function SelfProfileScreen() {

    const {user} = useUser(); // Fetch user details
    const { logout } = useAuth();
    const api = useApi();
    const [posts, setPosts] = useState<Post[]>([]);
    const [likedPosts, setLikedPosts] = useState<Post[]>([]);
    const [activeTab, setActiveTab] = useState('Posts');
    const handleTabSwitch = (tab: string) => {
        setActiveTab(tab);
    };


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
        let endpoint = `/users/${user?.id}/posts/`;
        const response = await api.get(endpoint);
        const result = await response.json();
        console.log(result)
    
        if (response.ok) {
            const getRandomImage = () =>
                dummyImages[Math.floor(Math.random() * dummyImages.length)];
        
            const transformedPosts: Post[] = await Promise.all(
                result.map(async (item: any) => {
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
                    seller: user
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


    const fetchLikedPosts = async () =>
        {
        try {
            let endpoint = `/users/${user?.id}/likes/`;
            const response = await api.get(endpoint);
            const result = await response.json();
            console.log(result)
        
            if (response.ok) {
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


                const getRandomImage = () =>
                    dummyImages[Math.floor(Math.random() * dummyImages.length)];
            
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
                        seller: seller
                    };
                    })
                );
            
                console.log(`Received liked posts from ${endpoint}:`, transformedPosts);
                setLikedPosts(transformedPosts);
            } else {
            console.log(response);
            throw new Error('Could not fetch liked posts.');
            }
        } catch (error) {
            console.error('Error fetching liked posts:', error);
            throw new Error('Failed to connect to the server.');
        }
        }

    // Fetch posts and likes on page load
    useEffect(() => {fetchPosts(); }, []);
    useEffect(() => {fetchLikedPosts(); }, []);


    return (
        <>
            <Stack.Screen options={{ title: 'SelfProfileScreen' }} />
            <View style={ScreenStyles.screen}>
                <TouchableOpacity
                    onPress={() => logout()}
                    style={Styles.buttonDark}>
                    <Text style={[TextStyles.uppercase, TextStyles.light]}>
                        Logout
                    </Text>
                </TouchableOpacity>
                <ProfileInfo user={user} />
                <StatsBar user={user}/>
                <Tabs activeTab={activeTab} handleTabSwitch={handleTabSwitch} tab1={'Posts'} tab2={'Likes'} />
                {activeTab === 'Posts' ? (
                    <PostsGrid posts={posts} />
                ) : (
                    <LikesGrid posts={likedPosts}/>
                )}
            </View>
            <NavBar/>
        </>
    );
}

function ProfileInfo({ user }: { user: any }) {
    return (
        <View style={Styles.center}>
            <Image
                source={require('../assets/images/profile_pic.jpg')}
                style={ProfileStyles.profileImage}
            />
            <Text style={TextStyles.h1}>{user?.firstname + " " + user?.lastname|| "ERROR: can't find name"}</Text>
            <Text style={TextStyles.h3}>{user?.username || "ERROR: can't find username"}</Text>
        </View>
    );
}


//made this separate from the component for now, maybe make it into a different component?
function PostPreview({ post}: { post: Post }){
    let icon;
    let type = post.isListing ? "listing" : "post";

    // if (type === 'listing') {
    //     icon = <Ionicons size={20} name='videocam' />
    // }
    if (type === 'post') {
        icon = <Ionicons size={20} name='megaphone' />
    }
    else if (type === 'listing') {
        icon = <Ionicons size={20} name='pricetag' />
    }

    return( 
        <View key={post.id} style={[Styles.column, { marginBottom: 1 }]}>
            <TouchableOpacity
                onPress={() => router.push(`/ListingInfoScreen/${post.id}`)} // Navigate on press
                style={{ flex: 1, margin: 5 }} // Add styles for spacing
            >
                <ImageBackground source={post.coverImage} style={{ height: 150, width: 150 }}>
                    {icon}
                </ImageBackground>
                <Text style={[TextStyles.h3, {textAlign:'left'}]}>{post.title}</Text>

            </TouchableOpacity>
        </View>
    );
}

function PostsGrid({ posts }: { posts: Post[] }) {
    const renderPost = ({ item }: {item: Post}) => (
        <PostPreview
          post={item}
        />
    );

   return ( 
        <FlatList
            data={posts} // Data for FlatList
            keyExtractor={(item) => item.id.toString()} // Unique key for each item
            renderItem={renderPost} // Function to render each item
            numColumns={2} // Grid layout with 2 columns
            columnWrapperStyle={Styles.grid} // Style for the row container
            showsVerticalScrollIndicator={false}
        />
    )
}

function LikesGrid({ posts }: { posts: Post[] }) {
    const renderPost = ({ item }: {item: Post}) => (
        <PostPreview
          post={item}
        />
    );

   return ( 
        <FlatList
            data={posts} // Data for FlatList
            keyExtractor={(item) => item.id.toString()} // Unique key for each item
            renderItem={renderPost} // Function to render each item
            numColumns={2} // Grid layout with 2 columns
            columnWrapperStyle={Styles.grid} // Style for the row container
            showsVerticalScrollIndicator={false}
        />
    )
}

const ProfileStyles = StyleSheet.create({
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    listingItem: {
        marginVertical: 10,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
    },
});
