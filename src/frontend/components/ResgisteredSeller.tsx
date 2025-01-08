import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { ScreenStyles, TextStyles } from '@/constants/Styles';

import { useUser } from '@/context/user';
import { useAuth } from '@/context/auth';
import { useApi } from '@/context/api';

export function RegisteredSeller() {
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
        if (activeTab === 'Active') {
            fetchListings();
        }
    }, [activeTab]);

    const handleTabSwitch = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <>
            <View style={ScreenStyles.screen}>
                <Tabs activeTab={activeTab} handleTabSwitch={handleTabSwitch} />
                {activeTab === 'Active' ? (
                    <PostsGrid listings={listings} />
                ) : (
                    <PostsGrid listings={listings} />
                )}
            </View>
        </>
    );
}

function Tabs({ activeTab, handleTabSwitch }: { activeTab: string; handleTabSwitch: (tab: string) => void }) {
    return (
        <View style={SellerStyles.tabs}>
            <TouchableOpacity onPress={() => handleTabSwitch('Active')}>
                <Text style={[
                    TextStyles.h2,
                    SellerStyles.tab,
                    TextStyles.uppercase,
                    { marginBottom: 0 },
                    activeTab === 'Active' && SellerStyles.activeTab
                ]}>
                    Active
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleTabSwitch('Inactive')}>
                <Text style={[
                    TextStyles.h2,
                    SellerStyles.tab,
                    TextStyles.uppercase,
                    { marginBottom: 0 },
                    activeTab === 'Inactive' && SellerStyles.activeTab
                ]}>
                    Inactive
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
                    <View key={item.id} style={SellerStyles.listingItem}>
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

const SellerStyles = StyleSheet.create({
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
