import React from "react";
import { Text, Image, View, Pressable, ImageSourcePropType } from "react-native";
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { SharedValue, interpolate, Extrapolation } from "react-native-reanimated"; // Correct import for interpolate and Extrapolation
import { CartItemProps } from "@/constants/Types";
import { StyleSheet } from "react-native";

export const CartItem: React.FC<CartItemProps> = ({ item, onPress, onDelete }) => {

  // Determine if the image is a local asset or a URL
  const imageSource: ImageSourcePropType =
    typeof item.coverImage === "string" ? { uri: item.coverImage } : item.coverImage || require('@/assets/images/random1.png');

  // Right swipe action (Delete)
  const renderRightActions = (
    progressAnimatedValue: SharedValue<number>,  // Correct type for progress
    dragAnimatedValue: SharedValue<number>,      // Additional parameter for drag
    swipeable: any                             // Additional swipeable methods
  ) => {

    return (
      <Animated.View style={[cartStyle.deleteContainer]}>
        <Pressable onPress={() => onDelete(item)} style={cartStyle.deleteButton}>
          <Text style={cartStyle.deleteText}>Delete</Text>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <Pressable onPress={() => onPress(item)} style={cartStyle.container}>
        {item.coverImage && <Image source={imageSource} style={cartStyle.image} />}
        <View style={cartStyle.details}>
          <Text style={cartStyle.title}>{item.title}</Text>
          <Text style={cartStyle.brand}>{item.brand}</Text>
          <Text style={cartStyle.price}>${item.price}</Text>
        </View>
      </Pressable>
    </Swipeable>
  );
};


export const cartStyle = StyleSheet.create({
    container: {
      flexDirection: "row",
      padding: 10,
      backgroundColor: "#fff",
      borderRadius: 10,
      marginVertical: 5,
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 2,
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 10,
      marginRight: 10,
    },
    details: {
      marginLeft: 10,
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
    },
    brand: {
      fontSize: 14,
      color: "#777",
    },
    price: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#ff4d4d",
    },
  
    deleteButton: {
  
      backgroundColor: "red",
  
      justifyContent: "center",
  
      alignItems: "center",
  
      width: 70,
  
      height: "100%",
  
    },
    deleteContainer: {
  
      backgroundColor: "red",
  
      justifyContent: "center",
  
      alignItems: "center",
  
      width: 70,
  
      height: "100%",
  
    },
  
    deleteText: {
  
      color: "#fff",
  
      fontWeight: "bold",
  
    },
  
  });