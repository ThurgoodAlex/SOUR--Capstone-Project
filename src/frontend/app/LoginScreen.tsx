import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Styles } from '@/constants/Styles';
import { Stack, router } from 'expo-router';
import { useAuth } from '@/context/auth'; 
import { useApi } from '@/context/api'; 

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth(); 
    const api = useApi();

    const handleLogin = async () => {
        // if (!username || !password) {
        //     Alert.alert('Error', 'Please fill out all fields.');
        //     return;
        // }

        // setLoading(true);

        try {
            
            const response = await api.post('/auth/login', { username, password });
            const result = await response.json();

            if (response.ok) {
                console.log("response after log in request: ", result)
                login(); //need to pass token later
                router.push('/DiscoverScreen');
            } else {
                Alert.alert('Incorrect username or password. Please try again.');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            Alert.alert('Error', 'Failed to connect to the server. Please check your connection.');
        } finally {
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
                    placeholder="Username"
                    keyboardType="default"
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
