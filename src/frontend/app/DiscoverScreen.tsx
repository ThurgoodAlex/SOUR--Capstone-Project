import { Styles } from '@/constants/Styles';
import { PostPreview } from '@/components/PostPreview';
import { NavBar } from '@/components/NavBar';
import PhotoCarousel from '@/components/PhotoCarousel';
import { FlatList, View } from 'react-native';
import { Stack } from 'expo-router';

type Post = {
    id: number;
    // data: TexImageSource;
    data: string;
    user: string;
    type: string;
};

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

    const renderPost = ({ item }: { item: Post }) => (
        <PostPreview
            post={item}
            size={175}
        />
    );

    return (
        <>
            <Stack.Screen
                options={{ title: 'DiscoverScreen' }}
            />
            <View style={Styles.container}>
                <FlatList
                    ListHeaderComponent={<PhotoCarousel />}
                    data={dummyPosts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderPost}
                    numColumns={2}
                    columnWrapperStyle={Styles.gridContainer}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 80 }}
                />
            </View>
            <NavBar />
        </>
    );
}
