import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { ActivityIndicator, View } from 'react-native';
import { PostPreview } from '@/components/PostPreview';
import { NavBar } from '@/components/NavBar';
import { FlatList, Text } from 'react-native';
import PostCarousel from '@/components/PostCarousel';
import { Post } from '@/constants/Types';
import { usePosts } from '@/hooks/usePosts';
import { useRef, useState } from 'react';
import { Colors } from '@/constants/Colors';


export default function DiscoverScreen() {

    const { posts, loading, error } = usePosts('/posts/?is_sold=false');

    const [isAnyLoading, setIsAnyLoading] = useState<boolean>(false);
    const loadingRefs = useRef<Set<string>>(new Set());

    const handleLoadingChange = (id: string, isLoading: boolean) => {
        if (isLoading) {
        loadingRefs.current.add(id);
        } else {
        loadingRefs.current.delete(id);
        }
        setIsAnyLoading(loadingRefs.current.size > 0);
    };


    const renderPost = ({ item }: { item: Post }) => (
        <PostPreview post={item} size={160} profileThumbnail='small' />
    );

    return (
        <>
            <View style={ScreenStyles.screen}>
                 {isAnyLoading ? (
                                <ActivityIndicator size="large" color={Colors.orange} />
                            ) : (
                <FlatList
                    ListHeaderComponent={
                        <>
                            <Text style={[TextStyles.h2, TextStyles.uppercase]} >What's New Today?</Text>
                            <PostCarousel />
                            <Text style={[TextStyles.h2, TextStyles.uppercase]} >You Might Like</Text>
                        </>
                    } // Carousel at the top
                    data={posts} // Data for FlatList
                    keyExtractor={(item) => item.id.toString()} // Unique key for each item
                    renderItem={renderPost} // Function to render each item
                    numColumns={2} // Grid layout with 2 columns
                    columnWrapperStyle={Styles.grid} // Style for the row container
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={<Text style={[TextStyles.p, { textAlign: 'center' }, { color: "#888" }, { fontStyle: "italic" }]}>You're all caught up!</Text>}
                />
            )}
            </View>
            
            <NavBar />
        </>

    );
}
