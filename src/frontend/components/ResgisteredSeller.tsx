import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, Button } from 'react-native';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { Tabs } from '@/components/Tabs';
import { useApi } from '@/context/api';
import { Post, Stats, User } from '@/constants/Types';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUser } from '@/context/user';

export function RegisteredSeller() {
    const api = useApi();
    const { user, setUser } = useUser();
    const [activeTab, setActiveTab] = useState('Active');
    const [posts, setPosts] = useState<Post[]>([]);
    const [earnings, setEarnings] = useState(0.00);
    const [soldItems, setSoldItems] = useState(0);

    const fetchStats = async () => {
        try {
            const response = await api.get(`/users/${user?.id}/stats/`);
            const result = await response.json();

            if (response.ok) {
                console.log("Received all stats: ", result);

                setEarnings(result.totalEarnings);
                setSoldItems(result.itemsSold);

            } else {
                setEarnings(0.00)
                setSoldItems(0)
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
            Alert.alert('Error', 'Failed to connect to the server. Please check your connection.');
        }
    };

    const dummyImages = [
        require('../assets/images/video.png'),
        require('../assets/images/post.png'),
        require('../assets/images/sweater1.png'),
        require('../assets/images/listing2.png'),
        require('../assets/images/listing.png'),
        require('../assets/images/random1.png'),
        require('../assets/images/random2.png'),
        require('../assets/images/random3.png'),
        require('../assets/images/random4.png'),
        require('../assets/images/random5.png'),
    ];

    const fetchPosts = async (isSold : boolean) => {
        try {
            const response = await api.get(`/posts/${user?.id}/issold=${isSold}/`);
            const result = await response.json();

            if (response.ok) {
                console.log("Received all posts: ", result);

                // Function to get a random image
                const getRandomImage = () => dummyImages[Math.floor(Math.random() * dummyImages.length)];

                // Transform the posts data to match the Post type
                const transformedPosts: Post[] = result.map((item: any, index: number) => ({
                    id: item.id,
                    createdDate: item.created_at || new Date().toISOString(),
                    data: getRandomImage(),

                    author: {
                        name: item.seller || "Unknown poster", // Fallback to a default value
                        username: item.seller || "unknown", // Fallback to a default value
                        id: item.seller_id,
                    },
                }));

                setPosts(transformedPosts); // Update state with fetched posts

            } else {
                console.log(response);
                Alert.alert('Error', 'Could not fetch posts.');
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            Alert.alert('Error', 'Failed to connect to the server. Please check your connection.');
        }
    };

    // Fetch posts on page load
    useEffect(() => {
        fetchStats();
        if (activeTab === 'Active') {
            fetchPosts(true);
        }
        else {
            fetchPosts(false);
        }
    }, [activeTab]);

    const handleTabSwitch = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <>
                <View style={SellerStyles.earningsBox}>
                    <Text style={[Styles.column, TextStyles.h2]}>Total Earnings:</Text>
                    <View style={[Styles.column, { justifyContent: 'flex-end' }]}>
                        <Text style={TextStyles.h2}>${earnings}</Text>
                        <Text style={TextStyles.p}>Sold items: {soldItems}</Text>
                    </View>
                </View>
                <View style={[Styles.row, {justifyContent: 'space-between'}]}>
                    <Ionicons
                        style={[Styles.buttonDark, {color: '#FFF'}]}
                        size={32}
                        name="pricetag"
                        onPress={() => router.push('/CreateListingScreen')}
                    />
                    <Ionicons
                        style={[Styles.buttonDark, {color: '#FFF'}]}
                        size={32}
                        name="camera"
                        onPress={() => router.push('/CreatePostScreen')}
                    />
                    <Ionicons
                        style={[Styles.buttonDark, {color: '#FFF'}]}
                        size={32}
                        name="videocam"
                        onPress={() => router.push('/CreatePostScreen')}
                    />
                </View>
                <Tabs activeTab={activeTab} handleTabSwitch={handleTabSwitch} tab1={'Active'} tab2={'Inactive'} />
                {activeTab === 'Active' ? (
                    <PostsGrid posts={posts} />
                ) : (
                    <PostsGrid posts={posts} />
                )}
        </>
    );
}


function PostsGrid({ posts }: { posts: any[] }) {
    return (
        <ScrollView contentContainerStyle={{ padding: 10 }}>
            {posts.length > 0 ? (
                posts.map((item) => (
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
