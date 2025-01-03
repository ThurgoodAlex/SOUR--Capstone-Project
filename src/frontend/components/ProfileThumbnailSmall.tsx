import { Styles, TextStyles } from '@/constants/Styles';
import { User } from '@/constants/Types';
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function ProfileThumbnailSmall({ user }: { user: User}) {
  const ProfileStyles = StyleSheet.create({
    thumbnailImage: {
      width: 22,
      height: 22,
      borderRadius: 18,
      marginRight: 5, 
    },
   
  });

  return (
    <View style={Styles.row}>
      <Image
        source={
            user.profilePicture
            ? user.profilePicture
            : require('../assets/images/profile_pic.jpg') // Default fallback
        }
        style={ProfileStyles.thumbnailImage}
      />
      <Text style={TextStyles.small}>@{user.name}</Text>
    </View>
  );
}
