import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, ScrollView, ImageBackground } from 'react-native';
import { Styles } from '@/constants/Styles';
import { api } from '@/context/api';
import { useGetMedia } from '@/hooks/useGetMedia'
import { PostImage } from '@/constants/Types';

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
          <ImageGallery images={images} />
      </ScrollView>
  </View>
);
}



const ImageGallery = ({ images }: { images: PostImage[] }) => {
  return (
    <View style={Styles.row}>
      <ScrollView horizontal={true}>
        {images.length > 0 ? (
          images.map((image) => {
            const [error, setError] = useState(false);

            return (
              <ImageBackground
                key={image.id}
                source={error ? require('../assets/images/placeholder.png') : { uri: image.url }}
                style={{ height: 250, width: 250, marginRight: 6 }}
                onError={() => {
                  console.log("Image load error:", image.url);
                  setError(true);
                }}
                onLoad={() => console.log("Image loaded:", image.url)}
              />
            );
          })
        ) : (
          <ImageBackground
            source={require('../assets/images/placeholder.png')}
            style={{ height: 250, width: 250, marginRight: 6 }}
          />
        )}
      </ScrollView>
    </View>
  );
};