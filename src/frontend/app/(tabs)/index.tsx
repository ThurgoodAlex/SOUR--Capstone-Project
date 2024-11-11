import { Image, StyleSheet, Platform } from 'react-native';
import React from 'react'
import { SafeAreaView } from 'react-native'

import { HelloWave } from '@/components/HelloWave';
import BackendData from '@/components/BackendData';
import { SignUp } from '@/components/SignUp';
export default function HomeScreen() {
  return (
    <>
    <HelloWave></HelloWave>
    <SignUp></SignUp>  
    </>
   
  );
}


