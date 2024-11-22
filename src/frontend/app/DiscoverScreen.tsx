import { Styles } from '@/constants/Styles';
import { View } from 'react-native';
import { PostPreview } from '@/components/PostPreview';
import { NavBar } from '@/components/NavBar';
import PhotoCarousel from '@/components/PhotoCarousel';
import { FlatList } from 'react-native';

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
      size={175}
    />
  );

  return (
    <>
      <FlatList
        ListHeaderComponent={<PhotoCarousel />} // Carousel at the top
        data={dummyPosts} // Data for FlatList
        keyExtractor={(item) => item.id.toString()} // Unique key for each item
        renderItem={renderPost} // Function to render each item
        numColumns={2} // Grid layout with 2 columns
        columnWrapperStyle={Styles.gridContainer} // Style for the row container
        showsVerticalScrollIndicator={false} // Hide vertical scroll indicator
        contentContainerStyle={{ paddingBottom: 80 }} // Space for NavBar
      />
      <NavBar />
    </>
  );
}
