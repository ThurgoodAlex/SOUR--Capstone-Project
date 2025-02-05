import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { Alert, ImageSourcePropType, View } from 'react-native';
import { PostPreview } from '@/components/PostPreview';
import { NavBar } from '@/components/NavBar';
import { FlatList, Text } from 'react-native';
import PostCarousel from '@/components/PostCarousel';
import { User, Post } from '@/constants/Types';
import { useCallback, useEffect, useState } from 'react';
import { useUser } from '@/context/user';
import { useAuth } from '@/context/auth';
import { useApi } from '@/context/api';
import { usePosts } from '@/hooks/usePosts';


export default function DiscoverScreen() {

  const { posts, loading, error } = usePosts('/posts/new');

  const renderPost = ({ item }: {item: Post}) => (
    <PostPreview post={item} size={160} thumbnailSize='small' />
  );

  return (
    <>
    <View style={ScreenStyles.screen}>
      <FlatList
        ListHeaderComponent={
          <>
          <Text style={[TextStyles.h2, TextStyles.uppercase]} >What's New Today?</Text>
          <PostCarousel />
          <Text style={[TextStyles.h2, TextStyles.uppercase]} >You Might Like</Text>
          </>
        } // Carousel at the top
        data={posts} // Data for FlatList
        keyExtractor={(item) => item.id.toString()} // Unique key for each item
        renderItem={renderPost} // Function to render each item
        numColumns={2} // Grid layout with 2 columns
        columnWrapperStyle={Styles.grid} // Style for the row container
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<Text style={[TextStyles.p, {textAlign:'center'}, {color:"#888"}, {fontStyle:"italic"}]}>You're all caught up!</Text>} 
      />
      
    </View>
    <NavBar />
    </>
    
  );
}
