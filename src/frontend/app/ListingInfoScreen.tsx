import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { ListingStyles } from '@/constants/Styles';
import ProfileThumbnail from '@/components/ProfileThumbnail';
import PhotoCarousel from '@/components/PhotoCarousel';

export default function ListingInfoScreen() {
  const [liked, setLike] = useState(false);

  const images = ["sweater1.png", "sweater2.png","sweater3.png","sweater4.png"]

  const listing = {
    title: "CozySky Blue Sweater",
    description: "Wrap yourself in comfort and style with this soft blue sweater.",
    size: "Medium",
    price: "$59.99",
  };

  return (
    <View style={ListingStyles.container}>
      <PhotoCarousel {...images} />
      <ProfileThumbnail />
      <ListingInfo listing={listing} />
    
    </View>
  );
}

function ListingInfo({ listing }: { listing: { title: string; price: string ;description: string; size: string;} }) {
  return (
    <>
      <View style={ListingStyles.titleContainer}>
        <Text style={ListingStyles.title}>{listing.title}</Text>
        <Text style={ListingStyles.price}>{listing.price}</Text>
      </View>
      <View style={ListingStyles.descriptionContainer}>
        <Text style={ListingStyles.size}>Size: {listing.size}</Text>
        <Text style={ListingStyles.description}>{listing.description}</Text>
      </View>
    </>
    
   
  );
}
