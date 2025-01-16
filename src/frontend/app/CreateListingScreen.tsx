import { NavBar } from '@/components/NavBar';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { api, useApi } from '@/context/api';
import { useAuth } from '@/context/auth';
import { useUser } from '@/context/user';
import * as ImagePicker from "expo-image-picker";
import { router } from 'expo-router';
import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, Image, ScrollView, KeyboardTypeOptions, StyleSheet, Alert, ImageBackground, GestureResponderEvent,} from 'react-native';

export default function CreateListing() {
    const [name, setName] = useState('');
    const [size, setSize] = useState('');
    const [description, setDescription] = useState('');
    const [brand, setBrand] = useState('');
    const [condition, setCondition] = useState('');
    const [color, setColor] = useState('');
    const [price, setPrice] = useState('');
    const PlaceholderImage = require('@/assets/images/icon.png');

    const MAX_IMAGES = 10;
    const [images, setImages] = useState<string[]>([]); // Store multiple image URIs
    const [error, setError] = useState(null);

    const api = useApi();
    const {logout} = useAuth();
    const user = useUser(); // Fetch user details
    
    var username = "";
    if(user){
      username = user.name;
    }
    else{
      logout();
    }
    
   
    //pick images from the device's media library
    const uploadImages = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
      if (status !== "granted") {
          Alert.alert(
              "Permission Denied", "Sorry, we need camera roll permission to upload images."
          );
      } else {
          // Launch the image library and get the selected images
          const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: 'images',
              allowsMultipleSelection: true,
              selectionLimit: MAX_IMAGES - images.length,
              orderedSelection: true,
          });
  
          if (!result.canceled && result.assets) {
              const newImages = result.assets
                  .map((asset) => asset.uri)  // Get the URIs of the selected images
                  .filter((uri) => !images.includes(uri));  // Filter out duplicates
  
              console.log('NewImages:', newImages);
              // Add the new images to the existing images array
              setImages((prevImages) => [...prevImages, ...newImages]);
              setError(null);  // Clear any previous errors
              
          }
      }
  };
  

    
      
    
    const handleSubmit = async () => {

        console.log({
            name,
            size,
            description,
            brand,
            condition,
            color,
            price,
        });

        try {
          const response = await api.post("/listing/createlisting",
                {
                  "title":name,
                  "description":description,
                  "price": parseFloat(price),
                }
          );
          const result = await response.json();

          if (response.ok) {
              console.log("created listing: ", result)
              router.replace("/SelfProfileScreen")
            
          } else {
              console.log(response)
              Alert.alert('Error', 'Something went wrong, we could not create your listing.');

          }
        } catch (error) {
            console.error('Error creating listing:', error);
            Alert.alert('Error', 'Failed to connect to the server. Please check your connection.');
        } 
        // router.replace('/DiscoverScreen');
    };

  return (
    <>
     <View style={ScreenStyles.screen}>
     
          <Text style={[TextStyles.h2, TextStyles.uppercase]}>New Listing</Text>
        
          {/* Display Selected Images */}
          <UploadPhotosCarousel images={images} onAddImages={uploadImages} />
        <ScrollView >
          {/* Form Inputs */}
          <FormGroup labelText="Name" placeholderText="Enter item name" value={name} setter={setName}/>
          <FormGroup labelText="Size" placeholderText="Enter item size" value={size} setter={setSize}/>
          <FormGroup labelText="Price" placeholderText="Enter price" value={price} setter={setPrice} keyboardType="numeric"/>
          <FormGroup labelText="Description" placeholderText="Enter item description" value={description} setter={setDescription} multiline/>
          <FormGroup labelText="Brand" placeholderText="Enter brand" value={brand} setter={setBrand}/>
          <FormGroup labelText="Condition" placeholderText="Enter condition" value={condition} setter={setCondition}/>
          <FormGroup labelText="Color" placeholderText="Select a color" value={color} setter={setColor}/>
          
          
          {/* Submit Button */}
          <TouchableOpacity style={Styles.buttonDark} onPress={handleSubmit}>
              <Text style={TextStyles.light}>Post</Text>
          </TouchableOpacity>
          
      </ScrollView>
    </View>
    <NavBar/>
    </>
   
  );
}


function UploadPhotosCarousel({
  images,
  onAddImages,
}: {
  images: string[];
  onAddImages: () => Promise<void>;
}) {
  const isButtonDisabled = images.length >= 10;  // Disable the button if 10 images are already selected

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {images.map((imageUri, index) => (
          <View key={index}>
            <ImageBackground
              source={{ uri: imageUri }}
              style={Styles.image}
              resizeMode="cover"
            />
          </View>
        ))}
        
        {/* Add More Button */}
        <TouchableOpacity
          style={[Styles.buttonLight, isButtonDisabled && { opacity: 0.5 }, {width:250, height:250}]}  // Apply style to indicate the button is disabled
          onPress={onAddImages}
          disabled={isButtonDisabled}  // Disable the button if there are 10 images
        >
          <Text style={TextStyles.h3}>
            {isButtonDisabled
              ? "10 Photos Limit Reached"  // Display message when 10 images are selected
              : images.length > 0
              ? "Add More Images"
              : "Upload Images"
            }
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}


function FormGroup({
    labelText,
    placeholderText,
    value,
    setter,
    keyboardType,
    multiline
}: {
    labelText: string;
    placeholderText: string;
    value: string;
    setter: React.Dispatch<React.SetStateAction<string>>;
    keyboardType?: KeyboardTypeOptions;
    multiline?: boolean
}) {

    return (
    <View style={CreateListingStyles.formGroup}>
      <Text style={TextStyles.h3}>{labelText}</Text>
      <TextInput
        style={[Styles.input, multiline ? CreateListingStyles.textArea : null, {width:250}]} // Conditionally apply styles.textArea
        placeholder={placeholderText}
        value={value}
        onChangeText={setter}
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'} // Optional: Adjust text alignment for multiline
      />
    </View>
  );
  }

  
  

  export const CreateListingStyles = StyleSheet.create({
    
    formGroup: {
      marginBottom: 12,
      flexDirection:'row',
      gap:8,
      alignItems:'flex-start',
      justifyContent:'space-between'
    },

    
    textArea: {
      height: 120,
      textAlignVertical: 'top',
    },

  })
