import { View } from 'react-native';
import { ScreenStyles } from '@/constants/Styles';

import { useUser } from '@/context/user';
import { Stack } from 'expo-router';
import { NavBar } from '@/components/NavBar';
import { RegisteredSeller } from '@/components/ResgisteredSeller';
import { UnregisteredSeller } from '@/components/UnregisteredSeller';

export default function SellerScreen() {
    const user = useUser(); // Fetch user details

    return (
        <>
            <Stack.Screen options={{ title: 'SellerScreen' }} />
            <View style={ScreenStyles.screen}>
                {user?.isSeller ? (
                    <RegisteredSeller />
                ) : (
                    <UnregisteredSeller />
                )}
            </View>
            <NavBar/>
        </>
    );
}
