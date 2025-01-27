import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet, FlatList, ScrollView } from 'react-native';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { User } from '@/constants/Types';
import { useApi } from '@/context/api';

export function StatsBar({user} : {user : User | null}) {
    const api = useApi();
    const [sales, setSales] = useState(0);
    const [posts, setPosts] = useState(0);
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);

    const fetchUserSales = async () => {
        try {
            const response = await api.get(`/posts/${user?.id}/issold=true/`);
            const result = await response.json();

            if (response.ok) {
                console.log("Received all sales: ", result);
                
                const count = result.length;
                console.log("Number of sales received:", count);

                setSales(count)

            } else {
                console.log(response);
                Alert.alert('Error', 'Could not fetch sales.');
            }
        } catch (error) {
            console.error('Error fetching sales:', error);
            Alert.alert('Error', 'Failed to connect to the server. Please check your connection.');
        }
    };

    const fetchUserPosts = async () => {
        try {
            const response = await api.get(`/users/${user?.id}/posts/`);
            const result = await response.json();

            if (response.ok) {
                console.log("Received all posts: ", result);
                
                const count = result.length;
                console.log("Number of posts received:", count);

                setPosts(count)

            } else {
                console.log(response);
                Alert.alert('Error', 'Could not fetch posts.');
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            Alert.alert('Error', 'Failed to connect to the server. Please check your connection.');
        }
    };

    const fetchUserFollowers = async () => {
        try {
            const response = await api.get(`/users/${user?.id}/followers/`);
            const result = await response.json();

            if (response.ok) {
                console.log("Received all followers: ", result);
                
                const count = result.length;
                console.log("Number of followers received:", count);

                setFollowers(count)

            } else {
                console.log(response);
                Alert.alert('Error', 'Could not fetch followers.');
            }
        } catch (error) {
            console.error('Error fetching followers:', error);
            Alert.alert('Error', 'Failed to connect to the server. Please check your connection.');
        }
    };

    const fetchUserFollowing = async () => {
        try {
            const response = await api.get(`/users/${user?.id}/following/`);
            const result = await response.json();

            if (response.ok) {
                console.log("Received all following: ", result);
                
                const count = result.length;
                console.log("Number of following received:", count);

                setFollowing(count)

            } else {
                console.log(response);
                Alert.alert('Error', 'Could not fetch following.');
            }
        } catch (error) {
            console.error('Error fetching following:', error);
            Alert.alert('Error', 'Failed to connect to the server. Please check your connection.');
        }
    };

    useEffect(() => {
        fetchUserSales();
        fetchUserPosts();
        fetchUserFollowers();
        fetchUserFollowing();
    }, []);
    return (
        <View style={StatStyles.statsSection}>
            <View style={Styles.center}>
                <Text style={[TextStyles.h2, { marginBottom: 0 }]}>{sales}</Text>
                <Text style={TextStyles.p}>sales</Text>
            </View>
            <View style={Styles.center}>
                <Text style={[TextStyles.h2, { marginBottom: 0 }]}>{posts}</Text>
                <Text style={TextStyles.p}>posts</Text>
            </View>
            <View style={Styles.center}>
                <Text style={[TextStyles.h2, { marginBottom: 0 }]}>{followers}</Text>
                <Text style={TextStyles.p}>followers</Text>
            </View>
            <View style={Styles.center}>
                <Text style={[TextStyles.h2, { marginBottom: 0 }]}>{following}</Text>
                <Text style={TextStyles.p}>following</Text>
            </View>
        </View>
    );
}

const StatStyles = StyleSheet.create(
    {
        statsSection: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 16,
            marginBottom: 10,
        }
    }
);