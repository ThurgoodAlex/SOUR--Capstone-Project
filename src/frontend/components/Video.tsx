import { View, TouchableOpacity, Pressable, Dimensions, StyleSheet, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Post, User } from '@/constants/Types';
import ProfileThumbnail from '@/components/ProfileThumbnail';
import { useVideoPlayer, VideoView, VideoSource } from 'expo-video';
import { LinearGradient } from 'expo-linear-gradient'
import { useEvent } from 'expo';
import { useEffect, useRef, useState } from 'react';
import { useApi } from '@/context/api';
import { usePosts } from '@/hooks/usePosts';
import { LinkedItems } from '@/components/LinkedItems';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const VIDEO_HEIGHT = SCREEN_HEIGHT - 40;

const videos = [
    require('../assets/vids/testFashion.mp4'),
    require('../assets/vids/testFashion(1).mp4'),
    require('../assets/vids/testFashion(2).mp4'),
    require('../assets/vids/testFashion(3).mp4'),
    require('../assets/vids/testFashion(4).mp4'),
    require('../assets/vids/testFashion(5).mp4'),
    require('../assets/vids/testFashion(6).mp4'),
];

export function Video({ post, index, currentViewableItemIndex }: { post: Post, index: number, currentViewableItemIndex: number }) {
    const video = useRef<VideoView>(null);
    const [liked, setLike] = useState(false);
    const [showLinks, setShowLinks] = useState(false);
    const api = useApi();
    const shouldPlay = index == currentViewableItemIndex;
    const { posts: linkedItems, loading: linkedPostsLoading, error: linkedPostsError } = usePosts(`/posts/${post.id}/links/`);
    const getRandomVideo = () => videos[Math.floor(Math.random() * videos.length)];
    const [assetId, setAssetId] = useState(getRandomVideo());

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
        profilePic: require('../assets/images/prof1.jpg'),
        isSeller: true,
        id: 2,
    }; 
    const fetchLike = async () => {
        const response = await api.get(`/posts/${post.id}/like/`);
        const data = await response.json();
        setLike(data)
    }
    
    const toggleLike = async () => {
        try {
            if (liked) {
                await api.remove(`/posts/${post.id}/unlike/`,{});
            } else {
                await api.post(`/posts/${post.id}/like/`);
            }
            setLike(!liked); // Update local state
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const player = useRef(useVideoPlayer(assetId, player => {
        player.loop = true;
        player.play();
    })).current;

    useEffect(() => {
        fetchLike();
      }, [shouldPlay]);

    return (
        <View style={VideoStyles.container}>
            <View style={{ width: '100%', height: VIDEO_HEIGHT }}>
                <VideoView
                    ref={video}
                    player={player}
                    style={StyleSheet.absoluteFill}
                    contentFit='contain'
                />
            </View>
            
            <LinearGradient
                colors={['transparent', '#00000080']}
                style={[StyleSheet.absoluteFillObject, VideoStyles.overlay]}
            />
            <SafeAreaView style={VideoStyles.overlayContainer}>
                <View style={VideoStyles.footer}>
                    <View style={VideoStyles.leftColumn}>
                        { showLinks ? (
                            <ScrollView style={VideoStyles.linkedItemsContainer}>
                                <LinkedItems posts={linkedItems} columns={1}/>
                            </ScrollView>
                            ) : null
                        }
                        <View style={VideoStyles.fixedProfile}>
                            <ProfileThumbnail user={seller}/>
                        </View>
                    </View>
                    <View style={VideoStyles.rightColumn}>
                        {linkedItems.length > 0 ? (
                            <TouchableOpacity onPress={() => setShowLinks(!showLinks)}>
                                <Ionicons size={30} name='link' color={Colors.light} />
                            </TouchableOpacity>
                        ) : null}
                        <TouchableOpacity onPress={toggleLike}>
                            {liked ? (
                                <Ionicons size={30} name='heart' color='red' />
                            ) : (
                                <Ionicons size={30} name='heart-outline' color={Colors.light} />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const VideoStyles = StyleSheet.create({
    overlayContainer: {
        ...StyleSheet.absoluteFillObject,
        flex: 1
    },
    container: {
        height: VIDEO_HEIGHT,
    },
    content: {
        flex: 1,
        padding: 10
    },
    overlay: {
        top: '50%'
    },
    footer: {
        flexDirection: 'row',
        marginTop: 'auto',
        alignItems: 'flex-end'
    },
    linkedItemsContainer: {
        backgroundColor: Colors.light60,
        maxHeight: 200,
        marginBottom: 60,
    },
    fixedProfile: {
        position: "absolute",
        bottom: 10,
        left: 10,
    },
    h3: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        color: Colors.light,
    },
    small: {
        fontSize:11,
        color: Colors.light,
    },
    leftColumn: {
        flex: 1
    },
    rightColumn: {
        gap: 10,
        paddingRight: 10
    },
});
               