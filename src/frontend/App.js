import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoggedOut from '@Components/LoggedOut';
import SignUp from '@Components/SignUp';
import Login from '@Components/Login';

const Stack = createStackNavigator();

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
  return <RootLayout />; // Wrap everything inside the layout component
}