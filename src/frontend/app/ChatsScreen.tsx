import { Chat } from '@/components/Chat';
import { NavBar } from '@/components/NavBar';
import { ScreenStyles } from '@/constants/Styles';
import { User, ChatData } from '@/constants/Types';
import { useApi } from '@/context/api';
import { useUser } from '@/context/user';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

export default function ChatsScreen() {
    const api = useApi();
    const {user} = useUser();
    const [chats, setChats] = useState<ChatData[]>([]);
    const getChats = async () => {
        try {
            const response = await api.get('/users/chats/');
            if (response.status === 200) {
                const chatData = await response.json();
                console.log("Chats retrived successfully.");
                
                setChats(chatData);
            } else {
                console.error("Chats retrival failed:", response);
            }
        } catch (error) {
            console.error('Chats retrival failed:', error);
        }
    };

    useEffect(() => {
        getChats();
    }, []);

    const renderChat = ({ item }: {item: ChatData}) => (
        <TouchableOpacity
            onPress={() => router.push({
                pathname: '/MessagesScreen',
                params: { chatID: item.id },
            })}>
            <Chat chat={item} />
        </TouchableOpacity>
        
      );
    return (
        <>
            <Stack.Screen
                name="ChatsScreen"
                options={{
                    headerRight: () => (
                        <TouchableOpacity onPress={() => router.push('/CartScreen')}>
                            <Ionicons size={30} name="cart-outline" color="#692b20" />
                        </TouchableOpacity>
                    ),
                    headerLeft: () => (
                        <Ionicons size={30} name="chevron-back-outline" color="#d8ccaf" />
                    )
                }}
            />
            <View style={ScreenStyles.screen}>
                {chats.length > 0 ? (
                    <FlatList
                        data={chats}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderChat}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ padding: 10 }}
                        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                        />
                    ) : (
                    <Text style={{ flex: 1 }}>
                        You have no chats, message a seller and reach out!
                    </Text>
                )}
            </View>
            <NavBar/>
        </>
        
    );
}
