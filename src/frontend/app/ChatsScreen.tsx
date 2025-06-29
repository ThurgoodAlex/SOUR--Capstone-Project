import { Chat } from '@/components/Chat';
import { NavBar } from '@/components/NavBar';
import { ScreenStyles, TextStyles } from '@/constants/Styles';
import { User, ChatData } from '@/constants/Types';
import { useApi } from '@/context/api';
import { useUser } from '@/context/user';
import { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

export default function ChatsScreen() {
    const api = useApi();
    const {user} = useUser();
    const [chats, setChats] = useState<ChatData[]>([]);

    const getChats = async () => {
        try {
            const response = await api.get(`/users/${user?.id}/chats/`);
            if (response.ok) {
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
        <Chat chat={item} />
    );
    return (
        <>
            <View style={ScreenStyles.screen}>
                <Text style={[TextStyles.h2, TextStyles.uppercase]}>
                    Your Chats
                </Text>
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
