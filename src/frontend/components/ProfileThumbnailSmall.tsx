import { Styles, TextStyles } from '@/constants/Styles';
import { User } from '@/constants/Types';
import { useUser } from '@/context/user';
import { router } from 'expo-router';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function ProfileThumbnailSmall({ user }: { user: User}) {
  const current_user = useUser().user;
  const ProfileStyles = StyleSheet.create({
    thumbnailImage: {
      width: 22,
      height: 22,
      borderRadius: 18,
      marginRight: 5, 
    },
   
  });

  let ProfileImage;
  if(user.id == 3){
    ProfileImage = require('../assets/images/prof1.jpg') // Default fallback
  }
  else if(user.id == 2){
    ProfileImage = require('../assets/images/profile_pic.jpg') // Default fallback
  }
  else if(user.id == 1){
    ProfileImage = require('../assets/images/prof2.jpeg') // Default fallback
  }
  else{
    ProfileImage = require('../assets/images/prof3.jpeg') // Default fallback
  }
  return (
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
        style={{ marginLeft: 6 }}
    >
          
      <View style={[Styles.row, {marginBottom: 10}]}>
        <Image
          source={
            ProfileImage
              // user.profilePic
              // ? user.profilePic
              // : require('../assets/images/profile_pic.jpg') // Default fallback
          }
          style={ProfileStyles.thumbnailImage}
        />
        <Text style={[TextStyles.small, {marginBottom:8}]}>@{user.username}</Text>
      </View>
    </TouchableOpacity>
  );
}
