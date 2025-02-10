import { useState } from 'react';
import { View, Text, Image, Alert, StyleSheet, TouchableOpacity } from 'react-native';
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
                        color='#692b20'
                        onPress={() => router.push('/SettingsScreen')}
                    />
            }}/>
            
            <View style={ScreenStyles.screen}>
                <ProfileInfo user={user} />
                <StatsBar user={user} statsUpdated={true}/>
                <Tabs activeTab={activeTab} handleTabSwitch={handleTabSwitch} tab1={'Posts'} tab2={'Likes'} />
                
                {posts.length > 0 ? (
                    <PostsFlatList posts={posts} height={270} />
                ) : (
                    activeTab === 'Posts' ? (
                        <StartSelling />
                    ) : (
                        <Text style={[TextStyles.p, {textAlign:'center', marginTop:20}]}>You haven't liked anything yet.</Text>
                    )
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

function StartSelling(){
    return(
        <>
            <Text style={[TextStyles.p, {textAlign:'center', marginTop:20}]}>You haven't made any posts yet.</Text>
           
            <TouchableOpacity onPress={() => router.replace("/SellerScreen")} style={Styles.buttonLight}>
                    <Text style={TextStyles.dark}>Get Started Today!</Text>
            </TouchableOpacity>
        </>
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
