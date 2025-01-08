import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet, FlatList, ScrollView } from 'react-native';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';

import { useUser } from '@/context/user';
import { Stack } from 'expo-router';
import { useAuth } from '@/context/auth';
import { useApi } from '@/context/api';
import { NavBar } from '@/components/NavBar';
import { StatsBar } from '@/components/StatsBar';

export default function SelfProfileScreen() {
    const user = useUser(); // Fetch user details
    const { logout } = useAuth();
    const api = useApi();

    const [activeTab, setActiveTab] = useState('Posts');
    const [listings, setListings] = useState([]);

    // Fetch listings from the API
    const fetchListings = async () => {
        try {
            const response = await api.get(`/listing/allListings/${user?.id}`);
            const result = await response.json();

            if (response.ok) {
                console.log("Received all listings: ", result);
                setListings(result); // Update state with fetched listings
            } else {
                console.log(response);
                Alert.alert('Error', 'Could not fetch listings.');
            }
        } catch (error) {
            console.error('Error fetching listings:', error);
            Alert.alert('Error', 'Failed to connect to the server. Please check your connection.');
        }
    };

    // Fetch listings on page load
    useEffect(() => {
        if (activeTab === 'Posts') {
            fetchListings();
        }
    }, [activeTab]);

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
                <Tabs activeTab={activeTab} handleTabSwitch={handleTabSwitch} />
                {activeTab === 'Posts' ? (
                    <PostsGrid listings={listings} />
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
            <Text style={TextStyles.h1}>{user?.name || "No User"}</Text>
        </View>
    );
}

function Tabs({ activeTab, handleTabSwitch }: { activeTab: string; handleTabSwitch: (tab: string) => void }) {
    return (
        <View style={ProfileStyles.tabs}>
            <TouchableOpacity onPress={() => handleTabSwitch('Posts')}>
                <Text style={[
                    TextStyles.h2,
                    ProfileStyles.tab,
                    TextStyles.uppercase,
                    { marginBottom: 0 },
                    activeTab === 'Posts' && ProfileStyles.activeTab
                ]}>
                    Posts
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleTabSwitch('Likes')}>
                <Text style={[
                    TextStyles.h2,
                    ProfileStyles.tab,
                    TextStyles.uppercase,
                    { marginBottom: 0 },
                    activeTab === 'Likes' && ProfileStyles.activeTab
                ]}>
                    Likes
                </Text>
            </TouchableOpacity>
        </View>
    );
}


function PostsGrid({ listings }: { listings: any[] }) {
    return (
        <ScrollView contentContainerStyle={{ padding: 10 }}>
            {listings.length > 0 ? (
                listings.map((item) => (
                    <View key={item.id} style={ProfileStyles.listingItem}>
                        <Text style={TextStyles.h2}>{item.title}</Text>
                        <Text style={TextStyles.p}>{item.description}</Text>
                        <Text style={TextStyles.p}>${parseFloat(item.price).toFixed(2)}</Text>
                    </View>
                ))
            ) : (
                <Text>No posts yet!</Text>
            )}
        </ScrollView>
    );
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
    tabs: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    tab: {
        fontWeight: 'normal',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    activeTab: {
        color: '#000',
        borderBottomWidth: 2,
        borderBottomColor: '#000',
        fontWeight: 'bold',
    },
    listingItem: {
        marginVertical: 10,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
    },
});
