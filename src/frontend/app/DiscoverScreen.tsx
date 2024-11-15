import { Styles } from '@/constants/Styles';
import { Link, router } from 'expo-router';
import { Button, View, Text, TouchableOpacity } from 'react-native';
import { PostPreview } from '../components/PostPreview'

export default function DiscoverScreen() {
    const dummyPosts = [
        {
            id: 1,
            preview: 'https://via.placeholder.com/200', // Replace with a real image URL
            user: 'User1',
            type: 'video',
        },
        {
            id: 2,
            preview: 'https://via.placeholder.com/200', // Replace with a real image URL
            user: 'User2',
            type: 'post',
        },
        {
            id: 3,
            preview: 'https://via.placeholder.com/200', // Replace with a real image URL
            user: 'User3',
            type: 'listing',
        },
    ];
    return (
        <View style={Styles.container}>
            {dummyPosts.map((post) => (
                <PostPreview
                    key={post.id}
                    id={post.id}
                    preview={post.preview}
                    user={post.user}
                    type={post.type as 'video' | 'post' | 'listing'}
                />
            ))}
        </View>
    );
}
