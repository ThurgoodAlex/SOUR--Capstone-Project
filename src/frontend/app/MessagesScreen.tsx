import { Colors } from '@/constants/Colors';
import { NavBar } from '@/components/NavBar';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { MessageData, User } from '@/constants/Types';
import { useApi } from '@/context/api';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'expo-router/build/hooks';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View, StyleSheet, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { Message } from '@/components/Message';
import ProfileThumbnail from '@/components/ProfileThumbnail';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const INPUT_WIDTH = SCREEN_WIDTH - 80;

export default function MessagesScreen() {
    const api = useApi();
    const searchParams = useSearchParams();
    const chatParam = Number(searchParams.get('chatID'));
    const targetUserID = Number(searchParams.get('userID'));
    const [messages, setMessages] = useState<MessageData[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const [targetUser, setTargetUser] = useState<User | null>(null);
    const getUser = async () => {
        try {
            const response = await api.get(`/users/${targetUserID}/`);
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
                    headerBackButtonDisplayMode: 'minimal',
                    headerRight: () => (
                        <TouchableOpacity onPress={() => router.push('/CartScreen')}>
                            <Ionicons size={30} name="cart-outline" color="#692b20" />
                        </TouchableOpacity>
                    )
                }}
            />

            <View style={[Styles.column, {backgroundColor: Colors.light60, padding: 2, borderBottomColor: Colors.light, borderBottomWidth: 1, maxHeight:60}]}>
         
                {targetUser && <ProfileThumbnail user={targetUser} />}

            </View>
            
            <View style={ScreenStyles.screen}>
            <KeyboardAvoidingView
                style={{ flex: 1, alignSelf: 'flex-end' }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 180 : 0}
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
                <View style={[Styles.row, { alignItems: 'center', marginTop: 20, marginBottom: 20, width: SCREEN_WIDTH - 35 }]}>
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