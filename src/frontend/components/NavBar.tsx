import React from 'react';
import { View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { usePathname, router } from 'expo-router';
import { NavBarStyles } from '@/constants/Styles';

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
          pathname === '/ProfileScreen' && NavBarStyles.activeIcon,
        ]}
        size={32}
        name="person"
        onPress={() => handleNavigation('ProfileScreen')}
      />
    </View>
  );
}
