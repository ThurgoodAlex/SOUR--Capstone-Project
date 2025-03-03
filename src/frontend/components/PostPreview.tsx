import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, ViewStyle } from 'react-native';
import { Styles, TextStyles } from '@/constants/Styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Post, User } from '@/constants/Types';
import ProfileThumbnail from '@/components/ProfileThumbnail';
import ProfileThumbnailSmall from '@/components/ProfileThumbnailSmall';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useGetMedia } from '@/hooks/useGetMedia';

interface PostPreviewProps {
  post: Post;
  size: number;
  profileThumbnail?: 'none' | 'small' | 'big'; // Match your original typing
  touchable?: boolean;
}

export function PostPreview({ post, size, profileThumbnail = 'none', touchable = true }: PostPreviewProps) {
  const { images, loading: mediaLoading, error: mediaError } = useGetMedia(Number(post.id));

  // if (mediaLoading) return <Text>Loading...</Text>;
  if (mediaError) return <Text>Error: {mediaError}</Text>;

  const coverImage = images && images.length > 0 ? images[0].url : post.coverImage || "";

  let icon;
  let type = post.isListing ? 'listing' : 'post';

  if (type === 'post') {
    icon = <Ionicons size={25} style={{ color: Colors.dark, opacity: 0.7, margin: 5 }} name='megaphone' />;
  } else if (type === 'listing') {
    icon = <Ionicons size={25} style={{ color: Colors.dark, opacity: 0.7, margin: 5 }} name='pricetag' />;
  }

  const isSold = post.isSold;
  const previewStyle = [
    Styles.column,
    { marginBottom: 10, opacity: isSold ? 0.5 : 1 },
  ];
  const overlayStyle: ViewStyle | undefined = isSold
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
      }
    : undefined;

  const seller: User = {
    firstname: post.seller.firstname,
    lastname: post.seller.lastname,
    username: post.seller.username,
    bio: post.seller.bio,
    email: post.seller.email,
    profilePic: post.seller.profilePic,
    isSeller: post.seller.isSeller,
    id: post.seller.id,
  };

  return (
    <View key={post.id} style={[previewStyle, { justifyContent: 'flex-start' }]}>
      <TouchableOpacity
        onPress={() => router.push(`/PostInfoScreen/${post.id}`)}
        style={{ margin: 5 }}
        disabled={!touchable}
      >
        <ImageBackground
          source={{ uri: typeof coverImage === 'string' ? coverImage : '' }}
          style={{ height: size, width: size }}
        >
          {icon}
          {Boolean(isSold) && <View style={overlayStyle} />}
          {Boolean(isSold) && (
            <View style={{ position: 'absolute', top: 65, left: 50 }}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>SOLD</Text>
            </View>
          )}
        </ImageBackground>
      </TouchableOpacity>

      {profileThumbnail !== 'none' ? (
        profileThumbnail === 'big' ? (
          <ProfileThumbnail user={seller} />
        ) : seller ? (
          <ProfileThumbnailSmall user={seller} />
        ) : (
          <Text>No seller information available</Text>
        )
      ) : (
        <Text style={[TextStyles.h3, { textAlign: 'left' }]}>{post.title}</Text>
      )}
    </View>
  );
}