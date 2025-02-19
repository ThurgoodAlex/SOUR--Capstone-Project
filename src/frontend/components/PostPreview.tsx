import { View, Text, ImageBackground, TouchableOpacity, ViewStyle } from 'react-native';
import { Styles, TextStyles } from '@/constants/Styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Post, User } from '@/constants/Types';
import ProfileThumbnail from '@/components/ProfileThumbnail';
import { router } from 'expo-router';
import ProfileThumbnailSmall from '@/components/ProfileThumbnailSmall';

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
export function PostPreview({ post, size, profileThumbnail = "none", touchable=true}: { post: Post, size: number, profileThumbnail: string, touchable?: boolean }) {
    
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

    // Styles for the post preview, including opacity if sold
    const isSold = post.isSold;
    const previewStyle = [
        Styles.column,
        { marginBottom: 10, opacity: isSold ? 0.5 : 1 },
         // Reduce opacity if sold
    ];
    const overlayStyle: ViewStyle | undefined = isSold
        ? {
              position: "absolute" as const, // Explicitly type position
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
          }
        : undefined;


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
        <View key={post.id} style={[previewStyle,  {justifyContent:"flex-start"}]}>
           
            <TouchableOpacity
                onPress={() => router.push(`/PostInfoScreen/${post.id}`)} // Navigate on press
                style={{ margin: 5 }} // Add styles for spacing
                disabled={isSold || !touchable} // Disable interaction if sold
            >
                
                <ImageBackground source={post.coverImage} style={{ height: size, width: size }}>
                    {icon}

                    {Boolean(isSold) && <View style={overlayStyle} />}
                    {Boolean(isSold) && (
                        <View style={{ position: "absolute", top: 65, left: 50 }}>
                            <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
                                SOLD
                            </Text>
                        </View>
                    )}


                  
                </ImageBackground>
               
            </TouchableOpacity>

            { profileThumbnail != "none" ? 
                (profileThumbnail === 'big' ? 
                    (<ProfileThumbnail user={seller} />)
                    : seller ? 
                        (<ProfileThumbnailSmall user={seller} />) 
                        : (<Text>No seller information available</Text>)
                )
                :  <Text style={[TextStyles.h3, { textAlign: "left" }]}>{post.title}</Text>}
       
        </View>
    );
}


    
    
               