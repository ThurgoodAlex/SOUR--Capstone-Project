
import { useVideoPlayer, VideoView, VideoSource } from 'expo-video';
import { View, Dimensions, FlatList, StyleSheet, Pressable } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useEvent } from 'expo';
import { NavBar } from '@/components/NavBar';
import { Stack } from 'expo-router';
import { ScreenStyles } from '@/constants/Styles';
import { useApi } from '@/context/api';
import { Video } from '@/components/Video';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const videos = [
    require('../assets/vids/testFashion.mp4'),
    require('../assets/vids/testFashion(1).mp4'),
    require('../assets/vids/testFashion(2).mp4'),
    require('../assets/vids/testFashion(3).mp4'),
    require('../assets/vids/testFashion(4).mp4'),
    require('../assets/vids/testFashion(5).mp4'),
    require('../assets/vids/testFashion(6).mp4'),
];

export default function VideoScreen() {
    const api = useApi();
    const [currentViewableItemIndex, setCurrentViewableItemIndex] = useState(0);
    const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 }
    const onViewableItemsChanged = ({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentViewableItemIndex(viewableItems[0].index ?? 0);
        }
    }
    const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }])

    const getVideos = async () => {
        // try {
        //     const response = await api.get(`/posts/isVideo=true/`);
        //     if (response.ok) {
        //     } else {
        //         console.error("Chats retrival failed:", response);
        //     }
        // } catch (error) {
        //     console.error('Chats retrival failed:', error);
        // }
    };

    useEffect(() => {
        getVideos();
    }, []);

    const renderVideo = ({item, index} : {item: number, index: number}) => (
        <Video assetId={item} index={index} currentViewableItemIndex={currentViewableItemIndex}/>
    );
    return (
        <>
            <Stack.Screen options={{ title: 'VideosScreen' }}/>
            <View style={ScreenStyles.screenCentered}>
                <FlatList
                    data={videos}
                    renderItem={({ item, index }) => (
                        renderVideo({item, index})
                    )}
                    keyExtractor={item => item}
                    pagingEnabled
                    snapToAlignment="start"
                    snapToInterval={SCREEN_HEIGHT}
                    decelerationRate="fast"
                    showsVerticalScrollIndicator={false}
                    viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                />
            </View>
            <NavBar/>
        </>
        
    );
}