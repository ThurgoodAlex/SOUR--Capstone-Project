import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useApi } from '@/context/api';
import { useUser } from '@/context/user';
import { CartButtonProps } from '@/constants/Types';



const CartButton: React.FC<CartButtonProps> = ({ listingID }) => {
    const navigation = useNavigation();
    const api = useApi();
    const user = useUser();

    const addToCart = async () => {
        
        try {
            const response = await api.post(`/${user.user?.id}/cart/`, { listing_id: listingID });
    
            if (!response.ok) {
                throw new Error(`Failed to add item: ${response.statusText}`);
            }
            const data = await response.json();
            console.log('Item added to cart:', data);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    return (
        <button onClick={addToCart}>
            Add to Cart
        </button>
    );
};

export default CartButton;
