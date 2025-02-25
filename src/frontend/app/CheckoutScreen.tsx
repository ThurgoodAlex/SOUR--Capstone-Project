import { StripeProvider } from '@stripe/stripe-react-native';
import { Text, View } from 'react-native';
import CheckoutForm from '@/components/CheckoutForm';
import { useSearchParams } from 'expo-router/build/hooks';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { Colors } from '@/constants/Colors';
import { useApi } from '@/context/api';
import { useEffect, useState } from 'react';

export default function CheckoutScreen() {
    const api = useApi();
    const searchParams = useSearchParams();
    const item = searchParams.get('item');
    console.log("Item:", item);

    if (!item) {
        return <Text>No item selected</Text>;
    }

    const post = JSON.parse(item);

    const [seller, setSeller] = useState<any>(null);

    const fetchSeller = async (sellerId: string) => {
        try {
            const sellerResponse = await api.get(`/users/${sellerId}/`);
            const sellerData = await sellerResponse.json();
            if (sellerResponse.ok) {
                setSeller({
                    firstname: sellerData.firstname,
                    lastname: sellerData.lastname,
                    username: sellerData.username,
                    bio: sellerData.bio,
                    profilePicture: sellerData.profilePicture,
                    isSeller: sellerData.isSeller,
                    email: sellerData.email,
                    id: sellerData.id,
                });
            } else {
                console.error(`Failed to fetch seller with id ${sellerId}`);
            }
        } catch (error) {
            console.error(`Error fetching seller with id ${sellerId}:`, error);
        }
    };

    useEffect(() => {
        if (post.sellerID) {
            fetchSeller(post.sellerID);
        }
    }, [post.sellerID]);

    return (
        <View style={ScreenStyles.screen}>
            <View style={Styles.column}>
                {seller && (
                    <Text style={[TextStyles.h2, { textAlign: 'left', marginBottom: 20 }]}>
                        Complete Payment to {seller.firstname} {seller.lastname}
                    </Text>
                )}

                <View
                    style={{
                        backgroundColor: Colors.light60,
                        padding: 10,
                        borderRadius: 10,
                        marginBottom: 20,
                    }}
                >
                    <Text style={[TextStyles.h2]}>{post.title}</Text>

                    <Text
                        style={[TextStyles.h3, { textAlign: 'left', marginBottom: -2 }]}
                    >
                        Size: {post.size}
                    </Text>
                    <Text style={[TextStyles.p, { textAlign: 'left' }]}>
                        {[post.brand, post.gender, post.condition]
                            .filter(Boolean)
                            .join('  |  ')}
                    </Text>
                </View>

    

                <Text
                    style={[
                        TextStyles.h1,
                        { textAlign: 'center', color: 'green', marginTop: 10 },
                    ]}
                >
                    Subtotal:{' '}
                    {Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                    }).format(parseFloat(post.price))}
                </Text>
            </View>

            <StripeProvider
                publishableKey="pk_test_51Qw5QM08yxMUUHDI26yhD2zYs8SRe7a5lCHDJV7MBQ9ltf48CN5dk4YX3wRfR1XWp25smAVLWs68eqfthLx9IECK00SrFO2r5d"
            >
                <CheckoutForm total={parseFloat(post.price)*100} postID={post.id} cartItemID={post.cartItemId}/>
            </StripeProvider>
        </View>
    );
}
