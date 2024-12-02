import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, ScrollView } from 'react-native';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import ProfileThumbnail from '@/components/ProfileThumbnail';
import PhotoCarousel from '@/components/PhotoCarousel';
import { NavBar } from '@/components/NavBar';
import { Colors } from '@/constants/Colors';

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
    <>
     <View style={ScreenStyles.screen}>
      <ScrollView>
        <PhotoCarousel />
        <ProfileThumbnail />
        <ListingInfo listing={listing} />
      </ScrollView>
    </View>
    <NavBar/>
   
    </>
  );
}

function ListingInfo({ listing }: { listing: { title: string; price: string ;description: string; size: string;} }) {
  return (
    <>
      <View style={[Styles.row, {justifyContent:'space-between', flexWrap:'wrap'}]}>
        <Text style={[TextStyles.h1, TextStyles.uppercase]}>{listing.title}</Text>
        <Text style={TextStyles.h2}>{listing.price}</Text>
      </View>
      <View >
        <Text style={TextStyles.h3}>Size: {listing.size}</Text>
        <Text style={TextStyles.p}>{listing.description}</Text>
      </View>
    </>
  
  );
}
