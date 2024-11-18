import { Styles } from '@/constants/Styles';
import { Link, router } from 'expo-router';
import { Button, View, Text, TouchableOpacity } from 'react-native';

export default function LoggedOutScreen() {

  
  return (
    <View style={Styles.container}>
      <TouchableOpacity
        style={Styles.buttonDark}
        onPress={() => router.push('/ProfileScreen')}
      >
      <Text style={Styles.buttonTextLight}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={Styles.buttonLight}
        onPress={() => router.push('/SignUpScreen')}
      >
      <Text style={Styles.buttonTextDark}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}
