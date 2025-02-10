import { useState } from 'react';
import { View, Text, Image, Alert, StyleSheet } from 'react-native';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';

import { useUser } from '@/context/user';
import { router, Stack } from 'expo-router';
import { NavBar } from '@/components/NavBar';
import { StatsBar } from '@/components/StatsBar';
import { Tabs } from '@/components/Tabs';
import { Ionicons } from '@expo/vector-icons';
import { usePosts } from '@/hooks/usePosts';
import { PostsFlatList } from '@/components/PostsFlatList';


export default function SelfProfileScreen() {

    const {user} = useUser(); 
    // default to posts
    const [activeTab, setActiveTab] = useState('Posts');


    const [endpoint, setEndpoint] = useState(`/users/${user?.id}/posts/`);
    const { posts, loading, error } = usePosts(endpoint);
    
    const handleTabSwitch = (tab: string) => {
        setActiveTab(tab);
        setEndpoint(tab === 'Posts' 
            ? `/users/${user?.id}/posts/`
            : `/users/${user?.id}/likes/`
        );
    };

    return (
        <>
            <Stack.Screen options={{
                title: 'SelfProfileScreen',
                headerLeft: () => "",
                headerRight: () =>
                    <Ionicons
                        size={30}
                        name="cog-outline"
                        onPress={() => router.push('/SettingsScreen')}
                    />
            }}/>
            
            <View style={ScreenStyles.screen}>
                <ProfileInfo user={user} />
                <StatsBar user={user} statsUpdated={true}/>
                <Tabs activeTab={activeTab} handleTabSwitch={handleTabSwitch} tab1={'Posts'} tab2={'Likes'} />
                <PostsFlatList posts={posts} height={270} />
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
