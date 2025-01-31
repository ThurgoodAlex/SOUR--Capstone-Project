import { Styles, TextStyles } from '@/constants/Styles';
import { User } from '@/constants/Types';
import { useUser } from '@/context/user';
import { router } from 'expo-router';
import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';

export default function ProfileThumbnail({ user }: {user: User}) {

  const current_user = useUser().user;
  
  const ProfileStyles = StyleSheet.create({
    thumbnailImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
  })

  return (
    <>
      <TouchableOpacity
        onPress={() =>
            {
                if(user.id == current_user?.id){
                    router.push({
                        pathname: '/SelfProfileScreen',
                    })
                }
                else{
                    router.push({
                        pathname: '/UserProfileScreen',
                        params: { user: JSON.stringify(user) },
                    })
                }
            }
        }
        style={[Styles.row, {marginLeft:6}]}
      >
        
        <Image
            source={
                user.profilePic
                ? user.profilePic
                : require('../assets/images/profile_pic.jpg') // Default fallback
            }
            style={ProfileStyles.thumbnailImage}
            />
            <View style={[Styles.column, Styles.alignLeft, {marginLeft:5}]}>
            <Text style={[TextStyles.h3, {marginBottom:0}]}>{user.firstname} {user.lastname}</Text>
            <Text style={[TextStyles.small, {marginTop:1}]}>@{user.username}</Text>
            </View>
      </TouchableOpacity>
    </> 
  );
};