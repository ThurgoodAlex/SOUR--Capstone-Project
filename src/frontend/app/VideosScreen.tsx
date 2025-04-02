
import { View, Dimensions, FlatList, StyleSheet } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { useApi } from '@/context/api';
import { Video } from '@/components/Video';
import { Post } from '@/constants/Types';
import { StatusBar } from 'expo-status-bar';
import { useSearchParams } from 'expo-router/build/hooks';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const VIDEO_HEIGHT = SCREEN_HEIGHT - 40;

export default function VideoScreen() {
    const searchParams = useSearchParams();
    const videoParam = searchParams.get('videoId');
    const api = useApi();
    const [videos, setVideos] = useState<Post[]>([]);
    const [currentViewableItemIndex, setCurrentViewableItemIndex] = useState(0);
    const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 }

    const onViewableItemsChanged = ({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentViewableItemIndex(viewableItems[0].index ?? 0);
        }
    }
    const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }])

    const getVideos = async () => {
        try {
            let allVideos = [];
            let selectedVideo = null;
    
            if (videoParam) {
                // Fetch the specific video first
                const response = await api.get(`/posts/${videoParam}/`);
                if (response.ok) {
                    selectedVideo = await response.json();
                } else {
                    console.error("Failed to retrieve the selected video:", response);
                }
            }
    
            // Fetch all video posts
            const allVideosResponse = await api.get(`/posts/isVideo=true/`);
            if (allVideosResponse.ok) {
                allVideos = await allVideosResponse.json();
            } else {
                console.error("Failed to retrieve video posts:", allVideosResponse);
            }
    
            // Ensure the selected video is at the top
            if (selectedVideo) {
                // Filter out the selected video if it appears in allVideos (to prevent duplication)
                allVideos = allVideos.filter((video: Post) => video.id !== selectedVideo.id);
                setVideos([selectedVideo, ...allVideos]);
            } else {
                setVideos(allVideos);
            }
        } catch (error) {
            console.error('Post retrieval failed:', error);
        }
    };

    useEffect(() => {
        getVideos();
    }, []);

    const renderVideo = ({item, index} : {item: Post, index: number}) => (
        <Video post={item} index={index} currentViewableItemIndex={currentViewableItemIndex}/>
    );
    
    return (
        <>
            <StatusBar style='light'/>
            <View style={styles.container}>
                <FlatList
                    data={videos}
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