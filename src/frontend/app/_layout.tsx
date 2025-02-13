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
import { TouchableOpacity } from 'react-native';
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
             
              animation: 'none', // Disable screen animations globally
            
              headerTitle: () => (
                <Image
                  source={require('../assets/images/SOUR-horizontal-logo.png')} // Replace with your image path
                  style={{ width: 120, height: 40 }} // Adjust the size as needed
                  resizeMode="contain" // Keeps the image aspect ratio intact
                />
              ),
              headerStyle: {
                backgroundColor: '#d8ccaf', // Header background color
              },
              
              headerRight: () => (
                <TouchableOpacity onPress={() => router.push('/CartScreen')}>
                  <Ionicons size={30} name="cart-outline" color="#692b20" />
                </TouchableOpacity>
              ),
              headerTintColor: '#692b20', // Header text/icon color
              headerTitleStyle: {
                fontWeight: 'bold', // Bold header title
              },
            }}
            >

            {/* All of these screens should not have a back option- you must log out in the profile page instead */}
            <Stack.Screen 
              name="DiscoverScreen" 
              options={{
                headerLeft: () => ""
              }} 
            />

            <Stack.Screen 
              name="SelfProfileScreen" 
              options={{
                headerLeft: () => ""
              }} 
            />

            <Stack.Screen 
              name="VideosScreen" 
              options={{
                headerLeft: () => ""
              }} 
            />


            <Stack.Screen 
              name="SellerScreen" 
              options={{
                headerLeft: () => ""
              }} 
            />

            <Stack.Screen 
              name="CreateListingScreen" 
              options={{
                headerLeft: () => ""
              }} 
            />

            <Stack.Screen 
              name="LoggedOutScreen" 
              options={{
                headerLeft: () => ""
              }} 
            />

            <Stack.Screen 
              name="MessagesScreen" 
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
