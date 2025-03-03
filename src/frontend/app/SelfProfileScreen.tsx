import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { useUser } from '@/context/user';
import { NavBar } from '@/components/NavBar';
import { StatsBar } from '@/components/StatsBar';
import { Tabs } from '@/components/Tabs';
import { usePosts } from '@/hooks/usePosts';
import { PostsFlatList } from '@/components/PostsFlatList';

export default function SelfProfileScreen() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('Posts');
  const [endpoint, setEndpoint] = useState(`/users/${user?.id}/posts/`);
  const { posts, loading, error, refetch } = usePosts(endpoint);
  const [displayedPosts, setDisplayedPosts] = useState(posts); 

  // Update displayedPosts when new posts load
  useEffect(() => {
    if (!loading && posts.length > 0) {
      setDisplayedPosts(posts);
    }
  }, [posts, loading]);

  const handleTabSwitch = (tab: string) => {
    setActiveTab(tab);
    setEndpoint(tab === 'Posts' 
      ? `/users/${user?.id}/posts/`
      : `/users/${user?.id}/likes/`
    );
  };

  if (error) return <Text>Error: {error}</Text>;

  return (
    <>
      <View style={ScreenStyles.screen}>
        <ProfileInfo user={user} />
        <StatsBar user={user} />
        <Tabs activeTab={activeTab} handleTabSwitch={handleTabSwitch} tab1={'Posts'} tab2={'Likes'} />
        {loading && displayedPosts.length === 0 ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading posts...</Text>
          </View>
        ) : (
          <PostsFlatList posts={displayedPosts} height={270} />
        )}
      </View>
      <NavBar />
    </>
  );
}

function ProfileInfo({ user }: { user: any }) {
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
            <Text style={TextStyles.h1}>{user?.firstname + " " + user?.lastname|| "ERROR: can't find name"}</Text>
            <Text style={TextStyles.h3}>{user?.username || "ERROR: can't find username"}</Text>
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
    backgroundColor: '#fff', // Match your app’s background
    height: 270, // Match PostsFlatList height
  },
  loadingText: {
    fontSize: 16,
    color: '#000',
  },
});