import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { Stack, router } from 'expo-router';
import { useApi } from '@/context/api';
import { useUser } from '@/context/user';
import { useAuth } from '@/context/auth';
import { User } from '@/constants/Types';
import Collapsible from 'react-native-collapsible';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';


export default function SettingsScreen() {
    const { user, setUser } = useUser();
    const { logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [verified, setVerified] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const api = useApi();

    const verifyPassword = async () => {
        try {
            const response = await api.post('/auth/verifypassword/', { "password": oldPassword });

            if (response.ok) {
                console.log("Password verified successfully.");
                setVerified(true);
            } else {
                console.error("Verification failed:", response);
            }
        } catch (error) {
            console.error('Error verifying password:', error);
        }
    };

    const changePassword = async () => {
        try {
            const response = await api.put('/auth/changepassword/', { "password": newPassword });

            if (response.ok) {
                console.log("Password changed successfully.");
            } else {
                console.error("Password change failed:", response);
            }
        } catch (error) {
            console.error('Error changing password:', error);
        }
    };

    const becomeSeller = async () => {
        setLoading(true);
        try {
            const response = await api.put('/users/becomeseller/');

            if (response.ok) {
                const result = await response.json();
                console.log("User updated to seller:", result);
                setUser((prevUser: User | null) => ({
                    ...prevUser!,
                    isSeller: true,
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
            router.replace("/SellerScreen");
        }
    };

    const unregisterSeller = async () => {
        Alert.alert(
            'Unregister as a Seller',
            'Are you sure you want to unregister as a seller?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Confirm',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const response = await api.put('/users/unregisterseller/');

                            if (response.ok) {
                                const result = await response.json();
                                console.log("User unregistered as seller:", result);
                                setUser((prevUser: User | null) => ({
                                    ...prevUser!,
                                    isSeller: false,
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
                    }
                }
            ],
            { cancelable: false }
        );
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

                            if (response.ok) {
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
                    headerTitle: "Settings",
                    headerRight: () => ""
                }}

            />
            <View style={ScreenStyles.screenCentered}>
                <View style={{ justifyContent: 'flex-start' }}>
                    <Text style={TextStyles.dark}>username: {user?.username}</Text>
                    <Text style={TextStyles.dark}>email: {user?.email}</Text>
                    <TouchableOpacity
                        style={Styles.collapsibleLight}
                        onPress={() => setIsCollapsed(!isCollapsed)}
                        disabled={loading}
                    >
                        <Text style={TextStyles.dark}>Reset Password</Text>
                        {isCollapsed ? (
                            <Ionicons style={TextStyles.dark} size={16} name='chevron-forward-outline' />
                        ) : (
                            <Ionicons style={TextStyles.dark} size={16} name='chevron-down-outline' />
                        )}
                    </TouchableOpacity>
                    <Collapsible style={[Styles.column, { borderColor: '#d8ccaf60' }]} collapsed={isCollapsed}>
                        <Text style={TextStyles.dark}>Verify Password:</Text>
                        <TextInput
                            style={Styles.input}
                            placeholder="Password"
                            value={oldPassword}
                            onChangeText={setOldPassword}
                        />
                        <TouchableOpacity
                            style={[
                                Styles.buttonDark,
                                (loading || !oldPassword.trim()) && Styles.buttonDisabled,
                            ]}
                            onPress={() => verifyPassword()}
                            disabled={loading || !oldPassword.trim()}
                        >
                            {loading ? (
                                <ActivityIndicator color={Colors.orange} />
                            ) : (
                                <Text style={TextStyles.light}>Verify</Text>
                            )}
                        </TouchableOpacity>
                        <Text style={TextStyles.dark}>New Password:</Text>
                        <TextInput
                            style={Styles.input}
                            placeholder="Password"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            editable={verified}
                        />
                        <TouchableOpacity
                            style={[
                                Styles.buttonDark,
                                (loading || !newPassword.trim()) && Styles.buttonDisabled,
                            ]}
                            onPress={changePassword}
                            disabled={loading || !newPassword.trim()}
                        >
                            {loading ? (
                                <ActivityIndicator color={Colors.orange} />
                            ) : (
                                <Text style={TextStyles.light}>Confirm</Text>
                            )}
                        </TouchableOpacity>
                    </Collapsible>
                </View>
                <TouchableOpacity
                    style={Styles.buttonDark}
                    onPress={logout}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={Colors.orange} />
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
                            <ActivityIndicator color={Colors.orange} />
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
                            <ActivityIndicator color={Colors.orange} />
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
                        <ActivityIndicator color={Colors.orange} />
                    ) : (
                        <Text style={TextStyles.light}>Delete Account</Text>
                    )}
                </TouchableOpacity>
            </View>
        </>
    );
}
