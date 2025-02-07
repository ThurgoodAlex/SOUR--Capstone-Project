import React from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { PostPreview } from '@/components/PostPreview';
import { LinkPreview } from '@/components/LinkPreview';
import { Styles } from '@/constants/Styles';
import { Post } from '@/constants/Types';

/**
 * Displays a list of posts in a grid format, within a scrollview
 * @param posts a list of Posts
 * @returns the posts in a grid format, within a scroll view
 */


export function LinkedItems ({ posts, columns }: { posts: Post[], columns: number }){
    return (
        <View style={[Styles.row, { flexWrap: 'wrap', justifyContent: 'space-between' }]}>
            {posts.map((item, index) => (
                <View key={item.id.toString()} style={{ width: `${100 / columns}%` }}>
                    {columns === 1 ? (
                        <LinkPreview listing={item} />
                    ) : (
                        <PostPreview post={item} size={150} profileThumbnail={"none"} />
                    )}
                </View>
            ))}
        </View>
    );
};
