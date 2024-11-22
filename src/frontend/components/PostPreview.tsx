import { Alert, View, Image, Text, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { useEffect, useState } from 'react';
import { Styles } from '@/constants/Styles';
import Ionicons from '@expo/vector-icons/Ionicons';

type Post = {
    id: number;
    // data: TexImageSource;
    data: string;
    user: string;
    type: string;
};

/**
 * The visualization of how a campus post looks like.
 * @param post - Props object containing the post details.
 * @returns A post view component.
 */
export function PostPreview({post, size}: {post: Post, size: number}) {
  const { id, data, user, type } = post;
  let icon;
  if (type === 'video'){
    icon = <Ionicons size={20} name='videocam'/>
  }
  else if (type === 'post'){
    icon = <Ionicons size={20} name='megaphone'/>
  }
  else{
    icon = <Ionicons size={20} name='pricetag'/>
  }

  return (
    <View key={id} style={Styles.postPreview}>
        {/* <Image source={{ uri: 'https://via.placeholder.com/200'}} style={{resizeMode: 'contain'}}/> */}
        <ImageBackground source={require('./imgs/toad.png')} style={{height: size, width:size}}>
            {icon}
        </ImageBackground>
        <Text>{user}</Text>
        <Text>{type}</Text>
    </View>
  );
}