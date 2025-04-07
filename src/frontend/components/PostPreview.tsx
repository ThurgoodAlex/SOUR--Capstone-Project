import { View, Text, ImageBackground, TouchableOpacity, ViewStyle } from 'react-native';
import { Styles, TextStyles } from '@/constants/Styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Post, User } from '@/constants/Types';
import ProfileThumbnail from '@/components/ProfileThumbnail';
import { router } from 'expo-router';
import ProfileThumbnailSmall from '@/components/ProfileThumbnailSmall';
import { Colors } from '@/constants/Colors';
import { useGetMedia } from '@/hooks/useGetMedia';

/**
 * @param post - Props object containing the post details.
 * @param size - The size of the post view.
 * @param profileThumbnail - 3 Accepted options
 *  - 'none' - No profile thumbnail, show title instead
 *  - 'small' - username only
 *  - 'big' - username, firstname, lastname
 * 
 * @returns A post view component.
 */
export function PostPreview({ post, size, profileThumbnail = "none", touchable = true }: { post: Post, size: number, profileThumbnail: string, touchable?: boolean }) {
    const { images, loading: mediaLoading, error: mediaError } = useGetMedia(Number(post.id));
    console.log("RENDERING POST", post)
    // Fallback to placeholder image if cover image is null
    let coverImage = post.coverImage;

    if (coverImage == null || coverImage === '') {
        coverImage = (images && images.length > 0 ? images[0].url : require('../assets/images/placeholder.png'));
    }

    if (mediaError) {
        console.log('Error loading media:', mediaError);
    }

    let icon;
    let type = post.isListing ? 'listing' : 'post';

    if (post.isVideo){
        icon = <Ionicons size={25} style={{ color: Colors.dark, opacity: 0.7, margin: 5 }} name='videocam' />;
    }
    else if (type === 'post') {
        icon = <Ionicons size={25} style={{ color: Colors.dark, opacity: 0.7, margin: 5 }} name='megaphone' />;
    }
    else if (type === 'listing') {
        icon = <Ionicons size={25} style={{ color: Colors.dark, opacity: 0.7, margin: 5 }} name='pricetag' />;
    }

    const isSold = post.isSold;
    const previewStyle = [
        Styles.column,
        { marginBottom: 10, opacity: isSold ? 0.5 : 1 },
    ];
    const overlayStyle: ViewStyle | undefined = isSold
        ? {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
        }
        : undefined;

    const seller: User | null = post.seller
      ? {
          firstname: post.seller.firstname,
          lastname: post.seller.lastname,
          username: post.seller.username,
          bio: post.seller.bio,
          email: post.seller.email,
          profilePic: post.seller.profilePic,
          isSeller: post.seller.isSeller,
          id: post.seller.id,
        }
      : null;
    return (
        <View key={post.id} style={[previewStyle, { justifyContent: 'flex-start' }]}>
            <TouchableOpacity
                onPress={() => {
                    if (post.isVideo){
                        router.push({
                            pathname: '/VideosScreen',
                            params: { video: JSON.stringify(post) },
                        })
                    }
                    else{
                        router.push(`/PostInfoScreen/${post.id}`)
                    }
                }}
                style={{ margin: 5 }}
                disabled={!touchable}
            >
                <ImageBackground
                    source={typeof coverImage === 'string' ? { uri: coverImage } : require('../assets/images/placeholder.png')}
                    style={{ height: size, width: size }}
                >
                    {icon}
                    {Boolean(isSold) && <View style={overlayStyle} />}
                    {Boolean(isSold) && (
                        <View style={{ position: 'absolute', top: 65, left: 50 }}>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>SOLD</Text>
                        </View>
                    )}
                </ImageBackground>
          </TouchableOpacity>
          {profileThumbnail !== 'none' ? (
            seller ? (
              console.log('Seller:', seller),
              profileThumbnail === 'big' ? (
                <ProfileThumbnail user={seller} />
              ) : (
                <ProfileThumbnailSmall user={seller} />
              )
            ) : (
              <Text>No seller information available</Text>
            )
          ) : (
            <Text style={[TextStyles.h3, { textAlign: 'left' }]}>{post.title}</Text>
          )}
      </View>
    )
}
