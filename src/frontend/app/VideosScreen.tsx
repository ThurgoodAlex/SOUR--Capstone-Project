import { Text, ScrollView, View } from 'react-native';
import { NavBar } from '@/components/NavBar'
import { GridPosts } from '@/components/GridPosts';
import { Stack } from 'expo-router';
import { Styles } from '@/constants/Styles';

export default function VideosScreen() {
    const dummyVideos = [
        {
            id: 1,
            data: './imgs/toad.png',
            user: 'Princess Peach',
            type: 'video',
        },
        {
            id: 2,
            data: './imgs/toad.png',
            user: 'Mario',
            type: 'post',
        },
        {
            id: 3,
            data: './imgs/toad.png',
            user: 'Bowser',
            type: 'listing',
        },
        {
            id: 4,
            data: './imgs/toad.png',
            user: 'Princess Daisy',
            type: 'listing',
        },
    ];
    return (
        <>
            <Stack.Screen
                options={{ title: 'VideosScreen' }}
            />
            <View style={Styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text>
                        video screen
                    </Text>
                    <GridPosts posts={dummyVideos}/>
                </ScrollView>
            </View>
            <NavBar/>
        </>
        
    );
}
