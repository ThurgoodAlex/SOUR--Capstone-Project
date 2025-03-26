
import { View, Dimensions, FlatList, StyleSheet } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { useApi } from '@/context/api';
import { Video } from '@/components/Video';
import { Post } from '@/constants/Types';
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
            const response = await api.get(`/posts/isVideo=true/`);
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