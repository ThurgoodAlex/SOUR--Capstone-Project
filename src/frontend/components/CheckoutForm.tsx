import React, { useState, useEffect } from "react";
import { View, Button, Text, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { useApi } from "@/context/api";
import { useUser } from "@/context/user";
import { Styles, TextStyles } from "@/constants/Styles";
import { router } from "expo-router";

export default function CheckoutForm({total, postID, cartItemID} : {total: number, postID: number, cartItemID: number}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {user} = useUser();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const api = useApi();

  useEffect(() => {
    const fetchPaymentSheetParams = async () => {
      try {
        setLoading(true);
        const response = await api.post(`/stripe/create-payment-intent/${total}`);
        const result = await response.json();
        console.log("RESPONSE", result);
        const client_secret = result.clientSecret;

        if (!client_secret) throw new Error("Missing client secret from server.");

        setClientSecret(client_secret);

        const { error } = await initPaymentSheet({
          paymentIntentClientSecret: client_secret,
          customerId: user?.id.toString(),
          merchantDisplayName: "SOUR Clothing",
          allowsDelayedPaymentMethods: true,
          returnURL: "sour://checkout-return",
        });

        if (error) {
          console.error("Error initializing PaymentSheet:", error);
          Alert.alert("Initialization Error", error.message);
        }
      } catch (error: any) {
        console.error("Failed to fetch payment sheet parameters:", error);
        Alert.alert("Error", error.message ?? "Unable to initialize payment.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentSheetParams();
  }, []); // Empty dependency array to avoid infinite re-renders

  const openPaymentSheet = async () => {
    if (!clientSecret) return;

    setLoading(true);
    const { error } = await presentPaymentSheet();

    if (error) {
        console.log("Payment failed", error.message);
        Alert.alert("Payment Failed", error.message);

    } else {
        console.log("Payment complete!");
        setClientSecret(null);

        // Make the API call to mark the post as sold
        try {
            const sellPostResponse = await api.put(`/posts/${postID}/sold/`);

            if (sellPostResponse.ok) {
                console.log("Post marked as sold successfully");
            } else {
                console.error("Failed to mark post as sold");
            }

            const removeCartItemResponse = await api.remove(`/users/cart/${cartItemID}/`);
            if (removeCartItemResponse.ok) {
                console.log("Cart item removed successfully");
            }  else {
                console.error("Failed to remove cart item");
            }

        } catch (err) {
            console.error("Error marking post as sold:", err);
        }

        // Navigate to the completed purchase page
        router.push("/CompletedPurchaseScreen");
    }
  };

  return (
    <View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
            <TouchableOpacity 
                onPress={openPaymentSheet}
                style={Styles.buttonDark}>
                <Text style={TextStyles.light}>Pay Now</Text>
            </TouchableOpacity>
           
        </>
      )}
    </View>
  );
}
