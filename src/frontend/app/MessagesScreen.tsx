import { Colors } from '@/constants/Colors';
import { NavBar } from '@/components/NavBar';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { MessageData } from '@/constants/Types';
import { useApi } from '@/context/api';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'expo-router/build/hooks';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Message } from '@/components/Message';

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
        name="MessagesScreen"
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/CartScreen')}>
              <Ionicons size={30} name="cart-outline" color="#692b20" />
            </TouchableOpacity>
          )
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={ScreenStyles.screen}>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMessage}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            inverted={true}
          />
          <View style={[Styles.row, { alignSelf: 'baseline', alignContent: 'center' }]}>
            <TextInput
              style={MessageScreenStyles.input}
              placeholder="Message"
              value={newMessage}
              onChangeText={setNewMessage}
              multiline={true}
            />
            <TouchableOpacity
              style={[Styles.buttonDark,
                (loading || !newMessage.trim()) && Styles.buttonDisabled]}
              onPress={sendMessage}
              disabled={loading || !newMessage.trim()}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={TextStyles.light}>Send</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <NavBar />
      </KeyboardAvoidingView>
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
    marginRight: 4.5,
    maxHeight: 120
  },
});
