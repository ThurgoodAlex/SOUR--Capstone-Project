import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { Stack, router } from 'expo-router';
import { useAuth } from '@/context/auth'; 
import { useApi } from '@/context/api'; 
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export default function LoginScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(true);
    const [error, setError] = useState(""); // Added error state

    const { login } = useAuth(); 
    const api = useApi();

    const handleLogin = async () => {
        setLoading(true);
        setError(""); // Reset error message on each login attempt
        try {
            const body = new URLSearchParams({
                grant_type: "password",
                username: username,
                password: password,
                scope: "",
                client_id: "",
                client_secret: ""
            });
    
            const response = await api.login(body);
            const result = await response.json();
            console.log(result);
            const access_token = result.access_token;

            if (response.status == 200 && access_token) {
                login(access_token);
                router.replace('/DiscoverScreen');
            } else {
                setError('Incorrect username or password. Please try again.'); // Set error message
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setError('Failed to connect to the server. Please check your connection.'); // Set error message
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerBackButtonDisplayMode: 'minimal'
                }}
            />
            <View style={ScreenStyles.screenCentered}>
                
                <Text style={[TextStyles.h1, TextStyles.uppercase]}>Login</Text>

                {error ? (
                    <Text style={[TextStyles.error, {marginTop:10, marginBottom:10, textAlign:'center'}]}>{error}</Text> // Display error message if any
                ) : null}

                <TextInput
                    style={Styles.input}
                    placeholder="Username"
                    placeholderTextColor={Colors.dark60}
                    keyboardType="default"
                    value={username}
                    onChangeText={setUsername}
                />

                <View style={styles.passwordContainer}>
                    <TextInput
                        style={Styles.input}
                        placeholder="Password"
                        secureTextEntry={passwordVisible}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity
                        onPress={() => setPasswordVisible(!passwordVisible)}
                        style={styles.icon}
                    >
                        <Ionicons
                            name={passwordVisible ? 'eye-off' : 'eye'}
                            size={24}
                            color={Colors.dark}
                        />
                    </TouchableOpacity>
                </View>

               
            
                   {loading ? (
                    <ActivityIndicator size="large" color={Colors.orange} />
                ) : (
                    <TouchableOpacity
                        style={[Styles.buttonDark, (username === "" || password === "") && Styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={username == "" || password == ""}
                    >
                        <Text style={TextStyles.light}>Login</Text>
                    </TouchableOpacity>
                )}
            
               
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    passwordContainer: {
        position: 'relative',
        width: '100%',
    },
    icon: {
        position: 'absolute',
        right: 10,
        padding: 10,
    },
    
});
