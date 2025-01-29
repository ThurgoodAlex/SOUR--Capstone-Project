import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, Button, FlatList, ImageBackground } from 'react-native';
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
    const [activeTab, setActiveTab] = useState('Active Listings');
    
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

    const fetchListings = async () =>
    {
        try {
            //TODO: make route for getting listings only
            let endpoint = `/users/${user?.id}/posts/`;
            const response = await api.get(endpoint);
            const result = await response.json();
            console.log(result)
        
            if (response.ok) {
                const getRandomImage = () =>
                    dummyImages[Math.floor(Math.random() * dummyImages.length)];
            
                const transformedPosts: Post[] = await Promise.all(
                    result.map(async (item: any) => {
                    return {
                        id: item.id,
                        createdDate: item.created_at || new Date().toISOString(),
                        coverImage: getRandomImage(),
                        title: item.title,
                        description: item.description,
                        brand: item.brand,
                        condition: item.condition,
                        size: item.size,
                        gender: item.gender,
                        price: item.price,
                        isSold: item.isSold,
                        isListing: item.isListing,
                        seller: user
                    };
                    })
                );
            
                console.log(`Received posts from ${endpoint}:`, transformedPosts);
                setPosts(transformedPosts);
            } else {
            console.log(response);
            throw new Error('Could not fetch posts.');
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw new Error('Failed to connect to the server.');
        }
    }

    const fetchSoldListings = async () =>
    {
        try {
            //TODO: make this router under the user router instead
            let endpoint = `/posts/${user?.id}/issold=true/`;
            const response = await api.get(endpoint);
            const result = await response.json();
            console.log(result)
        
            if (response.ok) {
                const getRandomImage = () =>
                    dummyImages[Math.floor(Math.random() * dummyImages.length)];
            
                const transformedPosts: Post[] = await Promise.all(
                    result.map(async (item: any) => {
                    return {
                        id: item.id,
                        createdDate: item.created_at || new Date().toISOString(),
                        coverImage: getRandomImage(),
                        title: item.title,
                        description: item.description,
                        brand: item.brand,
                        condition: item.condition,
                        size: item.size,
                        gender: item.gender,
                        price: item.price,
                        isSold: item.isSold,
                        isListing: item.isListing,
                        seller: user
                    };
                    })
                );
            
                console.log(`Received posts from ${endpoint}:`, transformedPosts);
                setPosts(transformedPosts);
            } else {
            console.log(response);
            throw new Error('Could not fetch posts.');
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw new Error('Failed to connect to the server.');
        }
    }
    

    

    // Fetch posts on page load
    useEffect(() => {
        fetchStats();
        if (activeTab === 'Active Listings') {
            fetchListings();
        }
        else {
            fetchSoldListings();
        }
    }, [activeTab]);

    const handleTabSwitch = (tab: string) => {
        setActiveTab(tab);
    };

    const formattedEarnings = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(earnings);

    return (
        <>
                <View style={[Styles.column, SellerStyles.earningsBox]}>
                    <View style={[Styles.row, {justifyContent: 'space-between'}]}>
                        <Text style={[TextStyles.h1, TextStyles.uppercase]}>Total Earnings:</Text>
                        <Text style={TextStyles.h1}>{formattedEarnings}</Text>
                    </View>
        
                    <Text style={TextStyles.h2}>{soldItems} items sold</Text>
              
         
                </View>

                <Tabs 
                    activeTab={activeTab} 
                    handleTabSwitch={handleTabSwitch} 
                    tab1={'Active Listings'} 
                    tab2={'Sold Listings'} 
                />
                {activeTab === 'Active Listings' ? (
                    <PostsGrid posts={posts} />
                ) : (
                    <PostsGrid posts={posts} />
                )}

                <View style={[Styles.column, {gap:12}]}>
                    <Text style={[TextStyles.h1, TextStyles.uppercase, {marginTop:6}]}>Create</Text>

                    <View style={[Styles.row, {gap:20}]}>
                        <TouchableOpacity style={[Styles.column, Styles.buttonDark, {alignItems: 'center', width: 30, height: 80}]} onPress={() => router.push('/CreateListingScreen')}>
                            <Ionicons style={{color: '#FFF'}} size={30} name="pricetag" />
                            <Text style={[TextStyles.h3, TextStyles.light]}>Listing</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[Styles.column, Styles.buttonDark, {alignItems: 'center', width: 30, height: 80}]} onPress={() => router.push('/CreatePostScreen')}>
                            <Ionicons style={{color: '#FFF'}} size={30} name="camera" />
                            <Text style={[TextStyles.h3, TextStyles.light]}>Post</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[Styles.column, Styles.buttonDark, {alignItems: 'center', width: 30, height: 80}]} onPress={() => router.push('/CreatePostScreen')}>
                            <Ionicons style={{color: '#FFF'}} size={30} name="videocam" />
                            <Text style={[TextStyles.h3, TextStyles.light]}>Video</Text>
                        </TouchableOpacity>
                    </View>

                </View>
               
                
        </>
    );
}






//made this separate from the component for now, maybe make it into a different component?
function PostPreview({ post}: { post: Post }){
    let icon;
    let type = post.isListing ? "listing" : "post";

    // if (type === 'listing') {
    //     icon = <Ionicons size={20} name='videocam' />
    // }
    if (type === 'post') {
        icon = <Ionicons size={20} name='megaphone' />
    }
    else if (type === 'listing') {
        icon = <Ionicons size={20} name='pricetag' />
    }

    return( 
        <View key={post.id} style={[Styles.column, { marginBottom: 1 }]}>
            <TouchableOpacity
                onPress={() => router.push(`/ListingInfoScreen/${post.id}`)} // Navigate on press
                style={{ flex: 1, margin: 5 }} // Add styles for spacing
            >
                <ImageBackground source={post.coverImage} style={{ height: 150, width: 150 }}>
                    {icon}
                </ImageBackground>
                <Text style={[TextStyles.h3, {textAlign:'left'}]}>{post.title}</Text>

            </TouchableOpacity>
        </View>
    );
}

function PostsGrid({ posts }: { posts: Post[] }) {
    const renderPost = ({ item }: {item: Post}) => (
        <PostPreview
          post={item}
        />
    );

   return ( 
        <FlatList
            data={posts} // Data for FlatList
            keyExtractor={(item) => item.id.toString()} // Unique key for each item
            renderItem={renderPost} // Function to render each item
            numColumns={2} // Grid layout with 2 columns
            columnWrapperStyle={Styles.grid} // Style for the row container
            showsVerticalScrollIndicator={false}
            style={{height: 270}}
        />
    )
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
        width: '100%',
        maxHeight:100,
        justifyContent: 'space-evenly',
        shadowColor: '#692b20',
        shadowOpacity: 0.25,
        shadowRadius: 10,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        
    }
});
