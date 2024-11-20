import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Styles } from '@/constants/Styles';
import { Stack, router } from 'expo-router';

export default function LoginScreen() {
    const [username, setUsername] = useState('example');
    const [password, setPassword] = useState('example');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        // if (!username || !password) {
        //     Alert.alert('Error', 'Please fill out all fields.');
        //     return;
        // }

        // setLoading(true);

        // try {
        //     const response = await fetch('http://localhost:8000/auth/login', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             username: username,
        //             password: password,
        //         }),
        // });
        // const result = await response.json();

        // if (response.ok) {
        //     router.replace('/DiscoverScreen')
        // } else {
        //     Alert.alert('Error', result.message || 'Incorrect username or password. Please try again.');
        // }
        // } catch (error) {
        //     console.error('Error logging in:', error);
        //     Alert.alert('Error', 'Failed to connect to the server. Please check your connection.');
        // } finally {
        //     setLoading(false);
        // }
        router.replace('/DiscoverScreen');
        
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: "LoginScreen",
                }}
            />
            <View style={Styles.container}>
                <Text style={Styles.title}>Login</Text>

                <TextInput
                    style={Styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
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
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <Text style={Styles.buttonTextLight}>Login</Text>
                    )}
                </TouchableOpacity>
            </View>

        </>

    );
}
