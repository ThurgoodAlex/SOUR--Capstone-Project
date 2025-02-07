import React from 'react';
import { FlatList } from 'react-native';
import { PostPreview } from '@/components/PostPreview';
import { Styles } from '@/constants/Styles';
import { Post, PostFlatListProps } from '@/constants/Types';

/**
 * Displays a list of posts in a grid format, within a scrollview
 * @param posts a list of Posts
 * @returns the posts in a grid format, within a scroll view
 */

export const PostsFlatList: React.FC<PostFlatListProps> = ({ posts, height }) => {

    const size = 150; 

    const renderPost = ({ item }: {item: Post}) => (
        <PostPreview post={item} size={size} profileThumbnail='none'/>
    );

    
    return ( 
        <FlatList
            data={posts} 
            keyExtractor={(item) => item.id.toString()} // Unique key for each item
            renderItem={renderPost} // Function to render each item
            numColumns={2} 
            columnWrapperStyle={Styles.grid} // Style for the row container
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            style={{ height: height }}
        />
    )
    
};
