import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@/context/user';
import { Post } from '@/constants/Types';
import { GridPosts } from '@/components/GridPosts';
import { NavBar } from '@/components/NavBar';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { Stack } from 'expo-router';

export default function SellerScreen() {
    const user = useUser();

    //test alerts
    if (user) {
        Alert.alert('User Info (from fake tokens)', `Name: ${user.name}\nEmail: ${user.email}`);
    } else {
        Alert.alert('No User Logged in', 'User details are not available.');
    }

    if (user?.isSeller) {
        const posts = Array<any>;
        const [activeTab, setActiveTab] = useState('Active');

        const handleTabSwitch = (tab: string) => {
            setActiveTab(tab);
        };


    return (
        <>
            <Stack.Screen options={{ title: 'SellerScreen' }} />
            <View style={ScreenStyles.screen}>
                <StatsBar />
                <Tabs activeTab={activeTab} handleTabSwitch={handleTabSwitch}

                    {...activeTab === 'Active' ? (
                        <ActivePostsGrid />
                    ) : (
                        <ClosedPostsGrid />
                    )}
                />
            </View>
            <NavBar/>
        </>
    );
}

function StatsBar() {
    return (
        <View style={SellerStyles.statsSection}>
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
        <View style={SellerStyles.tabs}>
            <TouchableOpacity onPress={() => handleTabSwitch('Active')}>
                <Text style={[SellerStyles.tab, activeTab === 'Active' && SellerStyles.activeTab]}>
                    ACTIVE
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleTabSwitch('Closed')}>
                <Text style={[SellerStyles.tab, activeTab === 'Closed' && SellerStyles.activeTab]}>
                    CLOSED
                </Text>
            </TouchableOpacity>
        </View>
    );
}


function ActivePostsGrid() {
    const dummyPosts: Post[] = [
        {
            id: 1,
            data: './imgs/toad.png',
            user: 'Princess Peach',
            type: 'video',
        },
        {
            id: 2,
            data: './imgs/toad.png',
            user: 'Mario',
            type: 'post',
        }
    ];
    return (
        <View>
            <Text>No posts yet!</Text>
            <GridPosts posts={dummyPosts} />
        </View>
    );
}

function ClosedPostsGrid() {
    const dummyPosts: Post[] = [
        {
            id: 3,
            data: './imgs/toad.png',
            user: 'Bowser',
            type: 'listing',
        },
        {
            id: 4,
            data: './imgs/toad.png',
            user: 'Princess Daisy',
            type: 'listing',
        }
    ];
    return (
        <View>
            <Text>None closed yet!</Text>
            <GridPosts posts={dummyPosts} />
        </View>
    );
}

}

const SellerStyles = StyleSheet.create({
    
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

