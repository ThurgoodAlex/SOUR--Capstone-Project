import { View, ScrollView} from 'react-native';
import { Styles } from '@/constants/Styles';
import { PostPreview } from './PostPreview';

export default function PostCarousel() {
    
    const dummyPosts = [
        {
            id: 1,
            data: require('../assets/images/video.png'),
            title: "a video",
            user: {name: "Dummy Data Name 1", username: "dummyuser1", id:1},
            type: 'video',
        },
        {
            id: 2,
            data: require('../assets/images/post.png'),
            title: "a post",
            user: {name: "Dummy Data Name 2", username: "dummyuser2", id:2},
            type: 'post',
        },
        {
            id: 3,
            data: require('../assets/images/sweater1.png'),
            title: "a listing",
            user: {name: "Dummy Data Name 3", username: "dummyuser3", id:3},
            type: 'listing',
        },
        {
            id: 4,
            data: require('../assets/images/listing2.png'),
            title: "a listing",
            user: {name: "Dummy Data Name 4", username: "dummyuser4", id:4},
            type: 'listing',
        },
    ];

      return (
        <View style={[Styles.row, {marginBottom:18}]}>
            <ScrollView horizontal={true} >
                {dummyPosts.map((post) => (
                    <View style={Styles.column}>
                        <PostPreview
                            key={post.id}
                            post={post}
                            size={350}
                            thumbnailSize='big'
                        />
                       
                    </View>
                ))}
            </ScrollView>
        </View>
      );

}