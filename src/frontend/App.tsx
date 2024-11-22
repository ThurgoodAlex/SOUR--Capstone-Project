import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RootLayout from '@/app/_layout';
import { Slot } from 'expo-router';
import { AuthProvider } from '@/context/auth';
import { UserProvider } from '@/context/user';

const Stack = createStackNavigator();


export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <RootLayout /> 
      </UserProvider>
    </AuthProvider>
  );

}