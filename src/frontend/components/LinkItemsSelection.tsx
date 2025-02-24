import { TouchableOpacity, View } from 'react-native';
import { PostPreview } from '@/components/PostPreview';
import { LinkPreview } from '@/components/LinkPreview';
import { Styles } from '@/constants/Styles';
import { Colors } from '@/constants/Colors';
import { Post } from '@/constants/Types';
import React, { useEffect, useState } from 'react';



export function LinkedItemsSelection({ posts, previouslySelected, columns, setter }: { posts: Post[], previouslySelected: Post[], columns: number, setter: React.Dispatch<React.SetStateAction<Post[]>> }) {
    const [selectedPosts, setSelectedPosts] = useState<Set<number>>(new Set());
    

    useEffect(() => {
        if (previouslySelected) {
            setSelectedPosts(new Set(previouslySelected.map(post => post.id)));
        }
    }, [previouslySelected]);
    
    const toggleSelection = (postId: number) => {
        setSelectedPosts(prev => {
            const newSelection = new Set(prev);
            if (newSelection.has(postId)) {
                newSelection.delete(postId);
            } else {
                newSelection.add(postId);
            }
            setter(posts.filter(post => newSelection.has(post.id)));
            return newSelection;
        });
    };

    return (
        <View style={[Styles.row, { flexWrap: 'wrap', justifyContent: 'flex-start', marginBottom:20 }]}>
            {posts.map((item) => {
                const isSelected = selectedPosts.has(item.id);
                return (
                    <TouchableOpacity 
                        key={item.id.toString()} 
                        style={{
                            width: `${97 / columns}%`,
                            backgroundColor: isSelected ? Colors.light : 'transparent',
                            paddingLeft:4,
                            paddingRight:4,
                            marginLeft:1.5,
                            marginRight:1.5,
                            marginTop:2,
                            borderRadius: 8,

                        }}
                        onPress={() => toggleSelection(item.id)}
                    >
                        {columns === 1 ? (
                            <LinkPreview listing={item} touchable={false}/>
                        ) : (
                            <PostPreview post={item} size={95} profileThumbnail="none" touchable={false}/>
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
