import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@/context/user';
import { Post } from '@/constants/Types';
import { GridPosts } from '@/components/GridPosts';
import { NavBar } from '@/components/NavBar';
import { Stack } from 'expo-router';

export default function ProfileScreen() {

    const user = useUser(); // Fetch user details

    //test alerts
    if (user) {
       // Alert.alert('User Info (from fake tokens)', `Name: ${user.name}\nEmail: ${user.email}`);
    } else {
       // Alert.alert('No User Logged in', 'User details are not available.');
    }

    const posts = Array<any>;
    const [activeTab, setActiveTab] = useState('Posts');

    const handleTabSwitch = (tab: string) => {
        setActiveTab(tab);
    };


  return (
    <>
        <Stack.Screen options={{ title: 'ProfileScreen' }} />
        <View style={ScreenStyles.screen}>
            <ProfileInfo user={user} />
            <StatsBar />
            <Tabs activeTab={activeTab} handleTabSwitch={handleTabSwitch} />
            <NavBar/>
        </View>
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
      <Text style={TextStyles.h1}>{user?.name || "No User"}</Text> 
      <Text style={TextStyles.p}>Salt Lake City, UT</Text>
    </View>
  );
}

function StatsBar() {
    return (
        <View style={ProfileStyles.statsSection}>
            <View style={Styles.center}>
                <Text style={[TextStyles.h2, {marginBottom:0}]}>2</Text>
                <Text style={TextStyles.p}>sales</Text>
            </View>
            <View style={Styles.center}>
                <Text style={[TextStyles.h2, {marginBottom:0}]}>2</Text>
                <Text style={TextStyles.p}>listings</Text>
            </View>
            <View style={Styles.center}>
                <Text style={[TextStyles.h2, {marginBottom:0}]}>20</Text>
                <Text style={TextStyles.p}>followers</Text>
            </View>
            <View style={Styles.center}>
                <Text style={[TextStyles.h2, {marginBottom:0}]}>1</Text>
                <Text style={TextStyles.p}>following</Text>
            </View>
        </View>
    );
}

function Tabs({ activeTab, handleTabSwitch }: { activeTab: string; handleTabSwitch: (tab: string) => void }) {
    return (
        <View style={ProfileStyles.tabs}>
            <TouchableOpacity onPress={() => handleTabSwitch('Posts')}>
                <Text style={[TextStyles.h2, 
                    ProfileStyles.tab, 
                    TextStyles.uppercase,
                    {marginBottom:0},
                    activeTab === 'Posts' && ProfileStyles.activeTab]}>
                    Posts
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleTabSwitch('Likes')}>
                <Text style={[TextStyles.h2, 
                    ProfileStyles.tab, 
                    TextStyles.uppercase,
                    {marginBottom:0},
                    activeTab === 'Likes' && ProfileStyles.activeTab]}>
                    Likes
                </Text>
            </TouchableOpacity>
        </View>
    );
}


function PostsGrid() {
    const dummyPosts: Post[] = [
        {
            id: 1,
            data: require('../assets/images/video.png'),
            user: 'Princess Peach',
            type: 'video',
        }
    ];
    return (
        <View>
            <Text>No posts yet!</Text>
            <GridPosts posts={dummyPosts} />
        </View>
    );
}

function LikesGrid() {
    const dummyPosts: Post[] = [
        {
            id: 3,
            data: require('../assets/images/listing.png'),
            user: 'Bowser',
            type: 'listing',
        },
        {
            id: 4,
            data: require('../assets/images/listing2.png'),
            user: 'Princess Daisy',
            type: 'listing',
        }
    ];
    return (
        <View>
            <Text>No likes yet!</Text>
            <GridPosts posts={dummyPosts} />
        </View>
    );
}

const ProfileStyles = StyleSheet.create({
    
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
    },

    statsSection: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 16,
      marginBottom: 10,
    },
   
    tabs: {
      flexDirection: 'row',
      justifyContent: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    tab: {
      fontWeight:'normal',
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    activeTab: {
      color: '#000',
      borderBottomWidth: 2,
      borderBottomColor: '#000',
      fontWeight:'bold'
    },
})
