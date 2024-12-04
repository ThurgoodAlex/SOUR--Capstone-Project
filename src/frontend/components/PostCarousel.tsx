import React, { useState } from 'react';
import { View, ScrollView} from 'react-native';
import { Styles } from '@/constants/Styles';
import { PostPreview } from './PostPreview';
import ProfileThumbnail from '@/components/ProfileThumbnail';

export default function PostCarousel() {
    
    const dummyPosts = [
        {
            id: 1,
            data: require('../assets/images/video.png'),
            user: 'Princess Peach',
            type: 'video',
        },
        {
            id: 2,
            data: require('../assets/images/post.png'),
            user: 'Mario',
            type: 'post',
        },
        {
            id: 3,
            data: require('../assets/images/sweater1.png'),
            user: 'Bowser',
            type: 'listing',
        },
        {
            id: 4,
            data: require('../assets/images/listing2.png'),
            user: 'Princess Daisy',
            type: 'listing',
        },
    ];

      return (
        <View style={[Styles.row, {marginBottom:18}]}>
            <ScrollView horizontal={true} >
                {dummyPosts.map((post) => (
                    <View style={Styles.column}>
                        <PostPreview
                            key={post.id}
                            post={post}
                            size={350}
                        />
                        <ProfileThumbnail/>
                    </View>
                ))}
            </ScrollView>
        </View>
      );

}