import { NavBar } from '@/components/NavBar';
import { ScreenStyles } from '@/constants/Styles';
import { useVideoPlayer, VideoView, VideoSource } from 'expo-video';
import { useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, ScrollView } from 'react-native-gesture-handler';

const bigBuckBunnySource: VideoSource =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

const elephantsDreamSource: VideoSource =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';

const forBiggerBlazesSource: VideoSource = 
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

export default function PreloadingVideoPlayerScreen() {
  const player1 = useVideoPlayer(bigBuckBunnySource, player => {
    player.play();
  });

  const player2 = useVideoPlayer(elephantsDreamSource, player => {
    player.currentTime = 20;
  });

  const player3 = useVideoPlayer(forBiggerBlazesSource, player => {
    player.currentTime = 20;
  });

  const [currentPlayer, setCurrentPlayer] = useState(player1);

  const replacePlayerPrevious = useCallback(() => {
    currentPlayer.pause();
    if (currentPlayer === player1) {
      setCurrentPlayer(player3);
      player3.play();
    }
    else if(currentPlayer === player2){
      setCurrentPlayer(player1);
      player1.play();
    }
    else{
        setCurrentPlayer(player2);
        player2.play();
    }
  }, [currentPlayer, player1, player2]);

  const replacePlayerNext = useCallback(() => {
    currentPlayer.pause();
    if (currentPlayer === player1) {
      setCurrentPlayer(player2);
      player2.play();
    }
    else if(currentPlayer === player2){
      setCurrentPlayer(player3);
      player3.play();
    }
    else{
        setCurrentPlayer(player1);
        player1.play();
    }
  }, [currentPlayer, player1, player2]);

  const handleSwipe = useCallback(({ nativeEvent }) => {
    if (nativeEvent.translationY < -50) {
      // Swipe up
      replacePlayerNext();
    } else if (nativeEvent.translationY > 50) {
      // Swipe down
      replacePlayerPrevious();
    }
  }, [replacePlayerNext, replacePlayerPrevious]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={ScreenStyles.screen}>
        <PanGestureHandler onGestureEvent={handleSwipe}>
          {/* <ScrollView contentContainerStyle={styles.videoContainer}> */}
            <VideoView player={currentPlayer} style={styles.video} nativeControls={false} />
          {/* </ScrollView> */}
        </PanGestureHandler>
        <NavBar />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  video: {
    width: '90%',
    height: '90%',
    marginVertical: 20,
  },
});
