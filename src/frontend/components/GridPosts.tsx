import React from 'react';
import { View, ScrollView } from 'react-native';
import { PostPreview } from '@/components/PostPreview';
import { Styles } from '@/constants/Styles';
import { GridPostsProps } from '@/constants/Types';

/**
 * Displays a list of posts in a grid format, within a scrollview
 * @param posts a list of Posts
 * @returns the posts in a grid format, within a scroll view
 */
export const GridPosts: React.FC<GridPostsProps> = ({ posts }) => {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={Styles.grid}>
                {posts.map((post) => (
                    <PostPreview
                        key={post.id}
                        post={post}
                        size={175}
                        thumbnailSize='small'
                    />
                ))}
            </View>
        </ScrollView>
    );
};
