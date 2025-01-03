import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { Styles } from '@/constants/Styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Listing, Post, User } from '@/constants/Types';
import ProfileThumbnail from '@/components/ProfileThumbnail';
import { router } from 'expo-router';
import ProfileThumbnailSmall from '@/components/ProfileThumbnailSmall';
import { useEffect, useState } from 'react';

/**
 * The visualization of how a campus post looks like.
 * @param post - Props object containing the post details.
 * @returns A post view component.
 */
export function PostPreview({post, size, thumbnailSize}: {post: Post, size: number, thumbnailSize: string}) {
  let icon;
  if (post.type === 'video'){
    icon = <Ionicons size={20} name='videocam'/>
  }
  else if (post.type === 'post'){
    icon = <Ionicons size={20} name='megaphone'/>
  }
  else{
    icon = <Ionicons size={20} name='pricetag'/>
  }
  
  //extract poster information into a User object
  const poster: User = {
    name: post.poster.name,
    username: post.poster.username,
    id: post.poster.id,
  }; 
  

  return (
    <View key={post.id} style={[Styles.column, { marginBottom: 1 }]}>
    <TouchableOpacity
      onPress={() => router.push(`/ListingInfoScreen/${post.id}`)} // Navigate on press
      style={{ flex: 1, margin: 5 }} // Add styles for spacing
    >
      <ImageBackground source={post.data} style={{ height: size, width: size }}>
        {icon}
      </ImageBackground>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => console.log(`Navigate to ${poster.name}'s profile`)} // TODO: Replace with navigation logic
      style={{marginLeft:6}}
    >
      {thumbnailSize === 'big' ? ( <ProfileThumbnail user={poster} /> )
        : poster ? (<ProfileThumbnailSmall user={poster} />) : (<Text>No seller information available</Text>)
      }
    </TouchableOpacity>
  </View>

  );

}