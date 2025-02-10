import { View, Image, StyleSheet, Text } from 'react-native';
import { Styles, TextStyles } from '@/constants/Styles';
import { MessageData, User } from '@/constants/Types';
import { useUser } from '@/context/user';
import { Colors } from '@/constants/Colors';
import { useEffect, useState } from 'react';
import { useApi } from '@/context/api';

export function Message({ message, authorID }: { message: MessageData, authorID: number }) {
    const api = useApi();
    const {user} = useUser();
    const [author, setAuthor] = useState<User>();
    let isUser;

    if (user?.id == authorID) {
        isUser = true;
    } else {
        isUser = false;
    }

    const getAuthor = async () => {
        try {
            const response = await api.get(`/users/${authorID}/`);
            if (response.ok) {
                const authorData = await response.json();
                console.log("User retrived successfully.");
                setAuthor(authorData);
            } else {
                console.error("User retrival failed:", response);
            }
        } catch (error) {
            console.error('User retrival failed:', error);
        }
    };

    useEffect(() => {
        getAuthor();
    }, []);

    return (
        <View style={Styles.column}>
            <Text style={isUser ? (MessageStyles.myMessage) : (MessageStyles.theirMessage)}>
                {message.message}
            </Text>
            <View style={[Styles.row, {justifyContent: 'space-between', marginBottom: 8}]}>
                <Text style={TextStyles.small}>{author?.username}</Text>
                <Text style={TextStyles.small}>{message.created_at.toLocaleTimeString()}</Text>  
            </View>
        </View>
    );
};

const MessageStyles = StyleSheet.create({
    myMessage: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        backgroundColor: Colors.grapefruit,
        padding: 16,
        borderRadius: 8,
    },
    theirMessage: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: Colors.green,
        padding: 16,
        borderRadius: 8,
    }
});