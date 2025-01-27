import { Styles, TextStyles } from '@/constants/Styles';
import { User } from '@/constants/Types';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';

export default function ProfileThumbnail({ user }: {user: User}) {

  const ProfileStyles = StyleSheet.create({
    thumbnailImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
  })

  return (
    <>
        <TouchableOpacity style={Styles.row}>
            <Image
            source={
                user.profilePicture
                ? user.profilePicture
                : require('../assets/images/profile_pic.jpg') // Default fallback
            }
            style={ProfileStyles.thumbnailImage}
            />
            <View style={[Styles.column, Styles.alignLeft, {marginLeft:2}]}>
            <Text style={[TextStyles.h3, {marginBottom:0}]}>{user.firstname} {user.lastname}</Text>
            <Text style={[TextStyles.small, {marginTop:1}]}>@{user.username}</Text>
            </View>
        </TouchableOpacity>
    </> 
  );
};