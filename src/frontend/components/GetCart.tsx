import { Alert } from "react-native";
import { CartPost, Post } from "@/constants/Types"; // Ensure 'Post' type is defined

export const getCart = async (user: { id: string } | null, api: any): Promise<CartPost[] | null> => {
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

            const listingIDs = cartData.map((item: { listingID: number }) => item.listingID);
            console.log("Extracted Listing IDs:", listingIDs);

            // Fetch the details of each listing in the cart and return the data
            const cartItems = await Promise.all(
                cartData.map(async (item: { listingID: number, id: number }) => {
                    const itemResponse = await api.get(`/posts/${item.listingID}/`);
                    if (itemResponse.ok) {
                        const itemData = await itemResponse.json();
                        return { ...itemData, cartItemId: item.id };
                    }
                    return null;
                })
            );


            const validCartItems = cartItems.filter((item) => item !== null);
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
