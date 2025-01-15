// import { NavBar } from '@/components/NavBar';
// import { ScreenStyles } from '@/constants/Styles';
// import { useVideoPlayer, VideoView, VideoSource } from 'expo-video';
// import { useState, useCallback } from 'react';
// import { StyleSheet, View } from 'react-native';
// import { GestureHandlerRootView, PanGestureHandler, ScrollView } from 'react-native-gesture-handler';

// const testFashion =
// //   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
//     require('../components/vids/testFashion.mp4');

// const elephantsDreamSource: VideoSource =
//   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';

// const bigBuckBunnySource: VideoSource = 
//   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

// export default function PreloadingVideoPlayerScreen() {
//   const player1 = useVideoPlayer(testFashion, player => {
//     player.loop = true;
//     player.play();
//   });

//   const player2 = useVideoPlayer(elephantsDreamSource, player => {
//     player.loop = true;
//   });

//   const player3 = useVideoPlayer(bigBuckBunnySource, player => {
//     player.loop = true;
//   });

//   const [currentPlayer, setCurrentPlayer] = useState(player1);

//   const replacePlayer = useCallback(() => {
//     currentPlayer.pause();
//     if (currentPlayer === player1) {
//       setCurrentPlayer(player2);
//       player2.play();
//     }
//     else if(currentPlayer === player2){
//       setCurrentPlayer(player3);
//       player3.play();
//     }
//     else{
//         setCurrentPlayer(player1);
//         player1.play();
//     }
//   }, [currentPlayer, player1, player2, player3]);

//   const handleSwipe = useCallback(({ nativeEvent }) => {
//     if (nativeEvent.translationY < -50) {
//       // Swipe up
//       replacePlayer();
//     } else if (nativeEvent.translationY > 50) {
//       // Swipe down
//       replacePlayer();
//     }
//   }, [replacePlayer]);

//   return (
//     <>
    
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <View style={ScreenStyles.screen}>
//         <PanGestureHandler onGestureEvent={handleSwipe}>
//           {/* <ScrollView contentContainerStyle={styles.videoContainer}> */}
//             <VideoView player={currentPlayer} style={styles.video} nativeControls={false} />
//           {/* </ScrollView> */}
//         </PanGestureHandler>
       
//       </View>
//     </GestureHandlerRootView>
//     <NavBar />
//     </>
    
//   );
// }

// const styles = StyleSheet.create({
//   videoContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',

//   },
//   video: {
//     width: '90%',
//     height: '90%',
//     marginVertical: 20,
//   },
// });

import { View, Dimensions, FlatList, StyleSheet, Pressable } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useEffect, useRef, useState } from 'react';

const videos = [
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
];

export default function FeedScreen() {
  const [currentViewableItemIndex, setCurrentViewableItemIndex] = useState(0);
  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 }
  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentViewableItemIndex(viewableItems[0].index ?? 0);
    }
  }
  const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }])
  return (
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
  );
}

const Item = ({ item, shouldPlay }: {shouldPlay: boolean; item: string}) => {
  const video = useRef<Video | null>(null);
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    if (!video.current) return;

    if (shouldPlay) {
      video.current.playAsync()
    } else {
      video.current.pauseAsync()
      video.current.setPositionAsync(0)
    }
  }, [shouldPlay])

  return (
    <Pressable onPress={() => status.isPlaying ? video.current?.pauseAsync() : video.current?.playAsync()}>
      <View style={styles.videoContainer}>
      <Video 
        ref={video}
        source={{ uri: item }}
        style={styles.video}
        isLooping
        resizeMode={ResizeMode.COVER}
        useNativeControls={false}
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
    </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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