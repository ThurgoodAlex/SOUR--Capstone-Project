import React from "react";
import { Text, Image, View, Pressable, ImageSourcePropType, TouchableOpacity } from "react-native";
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { SharedValue, useSharedValue, interpolate, Extrapolation } from "react-native-reanimated"; // Correct import for interpolate and Extrapolation
import { CartItemProps } from "@/constants/Types";
import { StyleSheet } from "react-native";
import { router } from "expo-router";
import { TextStyles } from "@/constants/Styles";

export const CartItem: React.FC<CartItemProps> = ({ item, onPress, onDelete }) => {
  // Determine if the image is a local asset or a URL
  const imageSource: ImageSourcePropType =
    typeof item.coverImage === "string" ? { uri: item.coverImage } : item.coverImage || require('@/assets/images/random1.png');

  // Initialize progressAnimatedValue to zero
  const progressAnimatedValue = useSharedValue(0);

  // Right swipe action (Delete) and animation for the swiping
  const renderRightActions = (
    progress: SharedValue<number>,  
    dragX: any                             
) => {
    const opacity = interpolate(progress.value ?? 0,
        [0, 1],
        [1, 0],
        Extrapolation.CLAMP,
    );


    return (
      <Animated.View style={[cartStyle.deleteContainer, { opacity }]}>
        <Pressable
          onPress={() => {
            onDelete(item);
            dragX.current?.close();
          }}
          style={cartStyle.deleteButton}
        >
          <Text style={cartStyle.deleteText}>Delete</Text>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View>
    <Swipeable renderRightActions={(progress, dragX) => renderRightActions(progress, dragX)}>
      <Pressable onPress={() => onPress(item)} style={cartStyle.container}>
        {item.coverImage && <Image source={imageSource} style={cartStyle.image} />}
        <View style={cartStyle.details}>
          <Text style={cartStyle.title}>{item.title}</Text>
          <Text style={cartStyle.brand}>{item.brand}</Text>
          <Text style={cartStyle.price}>${item.price}</Text>
        </View>
      </Pressable>
    </Swipeable>
    
      <TouchableOpacity
        onPress={() => router.push({
          pathname: '/CheckoutScreen',
          params: { item: JSON.stringify(item)},
      })}
      >
        <Text style={TextStyles.dark}>Purchase</Text>
      </TouchableOpacity>
    </View>
  );
};

export const cartStyle = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#d8ccaf60",
    borderRadius: 10,
    marginVertical: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    color:"#d8ccaf60"
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
    color: "#f98b69",
  },
  deleteButton: {
    backgroundColor: "#f98b69",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "100%",
  },
  deleteContainer: {
    backgroundColor: "#f98b69",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "100%",
  },
  deleteText: {
    color: "#692b20",
    fontWeight: "bold",
  },
});