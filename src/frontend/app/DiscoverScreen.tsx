import { Styles } from '@/constants/Styles';
import { Link, router } from 'expo-router';
import { Button, View, Text, ScrollView } from 'react-native';
import { PostPreview } from '../components/PostPreview'

export default function DiscoverScreen() {
    const dummyPosts = [
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
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={Styles.gridContainer}>
                {dummyPosts.map((post) => (
                    <PostPreview
                        key={post.id}
                        id={post.id}
                        data={post.data}
                        user={post.user}
                        type={post.type as 'video' | 'post' | 'listing'}
                    />
                ))}
            </View>
        </ScrollView>
    );
}
