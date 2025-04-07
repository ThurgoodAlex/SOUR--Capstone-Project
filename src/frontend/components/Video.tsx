import { View, TouchableOpacity, Text, Dimensions, StyleSheet, ScrollView, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Post, User } from '@/constants/Types';
import ProfileThumbnail from '@/components/ProfileThumbnail';
import { useVideoPlayer, VideoView, VideoSource } from 'expo-video';
import { LinearGradient } from 'expo-linear-gradient'
import { useEvent } from 'expo';
import { useEffect, useRef, useState } from 'react';
import { useApi } from '@/context/api';
import { usePosts } from '@/hooks/usePosts';
import { useGetMedia } from '@/hooks/useGetMedia'
import { LinkedItems } from '@/components/LinkedItems';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { Styles, TextStyles } from '@/constants/Styles';
import { router } from 'expo-router';
import { useUser } from '@/context/user';


const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const VIDEO_HEIGHT = SCREEN_HEIGHT - 40;

export function Video({ post, index, currentViewableItemIndex }: { post: Post, index: number, currentViewableItemIndex: number }) {
    const video = useRef<VideoView>(null);
    const [liked, setLike] = useState(false);
    const [showLinks, setShowLinks] = useState(false);
    const api = useApi();
    const shouldPlay = index == currentViewableItemIndex;
    const { posts: linkedItems, loading: linkedPostsLoading, error: linkedPostsError } = usePosts(`/posts/${post.id}/links/`);
    const { images, loading, error, refetch } = useGetMedia(post.id);
    const [player, setPlayer] = useState<ReturnType<typeof useVideoPlayer> | null>(null);
    const [isSellerLoaded, setIsSellerLoaded] = useState(false); // State to track if seller is loaded


    const videoPlayer = useVideoPlayer(images?.[0]?.url ?? require('../assets/images/placeholder.png'), (player) => {
        player.loop = true;
        player.play();
    });

    const fetchLike = async () => {
        const response = await api.get(`/posts/${post.id}/like/`);
        const data = await response.json();
        setLike(data)
    }

    const toggleLike = async () => {
        try {
            if (liked) {
                await api.remove(`/posts/${post.id}/unlike/`, {});
            } else {
                await api.post(`/posts/${post.id}/like/`);
            }
            setLike(!liked);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    useEffect(() => {
        fetchLike()
        if (images?.length > 0 && videoPlayer) {
            setPlayer(videoPlayer);
        }
        if (post.seller) {
            setIsSellerLoaded(true);
        }
    }, [shouldPlay, images, post.seller]);

    return (
        <View style={VideoStyles.container}>
            <View style={{ width: '100%', height: VIDEO_HEIGHT }}>
                {player ? (
                    <VideoView
                        ref={video}
                        player={player}
                        style={StyleSheet.absoluteFill}
                        contentFit="contain"
                    />
                ) : (
                    <View style={{ height: VIDEO_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
                        <Ionicons name="cloud-download-outline" size={40} color="white" />
                    </View>
                )}
            </View>

            <LinearGradient
                colors={['transparent', '#00000080']}
                style={[StyleSheet.absoluteFillObject, VideoStyles.overlay]}
            />
            <SafeAreaView style={VideoStyles.overlayContainer}>
                <View style={VideoStyles.footer}>
                   
                        {showLinks ? (
                            <ScrollView style={VideoStyles.linkedItemsContainer}>
                                <LinkedItems posts={linkedItems} columns={1} />
                            </ScrollView>
                        ) : null
                        }
             

                        
                        <View style={[Styles.column, { backgroundColor: '#80808095', width:400, marginLeft:-10,  padding:10 }]}>

                            <View style={[Styles.row, {justifyContent:'space-between', alignItems:'flex-start'}]}>

                                <View style={[Styles.column, {width:330}]}>
                                <Text style={[{ color: Colors.white, fontWeight:'bold', fontSize:17, marginBottom: 0, marginTop:10 }]}>{post.title}</Text>
                                <Text style={[{ color: Colors.light, marginBottom: 0 }]}>{post.description}</Text>
                                </View>

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

                        
                            {isSellerLoaded && post.seller ? (
                                <VideoProfile user={post.seller} video={post} />
                            ) : (
                                <Text style={[TextStyles.h3, { color: Colors.light }]}>Loading seller info...</Text>
                            )}

                        </View>
                        
                    
                  
                  
                </View>
            </SafeAreaView>
        </View>
    );
}

function VideoProfile({ user, video }: { user: User, video: Post }) {
    const current_user = useUser().user;

    const thumbnailStyle = StyleSheet.create({
        thumbnailImage: {
            width: 40,
            height: 40,
            borderRadius: 20,
        },
    })

    const profPicMapping: Record<number, any> = {
        1: require('@/assets/images/prof1.jpg'),
        5: require('@/assets/images/prof2.jpg'),
        2: require('@/assets/images/prof3.jpg')
      }
    
    
    console.log("Profile Pic: ", user.profilePic);
    let profilePic = user.id in profPicMapping ? profPicMapping[user.id] : require('@/assets/images/blank_profile_pic.png');
      
    return (

       
       
        <TouchableOpacity
            onPress={() => {
                if (user.id == current_user?.id) {
                    router.push({
                        pathname: '/SelfProfileScreen',
                    })
                }
                else {
                    router.push({
                        pathname: '/UserProfileScreen',
                        params: { user: JSON.stringify(user) },
                    })
                }
            }
            }
            style={[Styles.row, { marginLeft: 6, marginTop: 6, maxHeight: 60, alignItems: 'center' }]}
        >

            <Image
                source={profilePic}
                style={thumbnailStyle.thumbnailImage}
            />
            <View style={[Styles.column, Styles.alignLeft, { marginLeft: 5 }]}>
                <Text style={[{ color:Colors.white, marginTop: 1, fontWeight:'bold', fontSize:13 }]}>{user.firstname} {user.lastname}</Text>
                <Text style={[{ color:Colors.white, marginTop: 1, fontSize:10 }]}>@{user.username}</Text>
            </View>
        </TouchableOpacity>
      
    );
}

const VideoStyles = StyleSheet.create({
    overlayContainer: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
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
        flexDirection: 'column',
        marginTop: 'auto',
        alignItems: 'flex-end',
        backgroundColor: '#3b0b0180',
        position: "absolute",
        bottom:25,
        left: -5,
        width:'103%'
    },
    linkedItemsContainer: {
        backgroundColor: '#f7f3ea95',
        maxHeight: 200,
        paddingHorizontal: 10,
    },
    
    h3: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        color: Colors.light,
    },
    small: {
        fontSize: 11,
        color: Colors.light,
    },
   
});
