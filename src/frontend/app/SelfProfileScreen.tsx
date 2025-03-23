import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { useUser } from '@/context/user';
import { NavBar } from '@/components/NavBar';
import { StatsBar } from '@/components/StatsBar';
import { Tabs } from '@/components/Tabs';
import { usePosts } from '@/hooks/usePosts';
import { PostsFlatList } from '@/components/PostsFlatList';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function SelfProfileScreen() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('Posts');
  const [endpoint, setEndpoint] = useState('');
  const { posts, loading, error, refetch } = usePosts(endpoint);
  
  useEffect(() => {
    let mounted = true;
    
    // Important: Always set the endpoint first if user exists
    if (user && user.id && mounted) {
      setEndpoint(`/users/${user.id}/posts/`);
    }
    
    // Handle redirection with a delay to ensure proper component mounting
    if (!user && mounted) {
      const timer = setTimeout(() => {
        if (mounted) {
          router.replace("/LoggedOutScreen");
        }
      }, 300); // Longer delay to ensure layout is fully mounted
      
      return () => {
        clearTimeout(timer);
        mounted = false;
      };
    }
    
    return () => {
      mounted = false;
    };
  }, [user]);

  // Only one useEffect for refetching
  useEffect(() => {
    if (endpoint && !endpoint.includes('undefined')) {
      refetch();
    }
  }, [endpoint, refetch]);

  const handleTabSwitch = (tab: string) => {
    setActiveTab(tab);
    
    // Only set endpoint if user exists
    if (user && user.id) {
      const newEndpoint = tab === 'Posts' 
        ? `/users/${user.id}/posts/`
        : `/users/${user.id}/likes/`;
      
      setEndpoint(newEndpoint);
    }
  };
  
  return (
    <>
      <View style={ScreenStyles.screen}>
        <ProfileInfo user={user} />
        <StatsBar user={user} />
        <Tabs activeTab={activeTab} handleTabSwitch={handleTabSwitch} tab1={'Posts'} tab2={'Likes'} />
        
        {user?.isSeller || activeTab === 'Likes' ? (
          <PostsFlatList posts={posts} height={270} />
        ) : (
          <>
            <Text style={[TextStyles.h3, { marginTop: 15 }]}>You are not a seller yet</Text>
            <TouchableOpacity 
              style={[Styles.buttonDark]}
              onPress={() => router.push('/SellerScreen')}> 
                <Text style={TextStyles.light}>Become a Seller Today!</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <NavBar />
    </>
  );
}

function ProfileInfo({ user }: { user: any }) {
  if (!user) {
    return null;
  }
  
  return (
    <View style={Styles.center}>
      <Image
        source={
          user.profilePic
          ? user.profilePic
          : require('../assets/images/blank_profile_pic.png')
        }
        style={ProfileStyles.profileImage}
      />
      <Text style={TextStyles.h1}>{user.firstname + " " + user.lastname || "ERROR: can't find name"}</Text>
      <Text style={TextStyles.h3}>{user.username || "ERROR: can't find username"}</Text>
    </View>
  );
}

const ProfileStyles = StyleSheet.create({
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Match your app's background
    height: 270, // Match PostsFlatList height
  },
  loadingText: {
    fontSize: 16,
    color: '#000',
  },
});