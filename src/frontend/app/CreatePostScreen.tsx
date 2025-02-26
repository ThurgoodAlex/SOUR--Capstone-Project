import { LinkInputDropdown } from '@/components/LinkInputDropdown';
import { NavBar } from '@/components/NavBar';
import { Colors } from '@/constants/Colors';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { Post } from '@/constants/Types';
import { api, useApi } from '@/context/api';
import { useAuth } from '@/context/auth';
import { useUser } from '@/context/user';
import { usePosts } from '@/hooks/usePosts';
import * as ImagePicker from "expo-image-picker";
import { router } from 'expo-router';
import { useState } from 'react';
import useUploadImages from '@/hooks/useUploadImages';
import {View, Text, TextInput, TouchableOpacity, Image, ScrollView, KeyboardTypeOptions, StyleSheet, Alert, ImageBackground, GestureResponderEvent,} from 'react-native';
import useCreateFormData from '@/hooks/useCreateFormData';

export default function CreatePost() {
    const [name, setName] = useState('');
    const { creatingFormData } = useCreateFormData();
    const [description, setDescription] = useState('');
    const {uploadingImages} = useUploadImages();
    const MAX_IMAGES = 10;
    const [images, setImages] = useState<string[]>([]); // Store multiple image URIs
    const [error, setError] = useState(null);
    const api = useApi();
    const [loading, setLoading] = useState(false);
    const {logout} = useAuth();
    const {user} = useUser(); // Fetch user details
    const { posts } = usePosts(`/users/${user?.id}/posts/?is_listing=true`);
    const [ linkedListings, setLinkedListings] = useState<Post[]>([]);

    
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
  };
  
  // This is the handle submit. Right now it calls hooks to create the Form Data and upload the images.
  const handleSubmit = async () => {
    try {
        console.log("Submitting post with images:", images);
        
        // Create post first
        const response = await api.post("/posts/", {
            "title": name,
            "description": description,
        });

        const result = await response.json();

        if (!response.ok) {
            Alert.alert('Error', 'Something went wrong, we could not create your post.');
            return;
        }

        console.log("Created post: ", result, " with id: ", result.id);
        const postId = result.id
        // creating the form data with the selected Images and performing the upload.
        if (images.length > 0) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            const formData = creatingFormData(images, result.id);
            
            const uploadedImages = await uploadingImages(await formData);
            console.log("uploadedImages", uploadedImages);
           
        }
        // Link listing to selected posts
        for (const listing of linkedListings) {
            console.log("linking post id = ", listing.id)
            const linkResponse = await api.post(`/posts/${postId}/link/${listing.id}/`);

            console.log(linkResponse.json())
            if (!linkResponse.ok) {
                console.error(`Failed to link post ${postId} with listing ${listing.id}`);
            }
        }

        router.replace("/SelfProfileScreen");
    } catch (error) {
        console.error('Error creating post:', error);
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
          <LinkInputDropdown posts={posts} selected={linkedListings} setter={setLinkedListings} columns={1}/>

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
