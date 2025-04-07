import { View } from 'react-native';
import { PostPreview } from '@/components/PostPreview';
import { LinkPreview } from '@/components/LinkPreview';
import { Styles } from '@/constants/Styles';
import { Post } from '@/constants/Types';

/**
 * Displays Linked Items for a certain post or listing
 * @param posts the linked posts to display
 * @param columns the number of columns (1 if list of linked listings, 3 if a grid of all types of posts)
 */

export function LinkedItems ({ posts, columns }: { posts: Post[], columns: number }){
    return (
        <View style={[Styles.row, { flexWrap: 'wrap', justifyContent: 'flex-start' }]}>
            {posts.map((item, index) => (
            <View key={item.id.toString()} style={{ width: `${(100 / columns) -2}%` }}>
                {columns === 1 ? (
                <LinkPreview listing={item} />
                ) : (
                <PostPreview post={item} size={110} profileThumbnail={"none"} />
                )}
            </View>
            ))}
        </View>
    );
};
