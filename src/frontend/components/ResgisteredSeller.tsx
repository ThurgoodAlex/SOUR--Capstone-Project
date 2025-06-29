import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Styles, TextStyles } from '@/constants/Styles';
import { Tabs } from '@/components/Tabs';
import { PostsFlatList } from '@/components/PostsFlatList';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUser } from '@/context/user';
import { usePosts } from '@/hooks/usePosts';
import { useStats } from '@/hooks/useStats';
import { Colors } from '@/constants/Colors';

export function RegisteredSeller() {
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState('Active');
    
    const [endpoint, setEndpoint] = useState(`/users/${user?.id}/posts/issold=false/`);
    
    const { earnings, soldItems, loading: statsLoading, error: statsError } = useStats(user!);
    const { posts, loading: postsLoading, error: postsError } = usePosts(endpoint);
    
    const handleTabSwitch = (tab: string) => {
        console.log('Tab switched to:', tab);
        setActiveTab(tab);
        setEndpoint(tab === 'Active' 
            ? `/users/${user?.id}/posts/issold=false/`
            : `/users/${user?.id}/posts/issold=true/`
        );
    };

    return (
        <>
           {/* {statsLoading || postsLoading ? ( */}
                {/* <ActivityIndicator size="large" color={Colors.orange} /> */}
            {/* ) : ( */}
                <>
                    <Earnings earnings={earnings} soldItems={soldItems} />
                    <Tabs 
                        activeTab={activeTab} 
                        handleTabSwitch={handleTabSwitch} 
                        tab1={'Active'} 
                        tab2={'Sold'} 
                    />
                    <PostsFlatList posts={posts} height={250} />
                    <CreateButtons />
                </>
            {/* )} */}
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
            <Text style={[TextStyles.h1, TextStyles.uppercase, {marginTop:8, marginBottom:6}]}>Create</Text>

            <View style={[Styles.row, {gap:20}]}>
                <TouchableOpacity style={[Styles.column, Styles.buttonDark, {alignItems: 'center', width: 30, height: 80}]} onPress={() => router.push('/CreateListingScreen')}>
                    <Ionicons style={{color: '#FFF'}} size={30} name="pricetag" />
                    <Text style={[TextStyles.h3, TextStyles.light]}>Listing</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[Styles.column, Styles.buttonDark, {alignItems: 'center', width: 30, height: 80}]} onPress={() => router.push('/CreatePostScreen')}>
                    <Ionicons style={{color: '#FFF'}} size={30} name="camera" />
                    <Text style={[TextStyles.h3, TextStyles.light]}>Post</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[Styles.column, Styles.buttonDark, {alignItems: 'center', width: 30, height: 80}]} onPress={() => router.push('/createVideoScreen')}>
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
