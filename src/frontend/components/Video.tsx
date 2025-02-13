import { View, Text, ImageBackground, TouchableOpacity, ViewStyle, Pressable, Dimensions, StyleSheet } from 'react-native';
import { Styles, TextStyles } from '@/constants/Styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Post, User } from '@/constants/Types';
import ProfileThumbnail from '@/components/ProfileThumbnail';
import { router } from 'expo-router';
import { useVideoPlayer, VideoView, VideoSource } from 'expo-video';
import { useEvent } from 'expo';
import { useEffect, useState } from 'react';
import { useApi } from '@/context/api';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// TODO: change assetId:number to post: Post
export function Video({ assetId, index, currentViewableItemIndex }: { assetId: any, index: number, currentViewableItemIndex: number }) {
    const [liked, setLike] = useState(false);
    const api = useApi();
    const shouldPlay = index == currentViewableItemIndex;
    //extract seller information into a User object
    // const seller: User = {
    //     firstname: post.seller.firstname,
    //     lastname: post.seller.lastname,
    //     username: post.seller.username,
    //     bio: post.seller.bio,
    //     email: post.seller.email,
    //     profilePic: post.seller.profilePic,
    //     isSeller: post.seller.isSeller,
    //     id: post.seller.id,
    // }; 
    const seller: User = {
        firstname: "Emma",
        lastname: "Luk",
        username: "emma_luky",
        bio: "",
        email: "emmahluk@gmail.com",
        profilePic: require('../assets/images/profile_pic.jpg'),
        isSeller: true,
        id: 2,
    }; 
    const fetchLike = async () => {
        // const response = await api.get(`/posts/${post.id}/like/`);
        // const data = await response.json();
        // setLike(data)
    }

    fetchLike();
    
    const toggleLike = async () => {
        // try {
        //     if (liked) {
        //         await api.remove(`/posts/${post.id}/unlike/`,{});
        //     } else {
        //         await api.post(`/posts/${post.id}/like/`);
        //     }
        //     setLike(!liked); // Update local state
        // } catch (error) {
        //     console.error('Error toggling like:', error);
        // }
    };
    const videoSource: VideoSource = {assetId};
    const player = useVideoPlayer(videoSource, player => {
        player.loop = true;
    });

    const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

    useEffect(() => {
        if (shouldPlay) {
          player.play();
        } else {
          player.pause();
          player.currentTime = 0;
        }
      }, [shouldPlay]);

    return (
        <View style={styles.container}>
            <Pressable onPress={() => (isPlaying ? player.pause() : player.play())}>
                <VideoView player={player} style={styles.video} />
            </Pressable>
            
            <View style={[Styles.row, {justifyContent: 'space-between'}]}>
                <ProfileThumbnail user={seller} />
                <TouchableOpacity onPress={toggleLike}>
                    {liked ? (
                        <Ionicons size={20} name='heart' color='red' />
                    ) : (
                        <Ionicons size={20} name='heart-outline' color='gray' />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    video: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT
    }
});
               