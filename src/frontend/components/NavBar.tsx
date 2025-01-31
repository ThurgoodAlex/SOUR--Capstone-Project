import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { usePathname, router } from 'expo-router';

export function NavBar() {
    const pathname = usePathname(); // Get the current route name dynamically.

    const handleNavigation = (page: string) => {
        if (pathname !== `/${page}`) {
            try {
                //@ts-ignore
                router.replace(`/${page}`);
            } catch {
                router.push('/+not-found');
            }
        }
    };

    const NavBarStyles = StyleSheet.create({
        navBar: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 16,
            backgroundColor: '#f5f5f5',
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

    return (
        <View style={NavBarStyles.navBar}>
            <Ionicons
                style={[
                    NavBarStyles.icon,
                    pathname === '/DiscoverScreen' && NavBarStyles.activeIcon,
                ]}
                size={32}
                name="home"
                onPress={() => handleNavigation('DiscoverScreen')}
            />
            <Ionicons
                style={[
                    NavBarStyles.icon,
                    pathname === '/VideosScreen' && NavBarStyles.activeIcon,
                ]}
                size={32}
                name="film"
                onPress={() => handleNavigation('VideosScreen')}
            />
            <Ionicons
                style={[
                    NavBarStyles.icon,
                    pathname === '/SellerScreen' && NavBarStyles.activeIcon,
                ]}
                size={32}
                name="add-circle-outline"
                onPress={() => handleNavigation('SellerScreen')}
            />
            <Ionicons
                style={[
                    NavBarStyles.icon,
                    pathname === '/MessagesScreen' && NavBarStyles.activeIcon,
                ]}
                size={32}
                name="chatbubbles"
                onPress={() => handleNavigation('MessagesScreen')}
            />
            <Ionicons
                style={[
                    NavBarStyles.icon,
                    pathname === '/SelfProfileScreen' && NavBarStyles.activeIcon,
                ]}
                size={32}
                name="person"
                onPress={() => handleNavigation('SelfProfileScreen')}
            />
           
        </View>
    );
}
