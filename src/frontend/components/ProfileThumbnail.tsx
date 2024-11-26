import { Styles, TextStyles } from '@/constants/Styles';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';

export default function ProfileThumbnail() {

  const ProfileStyles = StyleSheet.create({
    thumbnailImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },

  })

  return (
      <View style={Styles.row}>
        <Image
          source={require('../assets/images/profile_pic.jpg')}
          style={ProfileStyles.thumbnailImage}
        />
        <View style={{alignItems:'flex-start'}}>
          <Text style={[TextStyles.h3, {marginBottom:0, marginLeft:2}]}>Hanna</Text>
          <Text style={TextStyles.small}>@hanna_sells_vintage</Text>
        </View>
      </View>
    );

}