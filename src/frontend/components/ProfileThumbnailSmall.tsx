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

  const profPicMapping: Record<number, any> = {
    1: require('@/assets/images/prof1.jpg'),
    5: require('@/assets/images/prof2.jpg'),
    2: require('@/assets/images/prof3.jpg'),
    3: require('@/assets/images/julia.png'),

  }


  console.log("Profile Pic: ", user.profilePic);
  let profilePic = user.id in profPicMapping ? profPicMapping[user.id] : require('@/assets/images/blank_profile_pic.png');
  

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
          source={profilePic}
          style={ProfileStyles.thumbnailImage}
        />
        <Text style={[TextStyles.small, {marginBottom:8}]}>@{user.username}</Text>
      </View>
    </TouchableOpacity>
  );
}
