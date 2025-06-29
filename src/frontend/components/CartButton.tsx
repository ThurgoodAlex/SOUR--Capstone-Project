import { TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import { useApi } from '@/context/api';
import { useUser } from '@/context/user';
import { useState } from 'react';
import { Colors } from '@/constants/Colors';

interface CartButtonProps {
    listingID: number;
    onItemAdded: (item: any) => void;
}

const CartButton: React.FC<CartButtonProps> = ({ listingID, onItemAdded }) => {
    const api = useApi();
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [isAdded, setIsAdded] = useState(false);

    const addToCart = async () => {

        setLoading(true);

        try {
            const response = await api.post(`/users/${user?.id}/cart/`, {
                listing_id: listingID,
            });
            if (!response.ok) {
                throw new Error(`Failed to add item: ${response.statusText}`);
            }

            const data = await response.json();
            onItemAdded(data);
            setIsAdded(true);

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
                backgroundColor: isAdded ?  Colors.green  : 'transparent',
                padding: 8,
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 3,
                borderWidth: 2,
                borderColor:  Colors.green ,
            }}
            disabled={loading}
        >
            {loading ? <ActivityIndicator color={Colors.orange} /> :
                <Text style={{ color: isAdded ?  Colors.white  : Colors.green, fontWeight: 'bold' }}>
                    {isAdded ? 'Added to Cart' : 'Add to Cart'}
                </Text>
            }
        </TouchableOpacity>
    );
};

export default CartButton;
