import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { View } from 'react-native';
import { PostPreview } from '@/components/PostPreview';
import { NavBar } from '@/components/NavBar';
import PhotoCarousel from '@/components/PhotoCarousel';
import { FlatList, Text } from 'react-native';
import PostCarousel from '@/components/PostCarousel';

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
        showsVerticalScrollIndicator={false} // Hide vertical scroll indicator
      />
     
    </View>
    <NavBar />
    </>
    
  );
}
