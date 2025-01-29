import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { Styles } from '@/constants/Styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Post, User } from '@/constants/Types';
import ProfileThumbnail from '@/components/ProfileThumbnail';
import { router } from 'expo-router';
import ProfileThumbnailSmall from '@/components/ProfileThumbnailSmall';
import { useUser } from '@/context/user';

/**
 * The visualization of how a campus post looks like.
 * @param post - Props object containing the post details.
 * @returns A post view component.
 */
export function PostPreview({ post, size, thumbnailSize }: { post: Post, size: number, thumbnailSize: string }) {
    

    let icon;
    let type = post.isListing ? "listing" : "post";

    // if (type === 'listing') {
    //     icon = <Ionicons size={20} name='videocam' />
    // }
    if (type === 'post') {
        icon = <Ionicons size={20} name='megaphone' />
    }
    else if (type === 'listing') {
        icon = <Ionicons size={20} name='pricetag' />
    }


    //extract seller information into a User object
    const seller: User = {
        firstname: post.seller.firstname,
        lastname: post.seller.lastname,
        username: post.seller.username,
        bio: post.seller.bio,
        email: post.seller.email,
        profilePic: post.seller.profilePic,
        isSeller: post.seller.isSeller,
        id: post.seller.id,
    }; 

    return (
        <View key={post.id} style={[Styles.column, { marginBottom: 1 }]}>
            <TouchableOpacity
                onPress={() => router.push(`/ListingInfoScreen/${post.id}`)} // Navigate on press
                style={{ flex: 1, margin: 5 }} // Add styles for spacing
            >
                <ImageBackground source={post.coverImage} style={{ height: size, width: size }}>
                    {icon}
                </ImageBackground>
                

            </TouchableOpacity>
            
                {thumbnailSize === 'big' ? (<ProfileThumbnail user={seller} />)
                    : seller ? (<ProfileThumbnailSmall user={seller} />) : (<Text>No seller information available</Text>)
                }
        
        </View>

    );

}