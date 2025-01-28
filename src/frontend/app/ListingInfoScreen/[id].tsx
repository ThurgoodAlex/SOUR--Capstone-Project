import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, ScrollView } from 'react-native';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import ProfileThumbnail from '@/components/ProfileThumbnail';
import PhotoCarousel from '@/components/PhotoCarousel';
import { NavBar } from '@/components/NavBar';
import { router, useLocalSearchParams } from 'expo-router';
import { useUser } from '@/context/user';
import { useAuth } from '@/context/auth';
import { useApi } from '@/context/api';
import { Post, User } from '@/constants/Types';
import { Ionicons } from '@expo/vector-icons';

export default function PostInfoScreen() {
    const {user} = useUser(); // Fetch user details
    const api = useApi();

    const [liked, setLike] = useState(false);
    const [post, setPost] = useState<Post | null>(null);


    const { id } = useLocalSearchParams(); // Get the dynamic `id` from the route
    const images = ["sweater1.png", "sweater2.png", "sweater3.png", "sweater4.png"]


    useEffect(() => {
        // Fetch the Post based on the dynamic id
        const fetchPost = async () => {
            try {
                const response = await api.get(`/posts/${id}/`);
                const result = await response.json();

                const sellerResponse = await api.get(`/users/${result.sellerID}/`);
                const sellerData = await sellerResponse.json();

                // Transform the data
                const transformedPost: Post = {
                    id: result.id,
                    createdDate: result.created_at,
                    seller: {
                        id: sellerData.seller_id,
                        firstname: sellerData.firstname,
                        lastname: sellerData.lastname,
                        username: sellerData.username,
                        profilePic: sellerData.profilePic,
                        email: sellerData.email,
                        isSeller: sellerData.isSeller,
                        bio: sellerData.bio
                    },
                    title: result.title,
                    description: result.description,
                    brand: result.brand,
                    condition: result.condition,
                    size: "Medium", // Set default size
                    gender: result.gender,
                    coverImage: result.coverImage,
                    price: result.price,
                    isSold: result.isSold,
                    isListing: result.isListing
                };

                setPost(transformedPost); // Set the transformed data

            } catch (error) {
                console.error('Error fetching Post:', error);
            }
        };

        const fetchLike = async () => {
            const response = await api.get(`/posts/${post?.id}/like/`);
            const data = await response.json();
            setLike(data)
        }

        if (id) {
            fetchPost(); // Fetch data when 'id' is available
            fetchLike();
        }
    }, [id]);



    if (post) {
        //extract seller information into a User object
        const seller: User = post.seller;
        return (
            <>
                <View style={ScreenStyles.screen}>
                    <ScrollView contentContainerStyle={{ gap: 6 }}>
                        <PhotoCarousel />
                        <View style={[Styles.row, {justifyContent:'space-between'}]}>
                            <ProfileThumbnail user={seller} />
                            {liked ? (
                                <Ionicons size={20} name='heart' />
                            ) : (
                                <Ionicons size={20} name='heart-outline' />
                            )}
                        </View>
                        <PostInfo post={post} />
                    </ScrollView>
                </View>
                <NavBar />
            </>
        );
    }

    else {
        return (
            <>
                <View style={ScreenStyles.screen}>
                    <Text>Post information not available.</Text>
                </View>
                <NavBar />
            </>
        );
    }

}

// Component to display Post details
function PostInfo({ post }: { post: Post }) {

    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(parseFloat(post.price));

    return (
        <View style={Styles.column}>
            <View style={[Styles.row, {justifyContent:'space-between'}]}>
                <Text style={[TextStyles.h1, TextStyles.uppercase]}>{post.title}</Text>
                <Text style={[TextStyles.h2, {textAlign:'right'}]}>{formattedPrice}</Text>
            </View>
            <Text style={[TextStyles.h3, {textAlign:'left'}]}>Size: {post.size}</Text>
            <Text style={TextStyles.p}>{post.description}</Text>
        </View>
    );
}
