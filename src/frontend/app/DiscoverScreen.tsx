import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { ImageSourcePropType, View } from 'react-native';
import { PostPreview } from '@/components/PostPreview';
import { NavBar } from '@/components/NavBar';
import { FlatList, Text } from 'react-native';
import PostCarousel from '@/components/PostCarousel';
import { Post } from '@/constants/Types';

export default function DiscoverScreen() {

    const dummyPosts = [
        {
            id: 1,
            data: require('../assets/images/video.png'),
            user: 'Princess Peach',
            type: 'video',
        },
        {
            id: 2,
            data: require('../assets/images/post.png'),
            user: 'Mario',
            type: 'post',
        },
        {
            id: 3,
            data: require('../assets/images/sweater1.png'),
            user: 'Bowser',
            type: 'listing',
        },
        {
            id: 4,
            data: require('../assets/images/listing.png'),
            user: 'Princess Daisy',
            type: 'listing',
        },
    ];

  const renderPost = ({ item }: {item: Post}) => (
    <PostPreview
      post={item}
      size={160}
    />
  );

  return (
    <>
    <View style={ScreenStyles.screen}>
      <FlatList
        ListHeaderComponent={
          <>
          <Text style={[TextStyles.h2, TextStyles.uppercase]} >What's New Today?</Text>
          <PostCarousel />
          <Text style={[TextStyles.h2, TextStyles.uppercase]} >You Might Like</Text>
          </>
        } // Carousel at the top
        data={dummyPosts} // Data for FlatList
        keyExtractor={(item) => item.id.toString()} // Unique key for each item
        renderItem={renderPost} // Function to render each item
        numColumns={2} // Grid layout with 2 columns
        columnWrapperStyle={Styles.grid} // Style for the row container
        showsVerticalScrollIndicator={false}
      />
      <NavBar />
    </View>
    </>
    
  );
}
