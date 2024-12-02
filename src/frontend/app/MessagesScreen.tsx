import { NavBar } from '@/components/NavBar';
import { ScreenStyles } from '@/constants/Styles';
import { Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function MessagesScreen() {
    return (
        <>
        <Stack.Screen
                options={{ title: 'MessagesScreen' }}
        />
        <View style={ScreenStyles.screen}>
            <Text style={{ flex: 1 }}>
                this is the messages screen
            </Text>

        </View>
        <NavBar/>
        </>
        
    );
}
