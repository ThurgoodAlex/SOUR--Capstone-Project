import { View, Image, StyleSheet, Text } from 'react-native';
import { Styles, TextStyles } from '@/constants/Styles';
import { MessageData, User } from '@/constants/Types';
import { useEffect, useState } from 'react';
import { useApi } from '@/context/api';
import { useUser } from '@/context/user';

export function Message({ message, authorID }: { message: MessageData, authorID: number }) {
    const {user} = useUser();
    let isUser;

    if (user?.id == authorID) {
        isUser = true;
    } else {
        isUser = false;
    }

    return (
        <View style={Styles.row}>
            <Text style={isUser ? (MessageProfileStyles.myMessage) : (MessageProfileStyles.theirMessage)}>
                {message.message}
            </Text>
            <View style={[Styles.row, {justifyContent: 'space-between', width: '60%'}]}>
                <Text style={TextStyles.dark}>{message.author}</Text>
                <Text style={TextStyles.dark}>{message.created_at.toDateString()}</Text>  
            </View>
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