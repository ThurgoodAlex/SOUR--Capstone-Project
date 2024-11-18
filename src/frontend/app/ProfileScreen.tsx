import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { ProfileStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const posts = Array<any>;
  const [activeTab, setActiveTab] = useState('Posts');

  const handleTabSwitch = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <View style={ProfileStyles.container}>
      <ProfileInfo />
      <StatsBar />
      <Tabs activeTab={activeTab} handleTabSwitch={handleTabSwitch} />

      {activeTab === 'Posts' ? (
        <PostsGrid posts={new posts} />
      ) : (
        <LikesGrid />
      )}
    </View>
  );
}



function ProfileInfo() {
  return (
    <View style={ProfileStyles.profileSection}>
      <Image
        source={require('../assets/images/profile_pic.jpg')}
        style={ProfileStyles.profileImage}
      />
      <Text style={ProfileStyles.username}>Hanna</Text>
      <Text style={ProfileStyles.location}>Salt Lake City, UT</Text>
    </View>
  );
}

function StatsBar() {
  return (
    <View style={ProfileStyles.statsSection}>
      <View style={ProfileStyles.stat}>
        <Text style={ProfileStyles.statNumber}>2</Text>
        <Text style={ProfileStyles.statLabel}>sales</Text>
      </View>
      <View style={ProfileStyles.stat}>
        <Text style={ProfileStyles.statNumber}>2</Text>
        <Text style={ProfileStyles.statLabel}>listings</Text>
      </View>
      <View style={ProfileStyles.stat}>
        <Text style={ProfileStyles.statNumber}>20</Text>
        <Text style={ProfileStyles.statLabel}>followers</Text>
      </View>
      <View style={ProfileStyles.stat}>
        <Text style={ProfileStyles.statNumber}>1</Text>
        <Text style={ProfileStyles.statLabel}>following</Text>
      </View>
    </View>
  );
}

function Tabs({ activeTab, handleTabSwitch }: { activeTab: string; handleTabSwitch: (tab: string) => void }) {
  return (
    <View style={ProfileStyles.tabs}>
      <TouchableOpacity onPress={() => handleTabSwitch('Posts')}>
        <Text style={[ProfileStyles.tab, activeTab === 'Posts' && ProfileStyles.activeTab]}>
          POSTS
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleTabSwitch('Likes')}>
        <Text style={[ProfileStyles.tab, activeTab === 'Likes' && ProfileStyles.activeTab]}>
          LIKES
        </Text>
      </TouchableOpacity>
    </View>
  );
}


function PostsGrid({ posts }: { posts: Array<any> }) {
  return (
    <View>
      <Text>No posts yet!</Text>
    </View>
  );
}

function LikesGrid() {
  return (
    <View>
      <Text>No likes yet!</Text>
    </View>
  );
}
