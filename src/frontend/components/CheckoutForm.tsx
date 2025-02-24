import React, { useState, useEffect } from "react";
import { Button, View, Text } from "react-native";
import { useStripe, CardField, CardFieldInput, useConfirmPayment } from "@stripe/stripe-react-native";
import { useApi } from "@/context/api";

export default function CheckoutForm() {
  const { confirmPayment, loading } = useConfirmPayment();
  const [clientSecret, setClientSecret] = useState(null);
  const api = useApi();

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await api.post("/create-payment-intent");
        const result = await response.json();
        setClientSecret(result.client_secret);
      } catch (error) {
        console.error("Failed to fetch client secret:", error);
      }
    };
    fetchClientSecret();
  }, [api]);

  const handlePayPress = async () => {
    if (!clientSecret) return;

    const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: "Card",
        paymentMethodData: {
            billingDetails: {
                email: "test@example.com",
            },
        },
    });

    if (error) {
      console.log("Payment confirmation error", error.message);
    } else if (paymentIntent) {
      console.log("Payment successful", paymentIntent);
    }
  };

  return (
    <View>
      <CardField
        postalCodeEnabled={true}
        placeholders={{ number: "4242 4242 4242 4242" }}
        cardStyle={{
          backgroundColor: "#FFFFFF",
          textColor: "#000000",
        }}
        style={{
          width: "100%",
          height: 50,
          marginVertical: 30,
        }}
      />
      <Button onPress={handlePayPress} title="Pay Now" disabled={loading} />
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


