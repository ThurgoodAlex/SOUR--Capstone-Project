import { Alert, View } from 'react-native';
import { ScreenStyles } from '@/constants/Styles';

import { useUser } from '@/context/user';
import { useAuth } from '@/context/auth';

import { router, Stack } from 'expo-router';
import { NavBar } from '@/components/NavBar';
import { RegisteredSeller } from '@/components/ResgisteredSeller';
import { UnregisteredSeller } from '@/components/UnregisteredSeller';

export default function SellerScreen() {
    const { user } = useUser(); // Fetch user details
    if (user){
        return (
            <>
                <View style={ScreenStyles.screen}>
                    {user.isSeller ? (
                        <RegisteredSeller/>
                    ) : (
                        <UnregisteredSeller />
                    )}
                </View>
                <NavBar />
            </>
        );
    }
    else {
        console.log("no user available");
        router.replace("/LoggedOutScreen")
    }
}
