import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router"; // useRouter to access query params
import { useApi } from "@/context/api";

// Define types for the session response
interface SessionStatusResponse {
  status: string;
  customer_email: string;
}

export const CheckoutReturn: React.FC = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const router = useRouter(); // Access router to get query params
  const api = useApi();

//   // Get the session_id from query params
//   const { session_id } = 

//   useEffect(() => {
//     const fetchSessionStatus = async () => {
//       if (!session_id) return;

//       try {
//         const response = await api.get(`/session-status?session_id=${session_id}`);
//         const data: SessionStatusResponse = await response.json();
//         setStatus(data.status);
//         setCustomerEmail(data.customer_email);
//       } catch (error) {
//         console.error("Failed to fetch session status:", error);
//       }
//     };

//     fetchSessionStatus();
//   }, [session_id, api]);

//   if (status === "complete") {
    return (
      <View>
        <Text>Thank you for your purchase!</Text>
        <Text>A confirmation email will be sent to {customerEmail}.</Text>
        <Text>
          If you have any questions, please email orders@example.com.
        </Text>
      </View>
    );
//   }

};
