import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, ScrollView, ViewStyle, ImageBackground, TextComponent } from 'react-native';
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
import { GridPosts } from '@/components/GridPosts';
import { PostPreview } from '@/components/PostPreview';

export default function PostInfoScreen() {
    const {user} = useUser(); // Fetch user details
    const api = useApi();

    const [liked, setLike] = useState(false);
    const [post, setPost] = useState<Post | null>(null);
    const [seller, setSeller] = useState<User | null>(null);
    const [linkedItems, setLinkedItems] = useState<Post[]>([]);

    const { id } = useLocalSearchParams(); // Get the dynamic `id` from the route
    const images = ["sweater1.png", "sweater2.png", "sweater3.png", "sweater4.png"]


    // Fetch the Post based on the dynamic id
    const fetchPost = async () => {
        try {
            const response = await api.get(`/posts/${id}/`);
            const result = await response.json();

            const sellerResponse = await api.get(`/users/${result.sellerID}/`);
            const sellerData = await sellerResponse.json();

            const seller : User = {
                id: sellerData.seller_id,
                firstname: sellerData.firstname,
                lastname: sellerData.lastname,
                username: sellerData.username,
                profilePic: sellerData.profilePic,
                email: sellerData.email,
                isSeller: sellerData.isSeller,
                bio: sellerData.bio
            }
            setSeller(seller);

            // Transform the data
            if (seller) {
                const transformedPost: Post = {
                    id: result.id,
                    createdDate: result.created_at,
                    seller: seller,
                    title: result.title,
                    description: result.description,
                    brand: result.brand,
                    condition: result.condition,
                    size: "n/a", // Set default size
                    gender: result.gender,
                    coverImage: result.coverImage,
                    price: result.price,
                    isSold: result.isSold,
                    isListing: result.isListing
                };

                setPost(transformedPost); // Set the transformed data
            } else {
                console.error('Seller information is not available.');
            }

        } catch (error) {
            console.error('Error fetching Post:', error);
        }
    };

    const dummyImages = [
        require('../../assets/images/video.png'),
        require('../../assets/images/post.png'),
        require('../../assets/images/sweater1.png'),
        require('../../assets/images/listing2.png'),
        require('../../assets/images/listing.png'),
        require('../../assets/images/random1.png'),
        require('../../assets/images/random2.png'),
        require('../../assets/images/random3.png'),
        require('../../assets/images/random4.png'),
        require('../../assets/images/random5.png'),
        ];



    const fetchLinkedPosts = async () => {
        try {
            const response = await api.get(`/posts/${id}/links/`);
            const result = await response.json();

            console.log("Linked Listings", result)

            if(seller){
                const getRandomImage = () =>
                    dummyImages[Math.floor(Math.random() * dummyImages.length)];


                const transformedPosts: Post[] = await Promise.all(
                    result.map(async (item: any) => {
                        
                        return {
                            id: item.id,
                            createdDate: item.created_at || new Date().toISOString(),
                            coverImage: getRandomImage(),
                            title: item.title,
                            description: item.description,
                            brand: item.brand,
                            condition: item.condition,
                            size: item.size,
                            gender: item.gender,
                            price: item.price,
                            isSold: item.isSold,
                            isListing: item.isListing,
                            seller:seller,
                        };
                    })
                    );
                    
                setLinkedItems(transformedPosts); // Set the transformed data
            }
            else {
                console.error('Seller information is not available.');
            }

        } catch (error) {
            console.error('Error fetching Linked Items:', error);
        }
    };

    
       
 
    useEffect(() => {
        fetchPost();  // Fetch post first
    }, [id]); // Only runs when `id` changes
    
    useEffect(() => {
        if (seller) {
            fetchLinkedPosts(); // Only fetch linked posts after seller is set
        }
    }, [seller]); // Runs only when `seller` is updated
    

    if (post) {
        const fetchLike = async () => {
            const response = await api.get(`/posts/${post.id}/like/`);
            const data = await response.json();
            setLike(data)
        }

        fetchLike();
        
        const toggleLike = async () => {
            try {
                if (liked) {
                    await api.remove(`/posts/${post.id}/unlike/`,{});
                } else {
                    await api.post(`/posts/${post.id}/like/`);
                }
                setLike(!liked); // Update local state
            } catch (error) {
                console.error('Error toggling like:', error);
            }
        };

        
        return (
            <>
                <View style={ScreenStyles.screen}>
                    <ScrollView contentContainerStyle={{ gap: 6 }}>
                        <PhotoCarousel />
                        <View style={[Styles.row, { justifyContent: 'space-between' }]}>
                            <ProfileThumbnail user={post.seller} />
                            <TouchableOpacity onPress={toggleLike}>
                                {liked ? (
                                    <Ionicons size={20} name='heart' color='red' />
                                ) : (
                                    <Ionicons size={20} name='heart-outline' color='gray' />
                                )}
                            </TouchableOpacity>
                        </View>
                        {post.isListing ? (<ListingInfo post={post} />): <PostInfo post={post} />  }
                        {linkedItems.length > 0 ? <LinkedItems links={linkedItems} originalPost={post}/>: null}
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
function ListingInfo({ post }: { post: Post }) {

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
            {post.size != "n/a" ? (<Text style={[TextStyles.h3, {textAlign:'left'}]}>Size: {post.size}</Text>) : null }
            <Text style={TextStyles.p}>{post.description}</Text>
        </View>
    );
}

function PostInfo({ post }: { post: Post }) {

    return (
        <View style={Styles.column}>
            <View style={[Styles.row, {justifyContent:'space-between'}]}>
                <Text style={[TextStyles.h1, TextStyles.uppercase]}>{post.title}</Text>
            </View>
            <Text style={TextStyles.p}>{post.description}</Text>
        </View>
    );
}



function LinkedItems({ links, originalPost }: { links: Post[], originalPost: Post }) {
    const renderLink = ({ item }: { item: Post }) => (
        <LinkPreview listing={item} />
    );
    const renderPost = ({ item }: { item: Post }) => (
        <PostPreview post={item} size={110} profileThumbnail='none'/>
    );

    return (
        <>
            <Text style={[TextStyles.h2, TextStyles.uppercase]}>
                {originalPost.isListing ? "Posts" : "Featured Listings"}
            </Text>

            <View> 
                <FlatList
                    data={links}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={originalPost.isListing ? renderPost : renderLink}
                    numColumns={originalPost.isListing ? 3 : 1} 
                    columnWrapperStyle={originalPost.isListing ? Styles.grid : undefined}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={false}
                />
            </View>
        </>
    );
}


function LinkPreview({ listing }: { listing: Post }) {

    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(parseFloat(listing.price));

    return (
        <View key={listing.id} style={{ opacity: listing.isSold ? 0.5 : 1 }}> 
            <TouchableOpacity
                onPress={() => router.push(`/PostInfoScreen/${listing.id}`)}
                style={{ flex: 1, margin: 5 }}
                disabled={listing.isSold} 
            >
                <View style={[Styles.row, {gap:6}]}>
                    <ImageBackground source={listing.coverImage} style={[ {height: 70}, {width: 70} ]} />

                    <View style={[Styles.row, { justifyContent: "space-between" }]}>
                    
                        <Text style={[TextStyles.h2, { textAlign: "left" }]}>{listing.title}</Text>
                        {!(listing.size && listing.size != "n/a")? <Text>{listing.size}</Text>: null}

                        <View style={[Styles.column, {alignItems: "flex-end"}]}>
                            <Text style={TextStyles.h3}>{formattedPrice}</Text>
                            {!(listing.isSold)? <Text style={{color:"#008000"}}>Still Available</Text>: <Text>Sold</Text>}
                        </View>
                    
                    </View>
                </View>
               
            </TouchableOpacity>
        </View>
    );
}
