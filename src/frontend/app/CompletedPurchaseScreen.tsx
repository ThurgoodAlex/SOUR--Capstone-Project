import { View, Text } from 'react-native';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { NavBar } from '@/components/NavBar';
import { Stack } from 'expo-router';

export default function CompletedPurchaseScreen() {
    return (
        <>
            <Stack.Screen
                options={{
                    headerBackButtonDisplayMode: 'minimal'
                }}
            />
            <View style={ScreenStyles.screen}>
                <Text style={TextStyles.h1}>Purchase Completed!</Text>
                <Text style={TextStyles.p}>Thank you for your purchase. Your order has been processed successfully.</Text>
            </View>
            <NavBar />
        </>
    );

}