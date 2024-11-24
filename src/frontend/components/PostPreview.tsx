import { View, Text, ImageBackground } from 'react-native';
import { Styles } from '@/constants/Styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Post } from '@/constants/Types';
import ProfileThumbnail from '@/components/ProfileThumbnail';

/**
 * The visualization of how a campus post looks like.
 * @param post - Props object containing the post details.
 * @returns A post view component.
 */
export function PostPreview({post, size}: {post: Post, size: number}) {
  const { id, data, user, type } = post;
  let icon;
  if (type === 'video'){
    icon = <Ionicons size={20} name='videocam'/>
  }
  else if (type === 'post'){
    icon = <Ionicons size={20} name='megaphone'/>
  }
  else{
    icon = <Ionicons size={20} name='pricetag'/>
  }

  return (
    <View key={id} style={Styles.postPreview}>
        {/* <Image source={{ uri: 'https://via.placeholder.com/200'}} style={{resizeMode: 'contain'}}/> */}
        <ImageBackground source={require('./imgs/toad.png')} style={{height: size, width:size}}>
            {icon}
        </ImageBackground>
      
        
    </View>
  );
}