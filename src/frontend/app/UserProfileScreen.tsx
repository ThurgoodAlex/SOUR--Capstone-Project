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
import { Colors } from '@/constants/Colors';

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
      
            const checkChatResponse = await api.get(`/users/${user?.id}/chats/${targetUser?.id}/`);
            if (checkChatResponse.ok) {
                let chat = await checkChatResponse.json();
                router.push({
                    pathname: '/MessagesScreen',
                    params: { chatID: chat.id, userID: targetUser?.id },
                })
            } else if (checkChatResponse.status === 404) {
                // create new chat
                const response = await api.post('/chats/', { reciepientID: targetUser?.id });
                const chat = await response.json();
                    if (response.ok) {
                        router.push({
                            pathname: '/MessagesScreen',
                            params: { chatID: chat.id,  userID: targetUser?.id },
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


    return (
        <>
            <Stack.Screen
                options={{
                    headerBackButtonDisplayMode: 'minimal'
                }}
            />
            <View style={ScreenStyles.screen}>
                <ProfileInfo user={targetUser} />
                 <TouchableOpacity 
                    onPress={handleMessage}
                    style={{ alignSelf:'flex-end', position:'absolute', top: 20, right: 15}}
                >
                    <Ionicons name="chatbubble-outline" size={28} color={Colors.dark60} />
                </TouchableOpacity>
                <StatsBar user={targetUser} />
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
    const profPicMapping: Record<number, any> = {
        1: require('@/assets/images/prof1.jpg'),
        5: require('@/assets/images/prof2.jpg'),
        2: require('@/assets/images/prof3.jpg')
    }
    
    
    let profilePic = user?.id && user.id in profPicMapping ? profPicMapping[user.id] : require('@/assets/images/blank_profile_pic.png');
      
    return (
        <View style={Styles.center}>
            <Image
                source={profilePic}
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
