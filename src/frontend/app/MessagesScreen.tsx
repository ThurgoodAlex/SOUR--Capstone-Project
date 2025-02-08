import { Chat } from '@/components/Chat';
import { NavBar } from '@/components/NavBar';
import { ScreenStyles } from '@/constants/Styles';
import { User, MessageData } from '@/constants/Types';
import { useApi } from '@/context/api';
import { useUser } from '@/context/user';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'expo-router/build/hooks';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Message } from '@/components/Message';

export default function MessagesScreen() {
    const api = useApi();
    const searchParams = useSearchParams();
    const chatParam = Number(searchParams.get('chatID'));
    const [messages, setMessages] = useState<MessageData[]>([]);

    const getMessages = async () => {
        try {
            const response = await api.get(`/chats/${chatParam}/messages/`);
            if (response.ok) {
                const messageData = await response.json();
                console.log("Messages retrived successfully.");
                
                setMessages(messageData);
            } else {
                console.error("Messages retrival failed:", response);
            }
        } catch (error) {
            console.error('Messages retrival failed:', error);
        }
    };

    useEffect(() => {
        getMessages();
    }, []);

    const renderMessage = ({ item }: {item: MessageData}) => (
        <Message message={item} authorID={item.author} chatID={chatParam} />
      );
      
    return (
        <>
            <Stack.Screen
                name="MessagesScreen"
                options={{
                    headerRight: () => (
                        <TouchableOpacity onPress={() => router.push('/CartScreen')}>
                            <Ionicons size={30} name="cart-outline" color="#692b20" />
                        </TouchableOpacity>
                    )
                }}
            />
            <View style={ScreenStyles.screen}>
                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderMessage}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ padding: 10 }}
                    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    />
            </View>
            <NavBar/>
        </>
        
    );
}
