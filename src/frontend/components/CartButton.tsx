import { TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import { useApi } from '@/context/api';
import { useUser } from '@/context/user';
import { useState } from 'react';

export default function CartButton({listingID} : {listingID: number}) {
    const api = useApi();
    const { user } = useUser();
    const [loading, setLoading] = useState(false);

    const addToCart = async () => {
        if (!user || !user.id) {
            Alert.alert('Error', 'You must be logged in to add items to the cart.');
            return;
        }

        setLoading(true);

        try {
            console.log("Adding to cart:", listingID);
            const response = await api.post(`/users/${user.id}/cart/`, {
                listing_id: listingID,
            });
            if (!response.ok) {
                throw new Error(`Failed to add item: ${response.statusText}`);
            }

            const data = await response.json();
            Alert.alert('Success', 'Item added to cart!');
            console.log('Item added to cart:', data);

        } catch (error) {
            console.error('Error adding to cart:', error);
            Alert.alert('Error', 'Failed to add item to cart.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableOpacity
            onPress={addToCart}
            style={{
                backgroundColor: '#7e9151',
                padding: 10,
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
            }}
            disabled={loading}
        >
            {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white' }}>Add to Cart</Text>}
        </TouchableOpacity>
    );
};
