import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { Stack, router } from 'expo-router';
import { useApi } from '@/context/api'; 
import { useUser } from '@/context/user';
import { useAuth } from '@/context/auth';
import { User } from '@/constants/Types';


export default function SettingsScreen() {
    const {user, setUser} = useUser();
    const { logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const api = useApi();

    const becomeSeller = async () => {
        setLoading(true);
        try {
            const response = await api.put('/users/becomeseller/');
            
            if (response.status === 200) {
                const result = await response.json();
                console.log("User updated to seller:", result);
                setUser((prevUser: User | null) => ({
                    ...prevUser!,
                    isSeller: true, // Update the `isSeller` flag
                    }));
            } else {
                console.error("Unexpected response:", response);
                Alert.alert('Error', 'Failed to update user to seller.');
            }
        } catch (error) {
            console.error('Error becoming seller:', error);
            Alert.alert('Error', 'Failed to connect to the server. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const unregisterSeller = async () => {
        setLoading(true);
        try {
            const response = await api.put('/users/unregisterseller/');
            
            if (response.status === 200) {
                const result = await response.json();
                console.log("User unregistered as seller:", result);
                setUser((prevUser: User | null) => ({
                    ...prevUser!,
                    isSeller: false, // Update the `isSeller` flag
                    }));
            } else {
                console.error("Unexpected response:", response);
                Alert.alert('Error', 'Failed to update user.');
            }
        } catch (error) {
            console.error('Error unregistering seller:', error);
            Alert.alert('Error', 'Failed to connect to the server. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const deleteAccount = async () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account? This action cannot be undone.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Confirm',
                    onPress: async () => {
                        try {
                            const response = await api.put('/users/deleteuser/');
                            
                            if (response.status === 200) {
                                const result = await response.json();
                                console.log("User account deleted:", result);
                                router.replace("/SignUpScreen");
                            } else {
                                console.error("Unexpected response:", response);
                                Alert.alert('Error', 'Failed to delete user.');
                            }
                        } catch (error) {
                            console.error('Error deleting user:', error);
                            Alert.alert('Error', 'Failed to connect to the server. Please check your connection.');
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };
    

    return (
        <>
            <Stack.Screen
                options={{
                    title: "SettingsScreen",
                }}
            />
            <View style={ScreenStyles.screenCentered}>
                <TouchableOpacity
                    style={Styles.buttonDark}
                    onPress={logout}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <Text style={TextStyles.light}>Logout</Text>
                    )}
                </TouchableOpacity>
                {user?.isSeller ? (
                    <TouchableOpacity
                    style={Styles.buttonDark}
                    onPress={unregisterSeller}
                    disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text style={TextStyles.light}>Cancel Seller Plan</Text>
                        )}
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                    style={Styles.buttonDark}
                    onPress={becomeSeller}
                    disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text style={TextStyles.light}>Become a Seller</Text>
                        )}
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={Styles.buttonDark}
                    onPress={deleteAccount}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <Text style={TextStyles.light}>Delete Account</Text>
                    )}
                </TouchableOpacity>
            </View>
        </>
    );
}
