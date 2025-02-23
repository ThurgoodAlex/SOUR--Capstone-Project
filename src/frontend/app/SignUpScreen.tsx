import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, KeyboardTypeOptions } from 'react-native';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { router } from 'expo-router';
import { useApi } from '@/context/api';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    username: Yup.string().min(4, 'Username must be at least 4 characters').required('Username is required'),
    firstName: Yup.string().matches(/^[A-Za-z]+$/, 'First name must contain only letters').required('First name is required'),
    lastName: Yup.string().matches(/^[A-Za-z]+$/, 'Last name must contain only letters').required('Last name is required'),
    email: Yup.string().email('Please enter a valid email address').required('Email is required'),
    password: Yup.string()
        .matches(/^(?=.*[A-Z])(?=.*[0-9!@#$%^&*])(?=.{8,})/, 'Password must be at least 8 characters long, contain at least one uppercase letter, and include either a number or a special character.')
        .required('Password is required'),
    verifyPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords do not match').required('Password confirmation is required'),
});

export default function SignUpScreen() {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [passwordVisibility, setPasswordVisibility] = useState<{ [key: string]: boolean }>({
        password: true,
        verifyPassword: true,
    });

    const { post } = useApi();

    const requestCreateUser = async () => {
        try {
            await validationSchema.validate({ username, firstName, lastName, email, password, verifyPassword }, { abortEarly: false });
            setErrors({});
            setLoading(true);

            const response = await post('/auth/createuser/', {
                username: username,
                firstname: firstName,
                lastname: lastName,
                email,
                password,
            });

            const result = await response.json();
            if (response.ok) {
                Alert.alert('Success', `Account created successfully! Welcome, ${result.firstName || firstName}!`);
                router.replace('/LoginScreen');
            } else {
                if (response.status === 409) {
                    let message = result.detail || '';
                    if (message.includes('username')) {
                        Alert.alert('Error', 'Username is already taken. Please try a different username.');
                    } else if (message.includes('email')) {
                        Alert.alert('Error', 'Email is already in use. Please try a different email or log in to your existing account.');
                    } else {
                        Alert.alert('Error', result.message || 'Failed to create an account. Please try again.');
                    }
                } else {
                    Alert.alert('Error', result.message || 'Failed to create an account. Please try again.');
                }
            }
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const newErrors: { [key: string]: string } = {};
                error.inner.forEach(err => {
                    if (err.path) {
                        newErrors[err.path] = err.message;
                    }
                });
                setErrors(newErrors);
            } else {
                Alert.alert('Error', 'Failed to connect to the server. Please check your connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = (field: string) => {
        setPasswordVisibility(prevState => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };

    const fields = [
        { key: 'username', placeholder: 'Username' },
        { key: 'firstName', placeholder: 'First Name' },
        { key: 'lastName', placeholder: 'Last Name' },
        { key: 'email', placeholder: 'Email', keyboardType: 'email-address' as KeyboardTypeOptions },
        { key: 'password', placeholder: 'Password', secureTextEntry: true },
        { key: 'verifyPassword', placeholder: 'Confirm Password', secureTextEntry: true },
    ];
    
    return (
        <KeyboardAwareScrollView contentContainerStyle={ScreenStyles.screenCentered}>
            <Text style={[TextStyles.h1, TextStyles.uppercase]}>Sign Up</Text>
    
            {fields.map(({ key, placeholder, keyboardType, secureTextEntry }, index) => (
                <>
                <View key={index} style={style.passwordContainer}>
                    <TextInput
                        style={Styles.input}
                        placeholder={placeholder}
                        onChangeText={value => {
                            if (key === 'username') setUsername(value);
                            else if (key === 'firstName') setFirstName(value);
                            else if (key === 'lastName') setLastName(value);
                            else if (key === 'email') setEmail(value);
                            else if (key === 'password') setPassword(value);
                            else if (key === 'verifyPassword') setVerifyPassword(value);
                        }}
                        keyboardType={(keyboardType as KeyboardTypeOptions) || 'default'}
                        secureTextEntry={secureTextEntry ? passwordVisibility[key] : false}
                    />
                    {secureTextEntry && (
                        <TouchableOpacity
                            onPress={() => togglePasswordVisibility(key)}
                            style={style.icon}
                        >
                            <Ionicons
                                name={passwordVisibility[key] ? 'eye-off' : 'eye'}
                                size={24}
                                color={Colors.dark}
                            />
                        </TouchableOpacity>
                    )}  
                </View>
                {errors[key] && <Text style={[TextStyles.error, {marginTop:-10, marginBottom:10,}]}>{errors[key]}</Text>}
                </>
            ))}
    
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <TouchableOpacity 
                    style={[Styles.buttonDark, (username === "" || password === "") && Styles.buttonDisabled]} 
                    onPress={requestCreateUser} 
                    disabled={username == "" || firstName == ""|| lastName == "" || email == "" || password == ""|| verifyPassword == ""}
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
