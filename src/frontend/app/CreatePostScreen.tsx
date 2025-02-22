import { NavBar } from '@/components/NavBar';
import { Colors } from '@/constants/Colors';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { api, useApi } from '@/context/api';
import { useAuth } from '@/context/auth';
import { useUser } from '@/context/user';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { router } from 'expo-router';
import { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, Image, ScrollView, KeyboardTypeOptions, StyleSheet, Alert, ImageBackground, GestureResponderEvent,} from 'react-native';

export default function CreatePost() {
    const [name, setName] = useState('');
    const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
    const [description, setDescription] = useState('');
    const [PostID, setPostID] = useState('');
    
    const MAX_IMAGES = 10;
    const [images, setImages] = useState<string[]>([]); // Store multiple image URIs
    const [error, setError] = useState(null);

    const api = useApi();
    const {logout} = useAuth();
    const {user} = useUser(); // Fetch user details
    
    //pick images from the device's media library
    const uploadImages = async () => {
      if (isImagePickerOpen) {
          return;
      }
      setIsImagePickerOpen(true);
      console.log('Image Picker triggered');
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
              base64: true, // Include base64 string in the response
          });
          
          console.log('Image Picker Result:', result);
          if (!result.canceled && result.assets) {
              const newImages = result.assets
                  .map((asset) => asset.uri)
                  .filter((uri) => !images.includes(uri));
  
              console.log('NewImages:', newImages);
              setImages((prevImages) => [...prevImages, ...newImages]);
              setError(null);  // Clear any previous errors
          }
      }
      setIsImagePickerOpen(false);
  };


const fileUpload = async (images: string | any[]) => {
    const uploadedFiles = [];
      for (const image of images) {
        console.log("Uploading image:", image);
        const base64Image = await FileSystem.readAsStringAsync(image, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const formData = new FormData();
        formData.append("file", base64Image);
        formData.append("post_id", PostID);
        console.log("Uploading form data:", formData);
        uploadedFiles.push(formData);
        };
        return uploadedFiles;
}

const handleSubmit = async () => {
  console.log({
      name,
      description,
  });

  try {
      // Ensure that images are uploaded first
      if (images.length === 0) {
          console.log("No images selected for upload.");
          return; // Exit early if no images are selected
      }

      // Upload images
      const formDataArray = await fileUpload(images);
      const uploadedImages = [];

      // Perform the upload request
      for (const formData of formDataArray) {
          const uploadResponse = await api.postForm("/media/upload", formData);

          if (uploadResponse.ok) {
              const result = await uploadResponse.json();
              console.log("Uploaded image:", result);

              // Assuming the response contains the URL of the uploaded image
              uploadedImages.push(result.fileUrl); 
          } else {
              console.log("Upload failed for image:", formData);
              Alert.alert('Error', 'Something went wrong, we could not upload your image.');
              return; // Exit early if any upload fails
          }
      }


      const response = await api.post("/posts/", {
          "title": name,
          "description": description,
      });

      const result = await response.json();

      if (response.ok) {
          console.log("Created post: ", result);
          setPostID(result.id);
          router.replace("/SelfProfileScreen");
      } else {
          console.log(response);
          Alert.alert('Error', 'Something went wrong, we could not create your post.');
      }
  } catch (error) {
      console.error('Error creating listing:', error);
      Alert.alert('Error', 'Failed to connect to the server. Please check your connection.');
  }
};

  return (
    <>
     <View style={ScreenStyles.screen}>
     
          <Text style={[TextStyles.h2, TextStyles.uppercase]}>New Post</Text>
        
          {/* Display Selected Images */}
          <UploadPhotosCarousel images={images} onAddImages={uploadImages} />
        <ScrollView >
          {/* Form Inputs */}
          <FormGroup labelText="Name" placeholderText="Enter post name" value={name} setter={setName} required />
          <FormGroup labelText="Caption" placeholderText="Enter caption" value={description} setter={setDescription} multiline/>
          
          {/* Submit Button */}
          <TouchableOpacity 
              style={[Styles.buttonDark, (name == "") && Styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={name == ""}
          >
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
       <TouchableOpacity style={[Styles.buttonLight, { backgroundColor:Colors.dark60, width: 220, height: 220, borderColor:Colors.dark, borderWidth:1 }]} onPress={onAddImages}>
          <Text style={TextStyles.h3}>{images.length >= 10 ? "10 Photos Limit Reached" : "Upload Images"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function FormGroup({ labelText, placeholderText, value, setter, multiline, required}: {
    labelText: string;
    placeholderText: string;
    value: string;
    setter: React.Dispatch<React.SetStateAction<string>>;
    multiline?: boolean;
    required?: boolean;
}): JSX.Element {
    return (
        <View style={CreatePostStyles.formGroup}>
             <View style={Styles.row}>
                <Text style={[TextStyles.h3, { textAlign: 'left' }]}>{labelText} </Text>  
                {required? <Text style={[TextStyles.required, { marginBottom:5}]}>*required</Text> : null }
            </View>
            <TextInput  
                style={[Styles.input, multiline ? CreatePostStyles.textArea : null]} 
                placeholder={placeholderText} 
                value={value} 
                onChangeText={setter} 
                textAlignVertical={multiline ? 'top' : 'center'} 
                multiline={multiline}
            />
        </View>
    );
}

  export const CreatePostStyles = StyleSheet.create({
    
    formGroup: {
      marginBottom: 12,
      maxWidth: '100%',
      position: 'relative',
  },

  textArea: {
    height: 120,
    textAlignVertical: 'top',

  },

  })
