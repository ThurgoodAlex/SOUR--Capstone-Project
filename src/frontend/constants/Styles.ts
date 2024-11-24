import { StyleSheet } from 'react-native';

export const Styles = StyleSheet.create({
    container: {
        flex: 1,
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
    buttonDark: {
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
        marginVertical: 10,
    },
    carouselItem: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginVertical: 10,
    },
    carouselImage: {
      width:400,
      height: 400,
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
        marginTop:8,
        marginBottom:18
        
    },
    icon: {
        flexDirection: 'column'
    },
    activeIcon: {
        borderTopWidth: 2,
        borderTopColor: '#000',
        backgroundColor: '#fff'
    },
});

export const ProfileStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
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



export const ListingStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'space-evenly',
        padding: 16
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },



    description: {
        fontSize: 16,
        color: '#666',
        lineHeight: 22,
        marginBottom: 8,
    },
    size: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e90ff',
    },



    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        textTransform: "uppercase",
    },
    imageUpload: {
        backgroundColor: '#e9e9e9',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 16,
    },
    uploadText: {
        color: '#aaa',
        fontSize: 16,
    },
    uploadedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    formGroup: {
        marginBottom: 16,
        flexDirection: 'row',
        gap: 8,
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
        marginBottom: 4,
        marginTop: 8,
    },
    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
        width: 260
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#1e90ff',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    submitButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
})



