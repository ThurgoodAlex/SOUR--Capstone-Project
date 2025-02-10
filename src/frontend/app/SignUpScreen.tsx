import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { router } from 'expo-router';
import { useApi } from '@/context/api';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export default function SignUpScreen() {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [verifyPasswordVisible, setVerifyPasswordVisible] = useState(false);

    // Get the `post` method from the API
    const { post } = useApi();

    const requestCreateUser = async () => {
        if (!username || !email || !password || !firstName || !lastName) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        if (password !== verifyPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9!@#$%^&*])(?=.{8,})/;
        if (!passwordRegex.test(password)) {
            Alert.alert('Error', 'Password must be at least 8 characters long, contain at least one uppercase letter, and include either a number or a special character.');
            return;
        }

        setLoading(true);

        try {
            // Use the `post` method from the API abstraction
            const response = await post('/auth/createuser/', {
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
        <KeyboardAwareScrollView contentContainerStyle={ScreenStyles.screen}>
            <Text style={TextStyles.h1}>Sign Up</Text>
            <TextInput
                style={Styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
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
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <View style={style.passwordContainer}>
                <TextInput
                    style={Styles.input}
                    placeholder="Password"
                    secureTextEntry={!passwordVisible}
                    value={password}
                    onChangeText={setPassword}
                />
                <Ionicons
                    name={passwordVisible ? 'eye-off' : 'eye'}
                    size={24}
                    color="gray"
                    onPress={() => setPasswordVisible(!passwordVisible)}
                    style ={style.icon}
                />
            </View>
            <Text style={[TextStyles.small, style.hint]}>
                Password must be at least 8 characters long, contain at least one uppercase letter, and include either a number or a special character.
            </Text>
            <View style={style.passwordContainer}>
                <TextInput
                    style={Styles.input}
                    placeholder="Verify Password"
                    secureTextEntry={!verifyPasswordVisible}
                    value={verifyPassword}
                    onChangeText={setVerifyPassword}
                />
                <Ionicons
                    name={verifyPasswordVisible ? 'eye-off' : 'eye'}
                    size={24}
                    color="gray"
                    onPress={() => setVerifyPasswordVisible(!verifyPasswordVisible)}
                    style ={style.icon}
                />
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <TouchableOpacity
                    style={Styles.buttonDark}
                    onPress={requestCreateUser}
                    disabled={loading}
                >
                    <Text style={TextStyles.light}>Sign Up</Text>
                </TouchableOpacity>
            )}
        </KeyboardAwareScrollView>
    );
}


export const style = StyleSheet.create({
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    icon: {
        padding: 10,
        position: 'absolute',
        right: 10,
        bottom: 15
    },
    hint: {
        marginTop:-10,
        marginBottom:15,
        color:Colors.dark
    }
});