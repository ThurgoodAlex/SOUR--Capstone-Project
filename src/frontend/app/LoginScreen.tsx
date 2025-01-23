import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { Stack, router } from 'expo-router';
import { useAuth } from '@/context/auth'; 
import { useApi } from '@/context/api'; 


export default function LoginScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth(); 
    const api = useApi();

    const handleLogin = async () => {
        setLoading(true);
        try {
            // Format body as URLSearchParams
            const body = new URLSearchParams({
                grant_type: "password",
                username: username,
                password: password,
                scope: "",
                client_id: "",
                client_secret: ""
            });
    
            // Use api.post to send the request
            const response = await api.login(body);
            const result = await response.json();
            console.log(result)
            const access_token = result.access_token;
            console.log("Token response: ", access_token);

            if (response.status == 200 && access_token) {
                login(access_token);
                router.replace('/DiscoverScreen');
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
            <View style={ScreenStyles.screenCentered}>
                <Text style={[TextStyles.h2, TextStyles.uppercase]}>Login</Text>

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
                        <Text style={TextStyles.light}>Login</Text>
                    )}
                </TouchableOpacity>
            </View>
        </>
    );
}
