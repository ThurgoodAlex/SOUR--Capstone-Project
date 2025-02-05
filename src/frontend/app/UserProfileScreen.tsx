import { useState, useEffect } from 'react';
import { View, Text, Image, Alert, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, FlatList } from 'react-native';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';

import { router, Stack } from 'expo-router';
import { useApi } from '@/context/api';
import { NavBar } from '@/components/NavBar';
import { StatsBar } from '@/components/StatsBar';
import { Post, User } from '@/constants/Types';
import { useSearchParams } from 'expo-router/build/hooks';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@/context/user';
import { usePosts } from '@/hooks/usePosts';

export default function UserProfileScreen() {
    const searchParams = useSearchParams(); // Retrieve query parameters
    const userParam = searchParams.get('user');
    const api = useApi();
    const {user} = useUser();
    const targetUser: User | null = userParam ? JSON.parse(userParam) : null;
    const [isFollowing, setIsFollowing] = useState<boolean>();
    const [statsUpdated, setStatsUpdated] = useState(false);

    const { posts, loading, error } = usePosts(`/users/${user?.id}/posts/`);
    
    const follow = async () => {
        try {
            const getFollowingResponse = await api.get(`/users/${user?.id}/following/`);
            if (getFollowingResponse.ok) {
                const following = await getFollowingResponse.json();
                if (following.some((entry: any) => entry.followeeID === targetUser?.id)) {
                    const unfollowResponse = await api.remove(`/users/${targetUser?.id}/unfollow/`);
                    if (unfollowResponse.ok) {
                        setIsFollowing(false);
                        setStatsUpdated(!statsUpdated);
                    } else {
                        Alert.alert('Failed to unfollow user.');
                    }
                } else {
                    const followResponse = await api.post(`/users/${targetUser?.id}/follow/`);
                    if (followResponse.ok) {
                        setIsFollowing(true);
                        setStatsUpdated(!statsUpdated);
                    } else {
                        Alert.alert('Failed to follow user.');
                    }
                }
            } else {
                console.log(getFollowingResponse);
                throw new Error('Could not fetch following.');
            }
        } catch (error) {
            console.error('Error following user:', error);
            throw new Error('Failed to connect to the server.');
        }
    };


    // Fetch listings on page load
    useEffect(() => {
        const checkIfFollowing = async() => {
            const getFollowingResponse = await api.get(`/users/${user?.id}/following/`);
            if (getFollowingResponse.ok) {
                const following = await getFollowingResponse.json();
                if (following.some((entry: any) => entry.followeeID === targetUser?.id)) {
                    setIsFollowing(true);
                } else {
                    setIsFollowing(false);
                }
            } else {
                console.log(getFollowingResponse);
                throw new Error('Could not fetch following.');
            }
        };
        checkIfFollowing();
          
    }, []);


    return (
        <>
            <Stack.Screen options={{ title: 'UserProfileScreen' }} />
            <View style={ScreenStyles.screen}>
                <ProfileInfo user={targetUser} />
                <StatsBar user={targetUser} statsUpdated={statsUpdated} />
                <Text> {isFollowing} </Text>
                <TouchableOpacity
                    onPress={() => follow()}
                    style={Styles.buttonDark}>
                    <Text style={[TextStyles.uppercase, TextStyles.light]}>
                        {isFollowing ? (
                            'Unfollow'
                        ) : (
                            'Follow'
                        )}
                    </Text>
                </TouchableOpacity>
                <PostsGrid posts={posts} />
            </View>
            <NavBar />
        </>
    );
}


function ProfileInfo({ user }: { user: User | null }) {
    return (
        <View style={Styles.center}>
            <Image
                source={require('../assets/images/profile_pic.jpg')}
                style={UserProfileStyles.profileImage}
            />
            <Text style={TextStyles.h1}>{user?.firstname + " " + user?.lastname || "ERROR: can't find name"}</Text>
            <Text style={TextStyles.h3}>{user?.username || "ERROR: can't find username"}</Text>
        </View>
    );
}


function PostPreview({ post }: { post: Post }) {
    let icon;
    let type = post.isListing ? "listing" : "post";

    if (type === 'post') {
        icon = <Ionicons size={20} name='megaphone' />
    }
    else if (type === 'listing') {
        icon = <Ionicons size={20} name='pricetag' />
    }

    return (
        <View key={post.id} style={[Styles.column, { marginBottom: 1 }]}>
            <TouchableOpacity
                onPress={() => router.push(`/PostInfoScreen/${post.id}`)} // Navigate on press
                style={{ flex: 1, margin: 5 }} // Add styles for spacing
            >
                <ImageBackground source={post.coverImage} style={{ height: 150, width: 150 }}>
                    {icon}
                </ImageBackground>
                <Text style={[TextStyles.h3, { textAlign: 'left' }]}>{post.title}</Text>

            </TouchableOpacity>
        </View>
    );
}


function PostsGrid({ posts }: { posts: Post[] }) {

    const renderPost = ({ item }: { item: Post }) => (
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

const UserProfileStyles = StyleSheet.create({
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
