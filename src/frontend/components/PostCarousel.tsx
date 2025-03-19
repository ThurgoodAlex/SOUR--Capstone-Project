import { View, ScrollView, Alert, Text } from 'react-native';
import { Styles } from '@/constants/Styles';
import { PostPreview } from './PostPreview';
import { useApi } from '@/context/api';
import { useCallback, useEffect, useState } from 'react';
import { Post } from '@/constants/Types';
import { useUser } from '@/context/user';
import { useAuth } from '@/context/auth';
import { usePosts } from '@/hooks/usePosts';


export default function PostCarousel() {
    const { posts, loading, error } = usePosts('/posts/new');
  
    // if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error}</Text>;
  
    return (
      <View style={[Styles.row, { marginBottom: 18 }]}>
        <ScrollView horizontal={true}>
          {posts.map((post) => (
            <View key={post.id}>
              <PostPreview post={post} size={350} profileThumbnail='big'/>
            </View>

          ))}
        </ScrollView>
      </View>
    );
  }