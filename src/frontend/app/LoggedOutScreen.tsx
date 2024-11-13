import { Styles } from '@/constants/Styles';
import { Link, router } from 'expo-router';
import { Button, View, Text, TouchableOpacity } from 'react-native';

export default function LoggedOutScreen() {

  
  return (
    <View style={Styles.container}>
      <Text style={Styles.subtitle}>SOUR</Text>

      <TouchableOpacity
        style={Styles.buttonLight}
        onPress={() => router.push('/SignUpScreen')}
      >
      <Text style={Styles.buttonTextDark}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={Styles.buttonDark}
        onPress={() => router.push('/LoginScreen')}
      >
      <Text style={Styles.buttonTextLight}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}
