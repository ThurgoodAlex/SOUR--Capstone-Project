import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { Tabs } from '@/components/Tabs';

import { useUser } from '@/context/user';
import { useApi } from '@/context/api';

export function RegisteredSeller() {
    const user = useUser(); // Fetch user details
    const api = useApi();

    const [activeTab, setActiveTab] = useState('Active');
    const [listings, setListings] = useState([]);

    // Fetch listings from the API
    const fetchListings = async () => {
        try {
            const response = await api.get(`/listing/allListings/${user?.id}`);
            const result = await response.json();

            if (response.ok) {
                console.log("Received all listings: ", result);
                setListings(result);
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
                <View style={SellerStyles.earningsBox}>
                    <Text style={[Styles.column, TextStyles.h2]}>Total Earnings:</Text>
                    <View style={[Styles.column, {justifyContent: 'flex-end'}]}>
                        <Text style={TextStyles.h2}>$00.00</Text>
                        <Text style={TextStyles.p}>Sold items: 0</Text>
                    </View>
                </View>
                <Tabs activeTab={activeTab} handleTabSwitch={handleTabSwitch} tab1={'Active'} tab2={'Inactive'} />
                {activeTab === 'Active' ? (
                    <PostsGrid listings={listings} />
                ) : (
                    <PostsGrid listings={listings} />
                )}
            </View>
        </>
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
    listingItem: {
        marginVertical: 10,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
    },
    earningsBox: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        shadowColor: '#692b20',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
    }
});
