import { Image, StyleSheet, Platform } from 'react-native';
import React from 'react'
import { SafeAreaView } from 'react-native'

import { HelloWave } from '@/components/HelloWave';
import BackendData from '@/components/BackendData';
export default function HomeScreen() {
  return (
   <SafeAreaView style={{ flex: 1 }}>
      <BackendData />
    </SafeAreaView> 
  );
}


