import { useEffect, useState } from "react";
import { useUser } from "@/context/user";
import { StyleSheet } from "react-native";
import { useApi } from "@/context/api";
import { FlatList, View, Text } from "react-native";
import { CartItemProps } from "@/constants/Types";
import { CartItem } from "@/components/CartItem";
import { ScreenStyles } from "@/constants/Styles";
import { NavBar } from "@/components/NavBar";
import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";

export default function CartScreen() {
    const [cart, setCart] = useState<CartItemProps[]>([]);
    const { user } = useUser();
    const api = useApi();

    const fetchCart = async () => {
        try {
            const response = await api.get(`/users/${user?.id}/cart/`);
            
            if (response.ok) {
                const cartData = await response.json();
                setCart(cartData);
                console.log("Cart state after set:", cartData, Array.isArray(cartData), cartData.length);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const renderItem = ({ item }: {item: CartItemProps}) => (
        <CartItem item={item} refreshCart={fetchCart}/>
    );

    return (
        <>
            <Stack.Screen
                options={{
                    headerBackButtonDisplayMode: 'minimal'
                }}
            />
            <View style={ScreenStyles.screen}>
                {!cart || cart.length === 0 ? (
                    <Text style={cartPageStyle.emptyText}>Your cart is empty!</Text>
                ) : (
                    <FlatList
                        data={cart}
                        contentContainerStyle={{ height: 600 }}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                    />)
                }
            </View>
            <NavBar />
        </>
    );
}

export const cartPageStyle = StyleSheet.create({
    emptyText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#7e9151",
        justifyContent: 'center'
    },
    checkoutButton: {
        width: "90%",
        backgroundColor: "#7e9151",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    checkoutText: {
        color: Colors.light,
        fontSize: 18,
        fontWeight: "bold",
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
