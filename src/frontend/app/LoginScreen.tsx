import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Styles } from '@/constants/Styles';
import { Stack, router } from 'expo-router';

export default function LoginScreen() {
    const [email, setEmail] = useState('example');
    const [password, setPassword] = useState('examplepassword');
    const [loading, setLoading] = useState(false);

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }
        else {
            setLoading(true);
            router.push('/DiscoverScreen');
            setLoading(false);
        }
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
