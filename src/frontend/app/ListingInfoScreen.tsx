import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { ProfileStyles } from '@/constants/Styles';
import ProfileThumbnail from '@/components/ProfileThumbnail';
import PhotoCarousel from '@/components/PhotoCarousel';

export default function ListingInfoScreen() {
  const listing = [];
  const [liked, setLike] = useState(false);

  const images = ["sweater1.png", "sweater2.png","sweater3.png","sweater4.png"]

  return (
    <View style={ProfileStyles.container}>
        <TopBar />
        <PhotoCarousel {...images} />
        <ProfileThumbnail />
        <Description />
    
    </View>
  );
}

function TopBar() {
  return (
    <View style={ProfileStyles.topBar}>
      <TouchableOpacity>
        <Text style={ProfileStyles.cartIcon}>🛒</Text>
      </TouchableOpacity>
    </View>
  );
}



function Description() {
  return (
    <View style={ProfileStyles.statsSection}>
      
    </View>
  );
}






