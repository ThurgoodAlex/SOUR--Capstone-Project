import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, Stack } from 'expo-router'; // Correct imports for expo-router
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider } from '@/context/auth'; // Adjust the path as needed
import { UserProvider } from '@/context/user'; // Adjust the path as needed

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
    <AuthProvider>
      <UserProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack
            screenOptions={{
              headerTitle: "SOUR", // Header title
              headerStyle: {
                backgroundColor: '#bde0eb', // Header background color
              },
              headerRight: () => <Ionicons size={30} name="cart-outline" />, // Custom header icon
              headerTintColor: '#fff', // Header text/icon color
              headerTitleStyle: {
                fontWeight: 'bold', // Bold header title
              },
            }}
          >
            {/* Ensure Slot is here to dynamically render screens */}
            <Slot />
          </Stack>
        </ThemeProvider>
      </UserProvider>
    </AuthProvider>
  );
}
