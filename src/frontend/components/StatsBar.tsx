import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet, FlatList, ScrollView } from 'react-native';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { User } from '@/constants/Types';
import { useApi } from '@/context/api';

export function StatsBar({ user, statsUpdated }: { user: User | null; statsUpdated: boolean }) {
    const api = useApi();
    const [sales, setSales] = useState(0);
    const [posts, setPosts] = useState(0);
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);

    const fetchUserStats = async () => {
        try {
            const [salesResponse, postsResponse, followersResponse, followingResponse] = await Promise.all([
                api.get(`/users/${user?.id}/posts/issold=true/`),
                api.get(`/users/${user?.id}/posts/`),
                api.get(`/users/${user?.id}/followers/`),
                api.get(`/users/${user?.id}/following/`)
            ]);

            if (salesResponse.ok && postsResponse.ok && followersResponse.ok && followingResponse.ok) {
                setSales((await salesResponse.json()).length);
                setPosts((await postsResponse.json()).length);
                setFollowers((await followersResponse.json()).length);
                setFollowing((await followingResponse.json()).length);
            } else {
                Alert.alert('Error', 'Failed to fetch stats.');
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
            Alert.alert('Error', 'Failed to connect to the server.');
        }
    };

    useEffect(() => {
        fetchUserStats();
    }, [user, statsUpdated]);

    return (
        <View style={StatStyles.statsSection}>
            <View style={Styles.center}>
                <Text style={[TextStyles.h2, { marginBottom: 0 }]}>{sales}</Text>
                <Text style={TextStyles.p}>{sales === 1 ? 'sale' : 'sales'}</Text>
            </View>
            <View style={Styles.center}>
                <Text style={[TextStyles.h2, { marginBottom: 0 }]}>{posts}</Text>
                <Text style={TextStyles.p}>{posts === 1 ? 'post' : 'posts'}</Text>
            </View>
            <View style={Styles.center}>
                <Text style={[TextStyles.h2, { marginBottom: 0 }]}>{followers}</Text>
                <Text style={TextStyles.p}>{followers === 1 ? 'follower' : 'followers'}</Text>
            </View>
            <View style={Styles.center}>
                <Text style={[TextStyles.h2, { marginBottom: 0 }]}>{following}</Text>
                <Text style={TextStyles.p}>{following === 1 ? 'following' : 'following'}</Text>
            </View>
        </View>
    );
}


const StatStyles = StyleSheet.create(
    {
        statsSection: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 8,
        }
    }
);