import { useEffect, useState } from "react";
import { getCart } from "@/components/GetCart";
import { useUser } from "@/context/user";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useApi } from "@/context/api";
import { ActivityIndicator, FlatList, View, Text, Alert } from "react-native";
import { CartPost, Post } from "@/constants/Types";
import { CartItem } from "@/components/CartItem";
import { router } from "expo-router";

export default function CartScreen() {
  const [cart, setCart] = useState<CartPost[]>([]);
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
  };

  const handleDelete = async (item: any) => {
    try {
      const cartItemId = item.cartItemId; // Use the correct cart item ID
      console.log("Deleting item from cart:", cartItemId);

      if (!cartItemId) {
        Alert.alert("Error", "Invalid cart item ID");
        return;
      }

      // Perform the DELETE request using the cartItemId
      const response = await api.remove(`/users/cart/${cartItemId}/`);

      if (response.ok) {
        // Remove the item from the cart state if deletion is successful
        setCart(cart.filter((i) => i.cartItemId !== cartItemId)); // Remove based on cart item ID
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
          keyExtractor={(item) => item.cartItemId.toString()} // Use cartItemId as the key
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
    backgroundColor: "#d8ccaf",
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
    backgroundColor: "#d8ccaf",
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#d8ccaf",
    color: "#7e9151",
  },
  checkoutButton: {
    width: "90%",
    backgroundColor: "#7e9151",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  checkoutText: {
    color: "#d8ccaf",
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
    backgroundColor:"#d8ccaf"
  },
});