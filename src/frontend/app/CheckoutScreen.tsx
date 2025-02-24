import { StripeProvider } from '@stripe/stripe-react-native';
import { Text } from 'react-native';
import CheckoutForm from '@/components/CheckoutForm';
import { CheckoutReturn } from '@/components/CheckoutReturn';

export default function CheckoutScreen() {
  return (
    <StripeProvider
      publishableKey="pk_test_51Qw5QM08yxMUUHDI26yhD2zYs8SRe7a5lCHDJV7MBQ9ltf48CN5dk4YX3wRfR1XWp25smAVLWs68eqfthLx9IECK00SrFO2r5d"
    //   urlScheme="sour-url-scheme" // required for 3D Secure and bank redirects
    //   merchantIdentifier="merchant.com.{{SOUR}}" // required for Apple Pay
    >
        <Text>Stripe Provider</Text>
        <CheckoutForm />
        <CheckoutReturn />
     </StripeProvider>
  );
}
