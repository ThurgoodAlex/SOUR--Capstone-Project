import React, { useState, useEffect } from "react";
import { View, Button, Text, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { useApi } from "@/context/api";
import { useUser } from "@/context/user";
import { Styles, TextStyles } from "@/constants/Styles";

export default function CheckoutForm({total} : {total: number}) {
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
      Alert.alert("Success", "Your payment is confirmed!");
      setClientSecret(null);
    }
    setLoading(false);
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



// OLD STUFF FROM EXPO DOCS
// import React, { useCallback, useState, useEffect } from "react";
// import {loadStripe} from '@stripe/stripe-js';
// import {
//   EmbeddedCheckoutProvider,
//   EmbeddedCheckout
// } from '@stripe/react-stripe-js';
// import { router } from "expo-router";
// import { View } from "react-native";
// import { useApi } from "@/context/api";


// // Make sure to call `loadStripe` outside of a component’s render to avoid
// // recreating the `Stripe` object on every render.
// // This is your test secret API key.
// const stripePromise = loadStripe("pk_test_51Qw5QM08yxMUUHDI26yhD2zYs8SRe7a5lCHDJV7MBQ9ltf48CN5dk4YX3wRfR1XWp25smAVLWs68eqfthLx9IECK00SrFO2r5d");

// export async function CheckoutForm (){
//     const api = useApi();


//     const fetchClientSecret = (async () => {
//         const response = await api.post('/create-payment-intent')
//         const result = await response.json()
//         const clientSecret = result.client_secret
//         return clientSecret;
//     });
    
//     const secret = {fetchClientSecret};
// //   const fetchClientSecret = useCallback(() => {
// //     // Create a Checkout Session
// //     return fetch("/create-checkout-session", {
// //       method: "POST",
// //     })
// //       .then((res) => res.json())
// //       .then((data) => data.clientSecret);
// //   }, []);

// //   const options = {fetchClientSecret};


//   return (
//     <View id="checkout">
//       <EmbeddedCheckoutProvider
//         stripe={stripePromise}
//         options={secret}
//       >
//         <EmbeddedCheckout />
//       </EmbeddedCheckoutProvider>
//     </View>
//   )
// }

// const Return = () => {
//   const [status, setStatus] = useState(null);
//   const [customerEmail, setCustomerEmail] = useState('');

//   useEffect(() => {
//     const queryString = window.location.search;
//     const urlParams = new URLSearchParams(queryString);
//     const sessionId = urlParams.get('session_id');

//     fetch(`/session-status?session_id=${sessionId}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setStatus(data.status);
//         setCustomerEmail(data.customer_email);
//       });
//   }, []);

// //   if (status === 'open') {
// //     return (
// //     //   router.push()
// //     )
// //   }

//   if (status === 'complete') {
//     return (
//       <section id="success">
//         <p>
//           We appreciate your business! A confirmation email will be sent to {customerEmail}.

//           If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
//         </p>
//       </section>
//     )
//   }

//   return null;
// }

// export default Return;


