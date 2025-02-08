import { View, Image, StyleSheet, Text } from 'react-native';
import { Styles, TextStyles } from '@/constants/Styles';
import { MessageData, User } from '@/constants/Types';
import { useEffect, useState } from 'react';
import { useApi } from '@/context/api';
import { useUser } from '@/context/user';

export function Message({ message, authorID, chatID }: { message: MessageData, authorID: number, chatID: number }) {
    const api = useApi();
    const {user} = useUser();
    let isUser;

    if (user?.id == authorID) {
        isUser = true;
    } else {
        isUser = false;
    }

    const getMessage = async () => {
        try {
            const response = await api.get(`/chats/${chatID}/messages/`);
            if (response.ok) {
                const messageData = await response.json();
                console.log("User retrived successfully.");
            } else {
                console.error("User retrival failed:", response);
            }
        } catch (error) {
            console.error('User retrival failed:', error);
        }
    };

    useEffect(() => {
        getMessage();
    }, []);

    return (
        <View style={MessageProfileStyles.myMessage}>
            <Text style={isUser ? (MessageProfileStyles.myMessage) : (MessageProfileStyles.theirMessage)}>
                {message.message}
            </Text>
        </View>
    );
};

const MessageProfileStyles = StyleSheet.create({
    myMessage: {
        flexDirection: 'row',
        width: '60%',
        justifyContent: 'flex-end',
        backgroundColor: '#f98b69',
        padding: 16,
        borderRadius: 8,
    },
    theirMessage: {
        flexDirection: 'row',
        width: '60%',
        justifyContent: 'flex-start',
        backgroundColor: '#7e9151',
        padding: 16,
        borderRadius: 8,
    }
});