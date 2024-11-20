import React, { useState } from 'react';
import { View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { NavBarStyles } from '@/constants/Styles';


export function NavBar() {
  const [activePage, setActivePage] = useState('DiscoverScreen');

  const handleNavigation = (page: string) => {
    setActivePage(page);
    try{
        // @ts-ignore
        router.replace(`/${page}`);
    }
    catch{
        router.push('/+not-found')
    }
    
  };

  return (
    <View style={NavBarStyles.navBar}>
      <Ionicons
        style={[
          NavBarStyles.icon,
          activePage === 'DiscoverScreen' && NavBarStyles.activeIcon,
        ]}
        size={40}
        name="home"
        onPress={() => handleNavigation('DiscoverScreen')}
      />
      <Ionicons
        style={[NavBarStyles.icon, activePage === 'VideosScreen' && NavBarStyles.activeIcon]}
        size={40}
        name="film"
        onPress={() => handleNavigation('VideosScreen')}
      />
      <Ionicons
        style={[NavBarStyles.icon, activePage === 'SellerScreen' && NavBarStyles.activeIcon]}
        size={40}
        name="add-circle-outline"
        onPress={() => handleNavigation('SellerScreen')}
      />
      <Ionicons
        style={[NavBarStyles.icon, activePage === 'MessagesScreen' && NavBarStyles.activeIcon]}
        size={40}
        name="chatbubbles"
        onPress={() => handleNavigation('MessagesScreen')}
      />
      <Ionicons
        style={[NavBarStyles.icon, activePage === 'ProfileScreen' && NavBarStyles.activeIcon]}
        size={40}
        name="person"
        onPress={() => handleNavigation('ProfileScreen')}
      />
    </View>
  );
}