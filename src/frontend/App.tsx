import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // ✅ Import this
import RootLayout from '@/app/_layout';
import { AuthProvider } from '@/context/auth';
import { UserProvider } from '@/context/user';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <UserProvider>
          <RootLayout />
        </UserProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
