import { ListingStyles } from '@/constants/Styles';
import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, Image, ScrollView, KeyboardTypeOptions,} from 'react-native';

export default function CreateListing() {
  const [image, setImage] = useState(null); // For image upload
  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [condition, setCondition] = useState('');
  const [colors, setColors] = useState('');
  const [price, setPrice] = useState('');

  const uploadImage = () => {
    // Placeholder for image upload logic
    console.log('Upload Image');
  };

  const handleSubmit = () => {
    console.log({
      name,
      size,
      description,
      brand,
      condition,
      colors,
      price,
    });
  };

  return (
    <ScrollView contentContainerStyle={ListingStyles.container}>
        <Text style={ListingStyles.title}>New Listing</Text>
        
        {/* Image Upload */}
        <TouchableOpacity style={ListingStyles.imageUpload} onPress={uploadImage}>
        {image ? (
            <Image source={{ uri: image }} style={ListingStyles.uploadedImage} />
        ) : (
            <Text style={ListingStyles.uploadText}>Upload Image</Text>
        )}
        </TouchableOpacity>

        {/* Form Inputs */}
        <FormGroup labelText="Name" placeholderText="Enter item name" value={name} setter={setName}/>
        <FormGroup labelText="Size" placeholderText="Enter item size" value={size} setter={setSize}/>
        <FormGroup labelText="Description" placeholderText="Enter item description" value={description} setter={setDescription} multiline/>
        <FormGroup labelText="Brand" placeholderText="Enter brand" value={brand} setter={setBrand}/>
        <FormGroup labelText="Condition" placeholderText="Enter condition" value={condition} setter={setCondition}/>
        <FormGroup labelText="Price" placeholderText="Enter price" value={price} setter={setPrice} keyboardType="numeric"/>
        
        {/* Submit Button */}
        <TouchableOpacity style={ListingStyles.submitButton} onPress={handleSubmit}>
            <Text style={ListingStyles.submitButtonText}>Post</Text>
        </TouchableOpacity>
    </ScrollView>
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
    <View style={ListingStyles.formGroup}>
      <Text style={ListingStyles.label}>{labelText}</Text>
      <TextInput
        style={[ListingStyles.input, multiline ? ListingStyles.textArea : null]} // Conditionally apply styles.textArea
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
  

