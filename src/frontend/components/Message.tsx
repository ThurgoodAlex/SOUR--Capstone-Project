import { View, Image, StyleSheet, Text } from 'react-native';
import { Styles, TextStyles } from '@/constants/Styles';
import { MessageData, User } from '@/constants/Types';
import { useUser } from '@/context/user';
import { Colors } from 'react-native/Libraries/NewAppScreen';

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
            <Text style={isUser ? (MessageStyles.myMessage) : (MessageStyles.theirMessage)}>
                {message.message}
            </Text>
            <View style={[Styles.row, {justifyContent: 'space-between', width: '60%'}]}>
                <Text style={TextStyles.dark}>{message.author}</Text>
                <Text style={TextStyles.dark}>{message.created_at.toLocaleDateString()}</Text>  
            </View>
        </View>
    );
};

const MessageStyles = StyleSheet.create({
    myMessage: {
        flexDirection: 'row',
        width: '60%',
        justifyContent: 'flex-end',
        backgroundColor: Colors.grapefruit,
        padding: 16,
        borderRadius: 8,
    },
    theirMessage: {
        flexDirection: 'row',
        width: '60%',
        justifyContent: 'flex-start',
        backgroundColor: Colors.green,
        padding: 16,
        borderRadius: 8,
    }
});