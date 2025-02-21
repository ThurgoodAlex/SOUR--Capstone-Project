import { useState, useEffect } from 'react';
import { View, Text, Image, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';

import { router, Stack } from 'expo-router';
import { useApi } from '@/context/api';
import { NavBar } from '@/components/NavBar';
import { StatsBar } from '@/components/StatsBar';
import { User } from '@/constants/Types';
import { useSearchParams } from 'expo-router/build/hooks';
import { useUser } from '@/context/user';
import { usePosts } from '@/hooks/usePosts';
import { PostsFlatList } from '@/components/PostsFlatList';
import { Ionicons } from '@expo/vector-icons';

export default function UserProfileScreen() {
    const searchParams = useSearchParams(); // Retrieve query parameters
    const userParam = searchParams.get('user');
    const api = useApi();
    const {user} = useUser();
    const targetUser: User | null = userParam ? JSON.parse(userParam) : null;
    const [isFollowing, setIsFollowing] = useState<boolean>();
    const [statsUpdated, setStatsUpdated] = useState(false);

    const { posts, loading, error } = usePosts(`/users/${targetUser?.id}/posts/`);
    
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

    const handleMessage = async () => {
        try {
            //chat already exists
            const chatId = `${user?.id}_${targetUser?.id}`;
            const checkChatResponse = await api.get(`/chats/${chatId}/`);
            if (checkChatResponse.ok) {
                let chat = await checkChatResponse.json();
                router.push({
                    pathname: '/MessagesScreen',
                    params: { chatID: chat.id },
                })
            } else if (checkChatResponse.status === 404) {
                // create new chat
                const response = await api.post('/chats/', { recipientID: targetUser?.id });
                if (response.ok) {
                    router.push('/ChatsScreen');
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


    return (
        <>
            <Stack.Screen options={{ title: 'UserProfileScreen' }} />
            <View style={ScreenStyles.screen}>
                <ProfileInfo user={targetUser} />
                <TouchableOpacity onPress={handleMessage}>
                    <Ionicons name="chatbubble-outline" size={24} color="black" />
                </TouchableOpacity>
                <StatsBar user={targetUser} statsUpdated={statsUpdated} />
                <Text> {isFollowing} </Text>
               
                        {isFollowing ? (
                             <TouchableOpacity
                             onPress={() => follow()}
                             style={Styles.buttonLight}>
                                <Text style={[TextStyles.uppercase, TextStyles.dark]}> Unfollow</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                            onPress={() => follow()}
                            style={Styles.buttonDark}>
                               <Text style={[TextStyles.uppercase, TextStyles.light]}> Follow</Text>
                           </TouchableOpacity>
                        )}
                   
                <PostsFlatList posts={posts} height={270} />
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
