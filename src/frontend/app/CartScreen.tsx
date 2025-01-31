import { useEffect, useState } from 'react';
import  { getCart } from "@/components/GetCart";
import { Post } from '@/constants/Types';
import { CartItem } from '@/components/CartItem';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { cartPageStyle } from '@/constants/Styles'
import { Text } from 'react-native';

export default function CartScreen(){
    const [cart, setCart] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    console.log("fetching cart")
    useEffect(() => {
      console.log("useEffect called");
      const fetchCart = async () => {
          console.log("fetchCart function called");
          setLoading(true);
          const cartData = await getCart();
          if (cartData) {
              console.log("Cart data fetched:", cartData);
              setCart(cartData);
          }
          setLoading(false);
      };
      fetchCart();
  }, []);
  console.log("afer useEffect");
    if (loading) {
        return (
          console.log("loading cart"),
          <View style={cartPageStyle.loaderContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
      }
    
      if (cart.length === 0) {
        return (
          console.log("empty cart"),
          <View style={cartPageStyle.emptyContainer}>
            <Text style={cartPageStyle.emptyText}>Your cart is empty!</Text>
          </View>
        );
      }
    
      return (
        <View style={cartPageStyle.container}>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <CartItem item={item} />}
            contentContainerStyle={cartPageStyle.list}
          />
        </View>
      );
}



