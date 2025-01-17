import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, ScrollView, ImageBackground } from 'react-native';
import { Styles } from '@/constants/Styles';
import { PostPreview } from './PostPreview';
import ProfileThumbnail from '@/components/ProfileThumbnail';

export default function PhotoCarousel() {
    
    const dummyPosts = [
        {
          id: 1,
          data: require('../assets/images/sweater1.png'),
        },
        {
          id: 2,
          data: require('../assets/images/sweater2.png'),
        },
        {
          id: 3,
          data: require('../assets/images/sweater3.png'),
        },
        {
          id: 4,
          data: require('../assets/images/sweater4.png'),
        },
    ];

    return (
        <View style={Styles.row}>
            <ScrollView horizontal={true} >
                {dummyPosts.map((post) => (
                    <View style={Styles.column}>
                        <ImageBackground source={post.data} style={{height: 250, width:250, marginRight:6}}></ImageBackground>
                    </View>
                ))}
            </ScrollView>
        </View>
      );

}