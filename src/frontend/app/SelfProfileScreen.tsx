import { useState } from 'react';
import { View, Text, Image, Alert, StyleSheet } from 'react-native';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { useUser } from '@/context/user';
import { router, Stack } from 'expo-router';
import { NavBar } from '@/components/NavBar';
import { StatsBar } from '@/components/StatsBar';
import { Tabs } from '@/components/Tabs';
import { Ionicons } from '@expo/vector-icons';
import { usePosts } from '@/hooks/usePosts';
import { useGetMedia } from '@/hooks/useGetMedia';
import { PostsFlatList } from '@/components/PostsFlatList';
import { Post } from '@/constants/Types';

export default function SelfProfileScreen() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('Posts');
  const [endpoint, setEndpoint] = useState(`/users/${user?.id}/posts/`);
  const { posts, loading, error } = usePosts(endpoint);

  const handleTabSwitch = (tab: string) => {
    setActiveTab(tab);
    setEndpoint(tab === 'Posts' 
      ? `/users/${user?.id}/posts/`
      : `/users/${user?.id}/likes/`
    );
  };

  if (loading) return <Text>Loading posts...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <>
      <View style={ScreenStyles.screen}>
        <ProfileInfo user={user} />
        <StatsBar user={user} />
        <Tabs activeTab={activeTab} handleTabSwitch={handleTabSwitch} tab1={'Posts'} tab2={'Likes'} />
        <PostsFlatList posts={posts.map(post => ({
          ...post,
          // We’ll enhance in PostsFlatList or a wrapper
        }))} height={270} />
      </View>
      <NavBar />
    </>
  );
}

function ProfileInfo({ user }: { user: any }) {
  let ProfileImage;
  if (user?.id == 3) {
    ProfileImage = require('../assets/images/prof1.jpg');
  } else if (user?.id == 2) {
    ProfileImage = require('../assets/images/profile_pic.jpg');
  } else if (user?.id == 1) {
    ProfileImage = require('../assets/images/prof2.jpeg');
  } else {
    ProfileImage = require('../assets/images/prof3.jpeg');
  }

  return (
    <View style={Styles.center}>
      <Image
        source={ProfileImage}
        style={ProfileStyles.profileImage}
      />
      <Text style={TextStyles.h1}>{user?.firstname + " " + user?.lastname || "ERROR: can't find name"}</Text>
      <Text style={TextStyles.h3}>{user?.username || "ERROR: can't find username"}</Text>
    </View>
  );
}

// Wrapper component to enhance each post with useGetMedia
function PostItem({ post, height }: { post: Post, height: number }) {
  const { images, loading: mediaLoading, error: mediaError } = useGetMedia(Number(post.id));

  if (mediaLoading) return <Text>Loading media...</Text>;
  if (mediaError) return <Text>Media error: {mediaError}</Text>;

  const coverImage = images && images.length > 0 ? images[0].url : post.coverImage || "";

  return (
    <View style={ProfileStyles.listingItem}>
      <Image
        source={{ uri: typeof coverImage === 'string' ? coverImage : '' }}
        style={{ height: height, width: '100%' }}
        onError={(e) => console.log("Image load error:", coverImage, e.nativeEvent.error)}
        onLoad={() => console.log("Image loaded:", coverImage)}
      />
      <Text>{post.title}</Text>
      {/* Add other post details as needed */}
    </View>
  );
}

const ProfileStyles = StyleSheet.create({
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  listingItem: {
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
},
});