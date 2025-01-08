import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { router } from 'expo-router';
import { useApi } from '@/context/api';

export function SignUpScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Get the `post` method from the API
    const { post } = useApi();

    const requestCreateUser = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        setLoading(true);

        try {
            // Use the `post` method from the API abstraction
            const response = await post('/auth/createuser', {
                username: name,
                email: email,
                password: password,
                isSeller: false
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert('Success', `Account created successfully! Welcome, ${result.username || name}`);
                router.replace('/LoginScreen');
            } else {
                Alert.alert('Error', result.message || 'Failed to create an account. Please try again.');
            }
        } catch (error) {
            console.error('Error creating account:', error);
            Alert.alert('Error', 'Failed to connect to the server. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={ScreenStyles.screenCentered}>
            <Text style={[TextStyles.h2, TextStyles.uppercase]}>Create an Account</Text>
            <TextInput
                style={Styles.input}
                placeholder="Username"
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
                style={Styles.buttonDark}
                onPress={requestCreateUser}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#ffffff" />
                ) : (
                    <Text style={TextStyles.light}>Sign Up</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

export default SignUpScreen;
