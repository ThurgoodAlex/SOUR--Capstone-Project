import { Alert } from "react-native";
import { Post } from "@/constants/Types"; // Ensure 'Post' type is defined

export const getCart = async (user: { id: string } | null, api: any): Promise<Post[] | null> => {
    console.log("getCart function called");

    if (!user) {
        console.warn("No user logged in.");
        Alert.alert("Error", "User not logged in. Please log in to view your cart.");
        return null;
    }

    try {
        console.log("Fetching cart for user:", user.id);
        const response = await api.get(`/users/${user.id}/cart/`);

        if (response.ok) {
            const cartData = await response.json();

            // Extract `listingID` from each cart item an fetch item in parallel
            const listingIDs = cartData.map((item: { listingID: number }) => item.listingID);
            console.log("Extracted Listing IDs:", listingIDs);

            const cartItems = await Promise.all(
                listingIDs.map(async (id: any) => {
                    const itemResponse = await api.get(`/posts/${id}/`);
                    return itemResponse.ok ? await itemResponse.json() : null;
                })
            );

            const validCartItems = cartItems.filter((item) => item !== null);
            console.log("Full Cart Items:", validCartItems);
            return validCartItems;
        } else {
            console.error("Failed to fetch cart:", response.status);
            Alert.alert("Error", `Failed to fetch cart. Server responded with status ${response.status}.`);
            return null;
        }
    } catch (error) {
        console.error("Error grabbing cart:", error);
        Alert.alert("Error", "Failed to connect to the server. Please check your connection.");
        return null;
    }
};
