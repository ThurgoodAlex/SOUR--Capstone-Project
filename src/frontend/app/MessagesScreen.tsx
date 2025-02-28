import { Colors } from '@/constants/Colors';
import { NavBar } from '@/components/NavBar';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { MessageData } from '@/constants/Types';
import { useApi } from '@/context/api';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'expo-router/build/hooks';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View, StyleSheet, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { Message } from '@/components/Message';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const INPUT_WIDTH = SCREEN_WIDTH - 80;

export default function MessagesScreen() {
    const api = useApi();
    const searchParams = useSearchParams();
    const chatParam = Number(searchParams.get('chatID'));
    const [messages, setMessages] = useState<MessageData[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const getMessages = async () => {
        try {
            const response = await api.get(`/chats/${chatParam}/messages/`);
            if (response.ok) {
                const messageData = await response.json();
                console.log("Messages retrieved successfully.");
                setMessages(messageData.map((message: MessageData) => ({
                    ...message,
                    created_at: new Date(message.created_at),
                })));
            } else {
                console.error("Messages retrieval failed:", response);
            }
        } catch (error) {
            console.error('Messages retrieval failed:', error);
        }
    };

    useEffect(() => {
        getMessages();
    }, []);

    const renderMessage = ({ item }: { item: MessageData }) => (
        <Message message={item} authorID={item.author} />
    );

    const sendMessage = async () => {
        setLoading(true);
        try {
            const response = await api.post(`/chats/${chatParam}/messages/`, {
                message: newMessage,
            });
            if (response.ok) {
                console.log("Message sent successfully.");
                setNewMessage('');
                await getMessages();
            } else {
                console.error("Message sending failed:", response);
            }
        } catch (error) {
            console.error('Message sending failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerRight: () => (
                        <TouchableOpacity onPress={() => router.push('/CartScreen')}>
                            <Ionicons size={30} name="cart-outline" color="#692b20" />
                        </TouchableOpacity>
                    )
                }}
            />
            <View style={ScreenStyles.screen}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderMessage}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    inverted={true}
                />
                <View style={[Styles.row, { alignItems: 'center', marginTop: 20, marginBottom: 20 }]}>
                    <TextInput
                        style={MessageScreenStyles.input}
                        placeholder="Message"
                        value={newMessage}
                        onChangeText={setNewMessage}
                        multiline={true}
                    />
                    <TouchableOpacity
                        style={[
                            Styles.buttonDark,
                            { width: 70, height: 50, marginBottom:0 },
                            (loading || !newMessage.trim()) && Styles.buttonDisabled,
                        ]}
                        onPress={sendMessage}
                        disabled={loading || !newMessage.trim()}
                    >
                        {loading ? (
                            <ActivityIndicator color={Colors.orange} />
                        ) : (
                            <Text style={TextStyles.light}>Send</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
            </View>
            <NavBar />

        </>
    );
}

const MessageScreenStyles = StyleSheet.create({
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.dark,
        backgroundColor: Colors.white,
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        width: INPUT_WIDTH,
        minHeight: 50,
        marginRight: 4.5,
        maxHeight: 120
    },
});