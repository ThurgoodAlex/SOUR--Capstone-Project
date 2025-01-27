import React, { useEffect, useState } from 'react';
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
                const response = await api.get(`/posts/${id}`);
                const data = await response.json();
                const userResponse = await api.get(`/users/${data.sellerID}/`);
                const userData = await userResponse.json();

                // Transform the data
                const transformedPost: Post = {
                    id: data.id,
                    createdDate: data.created_at,
                    seller: {
                        id: userData.seller_id,
                        firstname: userData.firstname,
                        lastname: userData.lastname,
                        username: userData.username,
                        profilePic: userData.profilePic,
                        email: userData.email,
                        isSeller: userData.isSeller,
                        bio: userData.bio
                    },
                    title: data.title,
                    description: data.description,
                    brand: data.brand,
                    condition: data.condition,
                    size: "Medium", // Set default size
                    gender: data.gender,
                    coverImage: data.coverImage,
                    price: data.price,
                    isSold: data.isSold,
                    isListing: data.isListing
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
                        <PostInfo Post={post} />
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
function PostInfo({ Post }: { Post: Post }) {
    return (
        <View style={[Styles.row, { justifyContent: 'space-between', flexWrap: 'wrap' }]}>
            <Text style={[TextStyles.h1, TextStyles.uppercase]}>{Post.title}</Text>
            <Text style={TextStyles.h2}>{Post.price}</Text>
            <Text style={TextStyles.h3}>Size: {Post.size}</Text>
            <Text style={TextStyles.p}>{Post.description}</Text>
        </View>
    );
}
