import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RootLayout from '@/app/_layout';
import { Slot } from 'expo-router';
import { AuthProvider } from '@/context/auth';
import { UserProvider } from '@/context/user';

const Stack = createStackNavigator();

let currentUser = {
  username: "",
  password: ""
}

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="LoggedOut">
//         <Stack.Screen name="LoggedOut" component={LoggedOut} options={{ headerShown: false }} />
//         <Stack.Screen name="SignUp" component={SignUp} />
//         <Stack.Screen name="Login" component={Login} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <RootLayout /> {/* Used by expo-router to render screens */}
      </UserProvider>
    </AuthProvider>
  );
//   return <RootLayout />; // Wrap everything inside the layout component
}