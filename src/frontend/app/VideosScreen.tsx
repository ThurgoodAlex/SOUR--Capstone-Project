
import { View, Dimensions, FlatList, StyleSheet } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { Stack } from 'expo-router';
import { ScreenStyles } from '@/constants/Styles';
import { useApi } from '@/context/api';
import { Video } from '@/components/Video';
import { Post } from '@/constants/Types';
import { Colors } from '@/constants/Colors';
import { useVideoPlayer, VideoView } from 'expo-video';
import { StatusBar } from 'expo-status-bar';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const VIDEO_HEIGHT = SCREEN_HEIGHT - 40;

export default function VideoScreen() {
    const api = useApi();
    const [videos, setVideos] = useState();
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
            const response = await api.get(`/posts/isListing=false/`);
            if (response.ok) {
                const videosData = await response.json();
                setVideos(videosData)
            } else {
                console.error("posts retrival failed:", response);
            }
        } catch (error) {
            console.error('posts retrival failed:', error);
        }
    };

    useEffect(() => {
        getVideos();
    }, []);

    // const player = useVideoPlayer(require('../assets/vids/testFashion.mp4'), player => {
    //     player.loop = true;
    //     player.play();
    //   });

    const renderVideo = ({item, index} : {item: Post, index: number}) => (
        <Video post={item} index={index} currentViewableItemIndex={currentViewableItemIndex}/>
        // <VideoView style={{ width: '100%', height: VIDEO_HEIGHT }} player={player} />
    );
    return (
        <>
            <Stack.Screen options={{
                title: 'VideosScreen',
                headerShown: false
                }}/>
            <StatusBar style='light'/>
            <View style={styles.container}>
                <FlatList
                    data={videos}
                    renderItem={({ item, index }) => (
                        renderVideo({item, index})
                    )}
                    keyExtractor={item => item.id}
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