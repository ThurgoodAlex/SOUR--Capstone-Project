import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Styles } from '@/constants/Styles';
import { Stack } from 'expo-router';

export function LoginScreen() {
  
  return (
    <>
      <Stack.Screen
        options={{
          title: "LoginScreen",
        }}
      />
      
    </>
    
  );
}

export default LoginScreen;
