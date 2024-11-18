import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { ProfileStyles, Styles } from '@/constants/Styles';

export default function PhotoCarousel(imageNames : string[]) {
    
    return (
        <View style={Styles.carouselContainer}>
      <FlatList
        data={imageNames}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={Styles.carouselImage}
          />
        )}
      />
        </View>
      );

}