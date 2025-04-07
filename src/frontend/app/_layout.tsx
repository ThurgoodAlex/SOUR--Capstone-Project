import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Slot, Stack } from 'expo-router'; // Correct imports for expo-router
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider } from '@/context/auth'; // Adjust the path as needed
import { UserProvider } from '@/context/user'; // Adjust the path as needed
import { TouchableOpacity, Image, View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


// Prevent splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (

        <GestureHandlerRootView style={{ flex: 1 }}>
            <AuthProvider>
                <UserProvider>
                    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                        <Stack
                            screenOptions={{
                                animation: 'none',
                                headerTitle: () => (
                                    <Image
                                        source={require('../assets/images/SOUR-logo-horizontal.png')}
                                        style={{ width: 120, height: 40 }}
                                        resizeMode="contain"
                                    />
                                ),
                                headerStyle: {
                                    backgroundColor: '#d8ccaf',
                                },
                                headerTintColor: '#692b20',
                                headerTitleStyle: {
                                    fontWeight: 'bold',
                                },
                            }}
                        >

                            {/* All of these screens should not have a back option- you must log out in the profile page instead */}
                            <Stack.Screen
                                name="DiscoverScreen"
                                options={{
                                    headerLeft: () => "",
                                    headerRight: () => (
                                        <>
                                            <TouchableOpacity onPress={() => router.push('/SearchScreen')}>
                                                <Ionicons size={30} name="search-outline" color="#692b20" />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => router.push('/CartScreen')}>
                                                <Ionicons size={30} name="cart-outline" color="#692b20" />
                                            </TouchableOpacity>
                                        </>
                                    ),
                                }}
                            />

                            <Stack.Screen
                                name='VideosScreen'
                                options={{
                                    headerShown: false
                                }}
                            />

                            <Stack.Screen
                                name="SellerScreen"
                                options={{
                                    headerLeft: () => ""
                                }}
                            />

                            <Stack.Screen
                                name="ChatsScreen"
                                options={{
                                    headerLeft: () => "",
                                    headerRight: () => (
                                        <TouchableOpacity onPress={() => router.push('/CartScreen')}>
                                            <Ionicons size={30} name="cart-outline" color="#692b20" />
                                        </TouchableOpacity>
                                    ),
                                }}
                            />

                            <Stack.Screen
                                name='SelfProfileScreen'
                                options={{
                                    headerLeft: () => "",
                                    headerRight: () =>
                                        <Ionicons
                                            size={30}
                                            name="cog-outline"
                                            color='#692b20'
                                            onPress={() => router.push('/SettingsScreen')}
                                        />
                                }}
                            />

                            <Stack.Screen
                                name="LoggedOutScreen"
                                options={{
                                    headerLeft: () => ""
                                }}
                            />
                            <Slot />
                        </Stack>
                    </ThemeProvider>
                </UserProvider>
            </AuthProvider>
        </GestureHandlerRootView>
    );
}


