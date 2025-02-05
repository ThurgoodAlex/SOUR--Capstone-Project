import { useEffect, useState } from "react";
import { getCart } from "@/components/GetCart";
import { useUser } from "@/context/user";
import { StyleSheet } from "react-native";
import { useApi } from "@/context/api";
import { ActivityIndicator, FlatList, View, Text, Alert } from "react-native";
import { CartItemProps } from "@/constants/Types";
import { Post } from "@/constants/Types";
import { CartItem } from "@/components/CartItem";
import { router } from "expo-router";


export default function CartScreen() {
    const [cart, setCart] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    const api = useApi();

    useEffect(() => {
        const fetchCart = async () => {
            console.log("fetchCart function called");
            setLoading(true);

            if (!user || !user.id) {
                console.warn("User not logged in or missing ID.");
                Alert.alert("Error", "Please log in to view your cart.");
                setLoading(false);
                return;
            }

            try {
                console.log("Calling getCart...");
                const cartData = await getCart({ ...user, id: user.id.toString() }, api);
                console.log("Cart data received:", cartData);

                if (cartData) {
                    setCart(cartData);
                }
            } catch (error) {
                console.error("Error fetching cart:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [user]);

    if (loading) {
        return (
            <View style={cartPageStyle.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!cart || cart.length === 0) {
        return (
            <View style={cartPageStyle.emptyContainer}>
                <Text style={cartPageStyle.emptyText}>Your cart is empty!</Text>
            </View>
        );
    }

    const handlePress = (item: Post) => {
      router.push('/PostInfoScreen/${item.id}/'); // Use Expo Router to navigate to another screen
    };

    const handleDelete = async (item: any) => {
      try {
        const cartItemId = item.id; // This is the cart item ID, not the listing ID
        console.log("Deleting item from cart:", cartItemId);
        
        // Ensure cartItemId exists
        if (!cartItemId) {
          Alert.alert("Error", "Invalid cart item ID");
          return;
        }
    
        // Perform the DELETE request using the cartItemId
        const response = await api.remove(`/users/${user?.id}/cart/${cartItemId}/`);
    
        if (response.ok) {
          // Remove the item from the cart state if deletion is successful
          setCart(cart.filter((i) => i.id !== item.id));  // Remove based on cart item ID
          Alert.alert("Success", "Item removed from cart");
        } else {
          Alert.alert("Error", "Failed to remove item from cart");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    };
    
    
  
    return (
        <View style={cartPageStyle.container}>
            <FlatList
                data={cart}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <CartItem
                      item={item}
                      onPress={handlePress} 
                      onDelete={() => handleDelete(item)}
                  />
              )}
                contentContainerStyle={cartPageStyle.list}
            />
        </View>
    );
}




  


   

  
  export const cartPageStyle = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      padding: 10,
    },
    list: {
      paddingBottom: 20,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 18,
      color: '#666',
      fontWeight: 'bold',
    },
  });