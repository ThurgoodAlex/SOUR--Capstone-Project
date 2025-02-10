import { useEffect, useState } from "react";
import { getCart } from "@/components/GetCart";
import { useUser } from "@/context/user";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useApi } from "@/context/api";
import { ActivityIndicator, FlatList, View, Text, Alert } from "react-native";
import { Post } from "@/constants/Types";
import { CartItem } from "@/components/CartItem";
import { router } from "expo-router";
import { Dimensions } from "react-native";






export default function CartScreen() {


  console.log("CartScreen Component Mounted!");

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
      router.push(`/PostInfoScreen/${item.id}/`);
 // Use Expo Router to navigate to another screen
    };

    const handleDelete = async (item: any) => {
      try {
        const cartItemId = item.id; // This is the listingID as shown in the cart
        console.log("Deleting item from cart:", cartItemId);
        
        if (!cartItemId) {
          Alert.alert("Error", "Invalid cart item ID");
          return;
        }
    
        // Perform the DELETE request using the cartItemId
        const response = await api.remove(`/users/users/${user?.id}/cart/${cartItemId}/`);
    
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
        {/* Cart Items List */}
        <View style={cartPageStyle.listContainer}>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <CartItem
                item={item}
                onPress={() => handlePress(item)}
                onDelete={() => handleDelete(item)}
              />
            )}
            contentContainerStyle={cartPageStyle.list}
          />
        </View>
    
        <View style={cartPageStyle.checkoutContainer}>
          <TouchableOpacity
            style={cartPageStyle.checkoutButton}
            onPress={() => Alert.alert("Proceeding to checkout")}
          >
            <Text style={cartPageStyle.checkoutText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
    
}
  
  
export const cartPageStyle = StyleSheet.create({
  container: {
    flex: 1, // Ensures full-screen usage
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 10,
  },
  listContainer: {
    flex: 1, // Allows the cart list to grow and fill available space
  },
  list: {
    paddingBottom: 20, // Adds spacing before checkout button
  },
  checkoutContainer: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  emptyText:
  {
    fontSize: 18,
    fontWeight: "bold",
    color: "#777",
  },
  checkoutButton: {
    width: "90%",
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  checkoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
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
});


 