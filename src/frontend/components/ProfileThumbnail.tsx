import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { ProfileStyles } from '@/constants/Styles';

export default function ProfileThumbnail() {
    return (
        <View style={ProfileStyles.thumbnailContainer}>
          <Image
            source={require('../assets/images/profile_pic.jpg')}
            style={ProfileStyles.thumbnailImage}
          />
          <View>
            <Text style={ProfileStyles.thumbnailName}>Hanna</Text>
            <Text style={ProfileStyles.thumbnailUsername}>@hanna_sells_vintage</Text>
          </View>
          
          
        </View>
      );

}