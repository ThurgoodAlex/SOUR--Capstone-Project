import { View, StyleSheet } from 'react-native';
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
    const itemsPerRow = columns;
    
    return (
        <View style={styles.container}>
            // List view - display each item in a single column
            {columns === 1 ? (
                posts.map((item) => (
                    <View key={item.id.toString()} style={styles.listItemContainer}>
                        <LinkPreview listing={item} />
                    </View>
                ))
            ) : (
                // Grid view
                Array.from({ length: Math.ceil(posts.length / itemsPerRow) }, (_, rowIndex) => {
                    const rowItems = posts.slice(rowIndex * itemsPerRow, (rowIndex + 1) * itemsPerRow);
                    return (
                        <View key={rowIndex} style={styles.row}>
                            {rowItems.map((item) => (
                                <View 
                                    key={item.id.toString()} 
                                    style={[styles.gridItem, { width: `${100 / itemsPerRow}%` }]}
                                >
                                    <PostPreview post={item} size={110} profileThumbnail={"none"} />
                                </View>
                            ))}
                        </View>
                    );
                })
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    listItemContainer: {
        marginBottom: 5,
    },
    row: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 2,
    },
    gridItem: {
        paddingHorizontal: 2,
    }
});