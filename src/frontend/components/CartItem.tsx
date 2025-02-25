import { useEffect, useState } from "react";
import { Text, Image, View, Pressable, ImageSourcePropType, TouchableOpacity, Alert } from "react-native";
import { CartItemProps, Post } from "@/constants/Types";
import { StyleSheet } from "react-native";
import { router } from "expo-router";
import { TextStyles } from "@/constants/Styles";
import { Ionicons } from "@expo/vector-icons";
import { useApi } from "@/context/api";
import { Colors } from "@/constants/Colors";

export  function CartItem({ item, refreshCart } : {item : CartItemProps, refreshCart: () => void}) {
    const api = useApi();
    const [listing, setListing] = useState<Post>();

    const fetchListing = async () => {
        try{
            const response = await api.get(`/posts/${item.listingID}/`);
            if (response.ok){
                const listingData = await response.json();
                setListing(listingData);
            }
        }
        catch {
            console.log('could not fetch listing')
        }
    }

    useEffect(() => {
        fetchListing();
    }, []);

    const imageSource: ImageSourcePropType =
        typeof listing?.coverImage === "string" ? { uri: listing?.coverImage } : listing?.coverImage || require('@/assets/images/listing.png');

    const handleDelete = async (item: CartItemProps) => {
            try {
                const response = await api.remove(`/users/cart/${item.id}/`);
    
                if (response.ok) {
                    Alert.alert("Success", "Item removed from cart");
                    refreshCart();
                } else {
                    Alert.alert("Error", "Failed to remove item from cart");
                }
            } catch (error) {
                console.error("Error deleting item:", error);
                Alert.alert("Error", "Something went wrong. Please try again.");
            }
        };
    return (
        <View>
            <Pressable onPress={() => router.push(`/PostInfoScreen/${listing?.id}/`)} style={cartStyle.container}>
                {listing?.coverImage && <Image source={imageSource} style={cartStyle.image} />}
                <View style={cartStyle.details}>
                    <Text style={cartStyle.title}>{listing?.title}</Text>
                    <Text style={cartStyle.brand}>{listing?.brand}</Text>
                    <Text style={cartStyle.price}>${Number(listing?.price).toFixed(2)}</Text>
                </View>
                <Ionicons
                    name='trash'
                    size={30}
                    style={{color: Colors.dark}}
                    onPress={() => handleDelete(item)}
                />
            </Pressable>

            <TouchableOpacity
                onPress={() => router.push({
                    pathname: '/CheckoutScreen',
                    params: { item: JSON.stringify(item) },
                })}
            >
                <Text style={TextStyles.dark}>Purchase</Text>
            </TouchableOpacity>
        </View>
    );
};

export const cartStyle = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 10,
        backgroundColor: "#d8ccaf60",
        borderRadius: 10,
        marginVertical: 5,
        alignItems: "center",
        justifyContent: 'space-between',
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
        color: "#d8ccaf60"
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 10,
    },
    details: {
        marginLeft: 10,
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    brand: {
        fontSize: 14,
        color: "#777",
    },
    price: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#f98b69",
    },
    deleteButton: {
        backgroundColor: "#f98b69",
        justifyContent: "center",
        alignItems: "center",
        width: 70,
        height: "100%",
    },
    deleteContainer: {
        backgroundColor: "#f98b69",
        justifyContent: "center",
        alignItems: "center",
        width: 70,
        height: "100%",
    },
    deleteText: {
        color: "#692b20",
        fontWeight: "bold",
    },
});