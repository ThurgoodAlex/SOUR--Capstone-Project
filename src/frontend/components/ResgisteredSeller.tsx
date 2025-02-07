import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, Button, FlatList, ImageBackground } from 'react-native';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { Tabs } from '@/components/Tabs';
import { PostsFlatList } from '@/components/PostsFlatList';
import { useApi } from '@/context/api';
import { Post, Stats, User } from '@/constants/Types';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUser } from '@/context/user';
import { usePosts } from '@/hooks/usePosts';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';

export function RegisteredSeller() {
    const api = useApi();
    const { user, setUser } = useUser();
    const [activeTab, setActiveTab] = useState('Active Listings');
    
    const [earnings, setEarnings] = useState(0.00);
    const [soldItems, setSoldItems] = useState(0);
    
    const [endpoint, setEndpoint] = useState(`/users/${user?.id}/posts/issold=false/`);
    const { posts, loading, error } = usePosts(endpoint);
    
    const handleTabSwitch = (tab: string) => {
        setActiveTab(tab);
        setEndpoint(tab === 'Active Listings' 
            ? `/users/${user?.id}/posts/issold=false/`
            : `/users/${user?.id}/posts/issold=true/`
        );
    };


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

   
    useEffect(() => { fetchStats(); }, []);

    

    return (
        <>
                
            <Earnings earnings={earnings} soldItems={soldItems} />
            
            <Tabs 
                activeTab={activeTab} 
                handleTabSwitch={handleTabSwitch} 
                tab1={'Active Listings'} 
                tab2={'Sold Listings'} 
            />

            <PostsFlatList posts={posts} height={270} />

            <CreateButtons />
               
                
        </>
    );
}

function Earnings({ earnings, soldItems }: { earnings: number, soldItems: number }){
    const formattedEarnings = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(earnings);


    return(
        <View style={[Styles.column, SellerStyles.earningsBox]}>
            <View style={[Styles.row, {justifyContent: 'space-between'}]}>
                <Text style={[TextStyles.h1, TextStyles.uppercase]}>Total Earnings:</Text>
                <Text style={TextStyles.h1}>{formattedEarnings}</Text>
            </View>

            <Text style={TextStyles.h2}>{soldItems} {soldItems === 1 ? 'item sold' : 'items sold'}</Text>

        

        </View>
    )
}

function CreateButtons(){
    return (
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
