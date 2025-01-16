import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { router } from 'expo-router';
import { useApi } from '@/context/api';

export default function SignUpScreen() {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Get the `post` method from the API
    const { post } = useApi();

    const requestCreateUser = async () => {
        if (!username || !email || !password || !firstName || !lastName) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        setLoading(true);

        try {
            // Use the `post` method from the API abstraction
            const response = await post('/auth/createuser', {
                username: username,
                firstname: firstName,
                lastname: lastName,
                email: email,
                password: password,
            });

            const result = await response.json();
            console.log(result);


            if (response.ok) {
                Alert.alert('Success', `Account created successfully! Welcome, ${result.firstName || firstName}!`);
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
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
            />
            <TextInput
                style={Styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
            />
            
            <TextInput
                style={Styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
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
