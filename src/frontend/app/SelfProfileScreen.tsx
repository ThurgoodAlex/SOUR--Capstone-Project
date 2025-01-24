import React, { useState, useEffect } from 'react';
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

    // Define dummy images
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
    

    const user = useUser(); // Fetch user details
    const { logout } = useAuth();
    const api = useApi();

    const [activeTab, setActiveTab] = useState('Posts');
    const [posts, setPosts] = useState<Post[]>([]);

    // Fetch listings from the API
    // const fetchListings = async () => {
    //     try {
    //         const response = await api.get(`/listing/${user?.id}`);
    //         const result = await response.json();

    //         // Function to get a random image
    //         const getRandomImage = () => dummyImages[Math.floor(Math.random() * dummyImages.length)];

    //         if (response.ok) {
    //             console.log("Received all listings: ", result);
                
    //              // Transform the listings data to match the Post type
    //             const transformedPosts: Post[] = result.map((item: any, index: number) => ({
    //             id: item.id,
    //             createdDate: item.created_at || new Date().toISOString(), 
    //             data: getRandomImage(),
                
    //             author: {
    //                 name: item.seller|| "Unknown poster", // Fallback to a default value
    //                 username: item.seller || "unknown", // Fallback to a default value
    //                 id: item.seller_id,
    //             },
    //             }));

    //             setPosts(transformedPosts); // Update state with fetched posts

    //         } else {
    //             console.log(response);
    //             Alert.alert('Error', 'Could not fetch listings.');
    //         }
    //     } catch (error) {
    //         console.error('Error fetching listings:', error);
    //         Alert.alert('Error', 'Failed to connect to the server. Please check your connection.');
    //     }
    // };

    // // Fetch listings on page load
    // useEffect(() => {
    //     if (activeTab === 'Posts') {
    //         fetchListings();
    //     }
    // }, [activeTab]);

    const handleTabSwitch = (tab: string) => {
        setActiveTab(tab);
    };

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
                <StatsBar />
                <Tabs activeTab={activeTab} handleTabSwitch={handleTabSwitch} tab1={'Posts'} tab2={'Likes'} />
                {activeTab === 'Posts' ? (
                    <PostsGrid posts={posts} />
                ) : (
                    <LikesGrid />
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
    let type = post.type;
    if (type === 'video') {
        icon = <Ionicons size={20} name='videocam' />
    }
    else if (type === 'post') {
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
                <ImageBackground source={post.data} style={{ height: 150, width: 150 }}>
                    {icon}
                </ImageBackground>

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

function LikesGrid() {
    return (
        <View>
            <Text>No likes yet!</Text>
        </View>
    );
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
