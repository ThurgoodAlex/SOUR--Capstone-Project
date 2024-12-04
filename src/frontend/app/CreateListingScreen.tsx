import { NavBar } from '@/components/NavBar';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { api, useApi } from '@/context/api';
import { useAuth } from '@/context/auth';
import { useUser } from '@/context/user';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, Image, ScrollView, KeyboardTypeOptions, StyleSheet, Alert,} from 'react-native';

export default function CreateListing() {
    const [image, setImage] = useState(null); // For image upload
    const [name, setName] = useState('');
    const [size, setSize] = useState('');
    const [description, setDescription] = useState('');
    const [brand, setBrand] = useState('');
    const [condition, setCondition] = useState('');
    const [colors, setColors] = useState('');
    const [price, setPrice] = useState('');
    

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
    
    
    
    const uploadImage = () => {
        // Placeholder for image upload logic
        console.log('Upload Image');
    };

    
      
    
    const handleSubmit = async () => {

        console.log({
            name,
            size,
            description,
            brand,
            condition,
            colors,
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
              router.replace("/ProfileScreen")
            
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
      <ScrollView >
          <Text style={[TextStyles.h2, TextStyles.uppercase]}>New Listing</Text>
          
          {/* Image Upload */}
          <TouchableOpacity style={CreateListingStyles.imageUpload} onPress={uploadImage}>
          {image ? (
              <Image source={{ uri: image }} style={CreateListingStyles.uploadedImage} />
          ) : (
              <Text style={TextStyles.h3}>Upload Image</Text>
          )}
          </TouchableOpacity>

          {/* Form Inputs */}
          <FormGroup labelText="Name" placeholderText="Enter item name" value={name} setter={setName}/>
          <FormGroup labelText="Size" placeholderText="Enter item size" value={size} setter={setSize}/>
          <FormGroup labelText="Description" placeholderText="Enter item description" value={description} setter={setDescription} multiline/>
          {/* <FormGroup labelText="Brand" placeholderText="Enter brand" value={brand} setter={setBrand}/>
          <FormGroup labelText="Condition" placeholderText="Enter condition" value={condition} setter={setCondition}/> */}
          <FormGroup labelText="Price" placeholderText="Enter price" value={price} setter={setPrice} keyboardType="numeric"/>
          
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
        style={[Styles.input, multiline ? CreateListingStyles.textArea : null, {width:240}]} // Conditionally apply styles.textArea
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


    imageUpload: {
      backgroundColor: '#e9e9e9',
      height: 200,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      marginBottom: 16,
    },
  
    uploadedImage: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
    },
    
    textArea: {
      height: 120,
      textAlignVertical: 'top',
    },

  })
