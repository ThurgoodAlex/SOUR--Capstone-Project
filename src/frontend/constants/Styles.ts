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
    },


    carouselContainer: {
      flex: 1,
      alignItems: 'center',
      marginVertical: 20,
    },
    carouselImage: {
      width:400,
      height: 600,
      marginHorizontal: 10,
      borderRadius: 10,
    },

    gridContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      flexWrap: 'wrap'
    },
    postPreview: {
        flexDirection: 'column',
        margin: 5
    },
    imagePreview: {
        height: 175,
        width: 175
    },
    iconOverlay: {
        position: 'absolute',
        top: 10,
        right: 10,
    }
  });

  export const NavBarStyles = StyleSheet.create({
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 5
    },
    icon: {
        flexDirection: 'column'
    },
    activeIcon: {
        color: '#000',
        borderTopWidth: 2,
        borderTopColor: '#000',
      },
  });

  export const ProfileStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingHorizontal: 16,
      paddingVertical: 10,
      alignItems: 'center',
    },
    cartIcon: {
      fontSize: 20,
      textAlign: 'right'
    },
    profileSection: {
      alignItems: 'center',
      marginTop: 10,
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    username: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 8,
    },
    location: {
      fontSize: 14,
      color: '#888',
      marginTop: 4,
    },
    statsSection: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 16,
      marginBottom: 10,
    },
    stat: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    statLabel: {
      fontSize: 14,
      color: '#888',
    },
    tabs: {
      flexDirection: 'row',
      justifyContent: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    tab: {
      fontSize: 16,
      paddingVertical: 10,
      paddingHorizontal: 20,
      color: '#888',
    },
    activeTab: {
      color: '#000',
      borderBottomWidth: 2,
      borderBottomColor: '#000',
    },
    postsGrid: {
      paddingHorizontal: 10,
      paddingTop: 10,
    },
    postContainer: {
      flex: 1,
      margin: 5,
      position: 'relative',
    },
   thumbnailImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
   },
   thumbnailContainer: {
      flexDirection: 'row',
      paddingLeft: 15,
   },
   thumbnailName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 2,
    marginLeft: 5,
   },
   thumbnailUsername: {
    fontSize: 12,
    marginLeft: 5,
   }

    

  })



   

