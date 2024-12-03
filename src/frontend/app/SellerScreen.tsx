import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { ProfileStyles, Styles } from '@/constants/Styles';
import { useUser } from '@/context/user';
import { Post } from '@/constants/Types';
import { GridPosts } from '@/components/GridPosts';
import { NavBar } from '@/components/NavBar';
import { Stack } from 'expo-router';

export default function SellerScreen() {
    const user = useUser();
    const [isSeller, setActiveIsSeller] = useState(user?.isSeller ?? false);
    const posts = Array<any>;
    const [activeTab, setActiveTab] = useState('Active');

    const handleTabSwitch = (tab: string) => {
        setActiveTab(tab);
    };

    //test alerts
    if (user) {
        Alert.alert('User Info (from fake tokens)', `Name: ${user.name}\nEmail: ${user.email}`);
    } else {
        Alert.alert('No User Logged in', 'User details are not available.');
    }
        
    return (
        <>
            <Stack.Screen
                options={{ title: 'SellerScreen' }}
            />
            <View style={Styles.container}>
                {isSeller ? (
                    <SellerInfo activeTab={activeTab} handleTabSwitch={handleTabSwitch} />
                ) : (
                    <NonSellerInfo />
                )}
            </View>
            <NavBar/>
        </>
    );
}

function StatsBar() {
    return (
        <View style={ProfileStyles.statsSection}>
            <View style={ProfileStyles.stat}>
                <Text style={ProfileStyles.statNumber}>2</Text>
                <Text style={ProfileStyles.statLabel}>sales</Text>
            </View>
            <View style={ProfileStyles.stat}>
                <Text style={ProfileStyles.statNumber}>2</Text>
                <Text style={ProfileStyles.statLabel}>listings</Text>
            </View>
            <View style={ProfileStyles.stat}>
                <Text style={ProfileStyles.statNumber}>20</Text>
                <Text style={ProfileStyles.statLabel}>followers</Text>
            </View>
            <View style={ProfileStyles.stat}>
                <Text style={ProfileStyles.statNumber}>1</Text>
                <Text style={ProfileStyles.statLabel}>following</Text>
            </View>
        </View>
    );
}

function Tabs({ activeTab, handleTabSwitch }: { activeTab: string; handleTabSwitch: (tab: string) => void }) {
    return (
        <View style={ProfileStyles.tabs}>
            <TouchableOpacity onPress={() => handleTabSwitch('Active')}>
                <Text style={[ProfileStyles.tab, activeTab === 'Active' && ProfileStyles.activeTab]}>
                    ACTIVE
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleTabSwitch('Closed')}>
                <Text style={[ProfileStyles.tab, activeTab === 'Closed' && ProfileStyles.activeTab]}>
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

function SellerInfo({ activeTab, handleTabSwitch }: { activeTab: string; handleTabSwitch: (tab: string) => void }) {
    return(
        <>
            <StatsBar/>
            <Text>You are a seller, make a post!</Text>
            <Tabs activeTab={activeTab} handleTabSwitch={handleTabSwitch} />
            {activeTab === 'Active' ? (
                <ActivePostsGrid />
            ) : (
                <ClosedPostsGrid />
            )}
        </>
    );
}

function NonSellerInfo() {
    return(
        <>
            <Text>You are not a seller, sign up now!</Text>
        </>
    );
}