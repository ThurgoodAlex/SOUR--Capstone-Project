import { StyleSheet } from 'react-native';



export const ScreenStyles = StyleSheet.create({
  screenCentered: {
    flex: 1,
    justifyContent: 'center',
    padding: 18,
    backgroundColor: '#f5f5f5',
  },
  screen: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 18,
    backgroundColor: '#f5f5f5',
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
    fontSize:10,
  },
  light: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dark: {
      color: '#000',
      fontWeight: 'bold',
  },


});



export const Styles = StyleSheet.create({
    
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
        justifyContent:'space-around'
    },
    buttonDark: {
        backgroundColor: '#454545',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
        justifyContent:'space-around'
       
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

  




   




  


   

