import { StyleSheet } from 'react-native';
import { Colors } from './Colors';


export const ScreenStyles = StyleSheet.create({
    screenCentered: {
        flex: 1,
        justifyContent: 'center',
        padding: 18,
        backgroundColor: Colors.white,
    },
    screen: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 18,
        backgroundColor: Colors.white,
    },
});

export const TextStyles = StyleSheet.create({
    center: {
        textAlign: 'center',
    },
    uppercase: {
        textTransform: "uppercase",
    },
  h3: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: Colors.dark,
  },
  h3Light: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: Colors.light,
  },
  p:{
    fontSize: 16,
      color: Colors.dark, 
      lineHeight: 22,
      marginBottom: 8,
      fontWeight: 300,
  },
  bold:{
    fontWeight: 500,
  },
  small:{
    color: Colors.dark, 
    fontSize: 11,
    marginBottom: 8,
  },
  smallLight:{
    color: Colors.light,
    fontSize: 11,
    marginBottom: 8,
  },
  light: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  dark: {
      color: Colors.dark,
      fontWeight: 'bold',
  },
  error: {
    fontSize:11,
    color:Colors.grapefruit,
    fontWeight: 'bold'
  },

    h1: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
        color: Colors.dark,
    },
    h2: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: Colors.dark,
    },
   

    required: {
        fontSize:11,
        color:Colors.dark60,
    }

});



export const Styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: Colors.dark,
        backgroundColor: Colors.white,
        width:'100%',
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 16,
    },
    buttonLight: {
        backgroundColor: Colors.light,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
        justifyContent: 'space-around'
    },
    buttonDark: {
        backgroundColor: Colors.dark,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
        justifyContent: 'space-around'

    },

    buttonDisabled: {
        backgroundColor: Colors.dark60,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'space-around'

    },

    collapsibleLight: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.light60,
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },

    collapsibleDark: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.dark60,
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },

    row: {
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
        alignItems: 'center',
    },

    alignLeft: {
        alignItems: 'flex-start',
    },

    alignRight: {
        alignItems: 'flex-end',
    },

    grid: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap'
    },

    image: {
        width: 220,
        height: 220,
        borderRadius: 8,
        marginRight: 8,
        marginBottom: 16,
    },
});
