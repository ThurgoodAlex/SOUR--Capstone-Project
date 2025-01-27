import { useApi } from "@/context/api";
import { useUser } from "@/context/user";
import { Alert } from "react-native";

export const getCart = async () => {
    const { user } = useUser(); 
    const api = useApi(); 

    if (!user) {
        console.warn("No user logged in.");
        Alert.alert("Error", "User not logged in. Please log in to view your cart.");
        return null;
    }

    try {
      
        const cartData = await api.get(`/users/${user.id}/cart/`);

        if (cartData.ok) {
            const cartResponse = await cartData.json();
            console.log("Cart Response:", cartResponse);
            return cartResponse;
        } else {
            console.error("Failed to fetch cart:", cartData.status);
            Alert.alert(
                "Error",
                `Failed to fetch cart. Server responded with status ${cartData.status}.`
            );
            return null; 
        }
    } catch (error) {
        console.error("Error grabbing cart:", error);
        Alert.alert(
            "Error",
            "Failed to connect to the server. Please check your connection."
        );
        return null; 
    }

  
};