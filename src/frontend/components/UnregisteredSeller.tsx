import { Colors } from '@/constants/Colors';
import { Styles, TextStyles } from '@/constants/Styles';
import { User } from '@/constants/Types';
import { api, useApi } from '@/context/api';
import { useUser } from '@/context/user';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity } from 'react-native';

export function UnregisteredSeller() {
    const [loading, setLoading] = useState(false);
    const api = useApi();
    const { setUser } = useUser();
    
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
    return (
        <>
            <Text style={TextStyles.h1}>Start Selling on SOUR</Text>
            <Text style={TextStyles.p}>Your style, your community, your impact</Text>
            <TouchableOpacity
                style={Styles.buttonDark}
                onPress={becomeSeller}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color={Colors.orange} />
                ) : (
                    <Text style={TextStyles.light}>Sign Up</Text>
                )}
            </TouchableOpacity>
        </>
        
    );
}
