import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export const Styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
      backgroundColor: '#f5f5f5',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
      color: '#333',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#222',
      },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      backgroundColor: '#fff',
      padding: 12,
      borderRadius: 8,
      fontSize: 16,
      marginBottom: 16,
    },
    buttonLight: {
      backgroundColor: '#D3D3D3',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 16,
    },
    buttonDark:{
      backgroundColor: '#454545',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 16,
    },
    buttonTextLight: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    buttonTextDark: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    }
  });