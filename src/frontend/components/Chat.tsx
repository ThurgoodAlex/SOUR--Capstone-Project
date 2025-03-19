import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Styles, TextStyles } from '@/constants/Styles';
import { ChatData, User } from '@/constants/Types';
import { useEffect, useState } from 'react';
import { useUser } from '@/context/user';
import { useApi } from '@/context/api';
import { router } from 'expo-router';

export function Chat({ chat }: { chat: ChatData }) {
    const {user} = useUser();
    const api = useApi();
    let targetUserId;
    const [targetUser, setTargetUser] = useState<User | null>(null);

    if (chat?.recipientID === user?.id) {
        targetUserId=chat.senderID;
    } else {
        targetUserId=chat.recipientID;
    }

    const getUser = async () => {
        try {
            const response = await api.get(`/users/${targetUserId}/`);
            if (response.ok) {
                const userData = await response.json();
                console.log("User retrived successfully.");
                setTargetUser(userData);
            } else {
                console.error("User retrival failed:", response);
            }
        } catch (error) {
            console.error('User retrival failed:', error);
        }
    };
    useEffect(() => {
        getUser();
    }, []);
    return (
        <TouchableOpacity
            style={ChatProfileStyles.chat}
            onPress={() => router.push({
                pathname: '/MessagesScreen',
                params: { chatID: chat.id, userID: targetUser?.id },
        })}>
            <View style={[Styles.row, {justifyContent: 'space-between'}]}>
                <Image
                    source={require('../assets/images/profile_pic.jpg')}
                    style={ChatProfileStyles.profileImage}
                />
                <View style={Styles.column}>
                    <Text style={[TextStyles.dark, TextStyles.h3, {textAlign:'right'}]}>{targetUser?.firstname} {targetUser?.lastname}</Text>
                    <Text style={[TextStyles.dark, {textAlign:'right'}]}>{targetUser?.username}</Text>
                </View>
            </View>
            
            </TouchableOpacity>
    );
};

const ChatProfileStyles = StyleSheet.create({
    chat: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        shadowColor: '#692b20',
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 0 },
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    }
});