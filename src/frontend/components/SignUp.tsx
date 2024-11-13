import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';

import { Styles } from '@/constants/Styles';

export function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    setLoading(true);

    // Simulating an async operation like a network request
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Account created successfully!');
      // Reset form fields
      setName('');
      setEmail('');
      setPassword('');
    }, 2000);
  };

  return (
    <View style={Styles.container}>
      <Text style={Styles.title}>Create an Account</Text>
      
      <TextInput
        style={Styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={Styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={Styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={Styles.button}
        onPress={handleSignUp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={Styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}


export default SignUp;
