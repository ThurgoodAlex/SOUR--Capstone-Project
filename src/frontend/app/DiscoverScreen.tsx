import { Styles } from '@/constants/Styles';
import { Link, router } from 'expo-router';
import { Button, View, Text, ScrollView, TouchableOpacity, } from 'react-native';
import { PostPreview } from '@/components/PostPreview'
import { GridPosts } from '@/components/GridPosts';
import { Post } from '@/constants/Types';

export default function DiscoverScreen() {


    const dummyPosts: Post[] = [
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
        }
    ];
    return (
        <>
            <GridPosts posts={dummyPosts}/>
            <TouchableOpacity
            style={Styles.buttonDark}
            onPress={() => router.push('/ProfileScreen')}
            >
                <Text style={Styles.buttonTextLight}>Profile</Text>
            </TouchableOpacity>
        </>
        

    );
}
