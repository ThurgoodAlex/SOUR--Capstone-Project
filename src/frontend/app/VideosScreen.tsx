import { ScreenStyles, Styles } from '@/constants/Styles';
import { Link, router } from 'expo-router';
import { Button, View, Text, ScrollView } from 'react-native';
import { PostPreview } from '@/components/PostPreview'
import { NavBar } from '@/components/NavBar'

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
         <View style={ScreenStyles.screen}>
            <ScrollView showsVerticalScrollIndicator={false} >
                <Text>
                    video screen
                </Text>
                <View style={Styles.grid}>
                    {dummyVideos.map((post) => (
                        <PostPreview 
                            key={post.id}
                            post={post}
                            size={160}
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
        <NavBar/>
        </>
       
        
    );
}
