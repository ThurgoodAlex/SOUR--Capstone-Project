import { Collapsible } from '@/components/Collapsible';
import { StyleSheet } from 'react-native';

const dark = '#692b20';
const dark60 = '#692b2060';
const light = '#d8ccaf';
const light60 = '#d8ccaf60';
const grapefruit = '#f98b69';
const yellow = '#ffdb32';
const orange = '#f9b032'
const green = '#7e9151';
const white = '#f7f3ea';
const black = '#000000';


export const ScreenStyles = StyleSheet.create({
  screenCentered: {
    flex: 1,
    justifyContent: 'center',
    padding: 18,
    backgroundColor: white,
  },
  screen: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 18,
    backgroundColor: white,
  },
});

export const TextStyles = StyleSheet.create({
  center:{
    textAlign: 'center',
  },
  uppercase:{
    textTransform: "uppercase",
  },

  h1: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  h2: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#222',
    },
  h3: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#222',
  },
  p:{
    fontSize: 16,
      color: '#666', 
      lineHeight: 22,
      marginBottom: 8,
  },
  small:{
    fontSize:11,
  },
  light: {
    color: light,
    fontWeight: 'bold',
  },
  dark: {
      color: dark,
      fontWeight: 'bold',
  },


});



export const Styles = StyleSheet.create({
    
    input: {
        borderWidth: 1,
        borderColor: dark,
        backgroundColor: white,
        width: '100%',
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 16,
    },
    buttonLight: {
        backgroundColor: light,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
        justifyContent:'space-around'
    },
    buttonDark: {
        backgroundColor: dark,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
        justifyContent:'space-around'
       
    },

    buttonDisabled: {
        backgroundColor: dark60,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
        justifyContent:'space-around'
       
    },

    collapsibleLight: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: light60,
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },

    collapsibleDark: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: dark60,
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    
    row:{
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    column: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start', 
    },

    center: {
      alignItems:'center',
    },

    alignLeft: {
      alignItems:'flex-start',
    },

    alignRight: {
      alignItems:'flex-end',
    },

    grid: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      flexWrap: 'wrap'
    },

    image: {
      width: 250,
      height: 250,
      borderRadius: 8,
      marginRight: 8,
      marginBottom: 16,
    },
});

  




   




  


   

