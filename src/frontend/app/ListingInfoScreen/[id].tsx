import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, ScrollView } from 'react-native';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import ProfileThumbnail from '@/components/ProfileThumbnail';
import PhotoCarousel from '@/components/PhotoCarousel';
import { NavBar } from '@/components/NavBar';
import { router, useLocalSearchParams } from 'expo-router';
import { useUser } from '@/context/user';
import { useAuth } from '@/context/auth';
import { useApi } from '@/context/api';
import { Listing, User } from '@/constants/Types';

export default function ListingInfoScreen()
 {
  const user = useUser(); // Fetch user details
  const { logout } = useAuth();
  const api = useApi();
  
  const [liked, setLike] = useState(false);
  const [listing, setListing] = useState<Listing | null>(null); 


  const { id } = useLocalSearchParams(); // Get the dynamic `id` from the route
  const images = ["sweater1.png", "sweater2.png","sweater3.png","sweater4.png"]


  useEffect(() => {
    // Fetch the listing based on the dynamic id
    const fetchListing = async () => {
      try {
        const response = await api.get(`/listing/listing/${id}`);
        const data = await response.json();
       
        // Transform the data
        const transformedListing: Listing = {
          title: data.title,
          price: data.price,
          description: data.description,
          size: "Medium", // Set default size

          seller: {
            name: data.seller || "Unknown poster", // Fallback to a default value
            username: data.seller || "unknown", // Fallback to a default value
            id: data.seller_id,
        
          },
         
          id: data.id,
          createdDate: data.created_at, // Assuming created_at is the correct field
        };

        setListing(transformedListing); // Set the transformed data

      } catch (error) {
        console.error('Error fetching listing:', error);
      }
    };

    if (id) {
      fetchListing(); // Fetch data when 'id' is available
    }
  }, [id]);


  
  if(listing){
    //extract seller information into a User object
    const seller: User = {
      name: listing.seller.name,
      username: listing.seller.username,
      id: listing.seller.id,
  
    }; 

    return (
      <>
        <View style={ScreenStyles.screen}>
          <ScrollView>
            <PhotoCarousel /> 
            <ProfileThumbnail user={seller} /> 
            <ListingInfo listing={listing} />
          </ScrollView>
        </View>
        <NavBar /> 
      </>
    );
  }

  else{
    return (
      <>
        <View style={ScreenStyles.screen}>
          <Text>Listing information not available.</Text>
        </View>
        <NavBar /> 
      </>
    );
  }
  
}

// Component to display listing details
function ListingInfo({ listing }: { listing: Listing}) {
  return (
    <View style={[Styles.row, { justifyContent: 'space-between', flexWrap: 'wrap' }]}>
      <Text style={[TextStyles.h1, TextStyles.uppercase]}>{listing.title}</Text>
      <Text style={TextStyles.h2}>{listing.price}</Text>
      <Text style={TextStyles.h3}>Size: {listing.size}</Text>
      <Text style={TextStyles.p}>{listing.description}</Text>
    </View>
  );
}
