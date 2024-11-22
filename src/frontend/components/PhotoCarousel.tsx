import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, ScrollView } from 'react-native';
import { ProfileStyles, Styles } from '@/constants/Styles';
import { PostPreview } from './PostPreview';

export default function PhotoCarousel() {
    
    const dummyPosts = [
        {
            id: 1,
            data: './imgs/toad.png',
            user: 'Princess Peach',
            type: 'video',
        },
        {
            id: 2,
            data: './imgs/toad.png',
            user: 'Mario',
            type: 'post',
        },
        {
            id: 3,
            data: './imgs/toad.png',
            user: 'Bowser',
            type: 'listing',
        },
        {
            id: 4,
            data: './imgs/toad.png',
            user: 'Princess Daisy',
            type: 'listing',
        },
    ];

    return (
        <View style={Styles.carouselContainer}>
            <ScrollView horizontal={true}>
                {dummyPosts.map((post) => (
                    <PostPreview
                        key={post.id}
                        post={post}
                        size={350}
                    />
                ))}
            </ScrollView>
        </View>
      );

}