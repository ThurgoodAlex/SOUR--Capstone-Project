import { useEffect, useState } from 'react';
import  { getCart } from "@/components/GetCart";
import { Post } from '@/constants/Types';

export default function CartPage(){
    const [cart, setCart] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCart = async () => {
            const cartData = await getCart();
            if (cartData) {
                setCart(cartData);
            }
            setLoading(false);
        };
        fetchCart();

    }, []);

}