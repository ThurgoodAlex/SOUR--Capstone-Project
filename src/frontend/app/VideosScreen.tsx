
import { View, Dimensions, FlatList, StyleSheet } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { useApi } from '@/context/api';
import { Video } from '@/components/Video';
import { Post } from '@/constants/Types';
import { StatusBar } from 'expo-status-bar';
import { useSearchParams } from 'expo-router/build/hooks';
import { usePosts } from '@/hooks/usePosts';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const VIDEO_HEIGHT = SCREEN_HEIGHT - 40;

export default function VideoScreen() {
    const searchParams = useSearchParams();
    const videoParam = searchParams.get('video');
    const api = useApi();
    const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 }
    const { posts, loading, error } = usePosts('/posts/?is_video=true');
    const [videoFeed, setVideoFeed] = useState<Post[]>([]);
    const [currentViewableItemIndex, setCurrentViewableItemIndex] = useState(0);

    const onViewableItemsChanged = ({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentViewableItemIndex(viewableItems[0].index ?? 0);
        }
    }
    const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }])

    const getVideos = async () => {
        try {
            let selectedVideo = null;
            if (videoParam) {
                selectedVideo = JSON.parse(videoParam);
            }
            console.log("videoParam", videoParam);
            
            
            // Ensure the selected video is at the top
            if (selectedVideo) {
                // Filter out the selected video if it appears in allVideos (to prevent duplication)
                const filteredVideos = posts.filter((video: Post) => video.id !== selectedVideo.id);
                setVideoFeed([selectedVideo, ...filteredVideos]);
            } else {
                setVideoFeed(posts);
            }
            console.log("posts", posts);
            console.log("videoFeed", videoFeed);
        } catch (error) {
            console.error('Post retrieval failed:', error);
        }
    };

    useEffect(() => {
        getVideos();
    }, [posts, videoParam]);

    const renderVideo = ({item, index} : {item: Post, index: number}) => (
        <Video post={item} index={index} currentViewableItemIndex={currentViewableItemIndex}/>
    );
    
    return (
        <>
            <StatusBar style='light'/>
            <View style={styles.container}>
                <FlatList
                    data={videoFeed}
                    renderItem={({ item, index }) => (
                        renderVideo({item, index})
                    )}
                    keyExtractor={item => item.id.toString()}
                    pagingEnabled
                    snapToAlignment="start"
                    snapToInterval={VIDEO_HEIGHT}
                    decelerationRate="fast"
                    showsVerticalScrollIndicator={false}
                    viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                />
            </View>
            <NavBar/>
        </>
        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
});