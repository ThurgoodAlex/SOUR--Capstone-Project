
import { useVideoPlayer, VideoView, VideoSource } from 'expo-video';
import { View, Dimensions, FlatList, StyleSheet, Pressable } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useEvent } from 'expo';
import { NavBar } from '@/components/NavBar';
import { Stack } from 'expo-router';
import { ScreenStyles } from '@/constants/Styles';

const videos = [
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
];

export default function VideoScreen() {
    const [currentViewableItemIndex, setCurrentViewableItemIndex] = useState(0);
    const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 }
    const onViewableItemsChanged = ({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentViewableItemIndex(viewableItems[0].index ?? 0);
        }
    }
    const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }])
    return (
        <>
            <Stack.Screen options={{ title: 'VideosScreen' }}/>
            <View style={styles.container}>
                <FlatList
                    data={videos}
                    renderItem={({ item, index }) => (
                        <Item item={item} shouldPlay={index === currentViewableItemIndex} />
                    )}
                    keyExtractor={item => item}
                    pagingEnabled
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                    viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                />
            </View>
            <NavBar/>
        </>
        
    );
}

const Item = ({ item, shouldPlay }: { item: string; shouldPlay: boolean }) => {
    const videoSource: VideoSource = { uri: item };
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
        <Pressable onPress={() => (isPlaying ? player.pause() : player.play())}>
            <View style={styles.videoContainer}>
                <VideoView player={player} style={styles.video} />
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 34
    },
    videoContainer: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    video: {
        width: '100%',
        height: '100%',
    },
});