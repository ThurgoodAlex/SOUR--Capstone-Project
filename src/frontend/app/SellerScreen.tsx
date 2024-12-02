import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@/context/user';
import { Post } from '@/constants/Types';
import { GridPosts } from '@/components/GridPosts';
import { NavBar } from '@/components/NavBar';
import { ScreenStyles } from '@/constants/Styles';
import { Stack } from 'expo-router';

export default function SellerScreen() {
    const user = useUser();

    //test alerts
    if (user) {
        Alert.alert('User Info (from fake tokens)', `Name: ${user.name}\nEmail: ${user.email}`);
    } else {
        Alert.alert('No User Logged in', 'User details are not available.');
    }

    const posts = Array<any>;
    const [activeTab, setActiveTab] = useState('Active');

    const handleTabSwitch = (tab: string) => {
        setActiveTab(tab);
    };


    return (
        <>
        <Stack.Screen options={{ title: 'SellerScreen' }} />
        <View style={ScreenStyles.screen}>
            <Text style={{flex: 1}}>
                this is the seller's screen
            </Text>
        </View>
        <NavBar/>
        </>
    );
}
