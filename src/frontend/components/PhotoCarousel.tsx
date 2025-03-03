import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, ScrollView, ImageBackground } from 'react-native';
import { Styles } from '@/constants/Styles';
import { api } from '@/context/api';
import { useGetMedia } from '@/hooks/useGetMedia'

interface PhotoCarouselProps {
    postId: number;
  }

  export default function PhotoCarousel({ postId }: PhotoCarouselProps) {
    const { images, loading, error, refetch } = useGetMedia(postId);
    console.log("PhotoCarousel images:", images);
  if (loading) {
    return (
        <View style={Styles.row}>
            <Text>Loading images...</Text>
        </View>
    );
}

if (error) {
  return (
      <View style={Styles.row}>
          <Text>Error loading images: {error}</Text>
      </View>
  );
}
return (
  <View style={Styles.row}>
      <ScrollView horizontal={true}>
          {images && images.length > 0 ? (
              images.map((image) => (
                <ImageBackground
                key={image.id}
                source={{ uri: image.url }}
                style={{ height: 250, width: 250, marginRight: 6 }}
                onError={(e) => console.log("Image load error:", image.url, e.nativeEvent.error)}
                onLoad={() => console.log("Image loaded:", image.url)}
              />
              ))
          ) : (
              <Text>No images available</Text>
          )}
      </ScrollView>
  </View>
);
}