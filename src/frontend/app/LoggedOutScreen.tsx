import BackendData from '@/components/BackendData';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { Link, router } from 'expo-router';
import { Button, View, Text, TouchableOpacity } from 'react-native';

export default function LoggedOutScreen() {

  
  return (
    <View style={ScreenStyles.screenCentered}>
      <TouchableOpacity
        style={Styles.buttonDark}
        onPress={() => router.push('/LoginScreen')}
      >
      <Text style={TextStyles.light}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={Styles.buttonLight}
        onPress={() => router.push('/SignUpScreen')}
      >
      <Text style={TextStyles.dark}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}
