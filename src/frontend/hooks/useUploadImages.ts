import { useState } from 'react';
import { Alert } from 'react-native';
import { api, useApi } from '@/context/api';

const useUploadImages = () => {
  const [loading, setLoading] = useState(false);
  const api = useApi();
  const uploadingImages = async (formDataArray: FormData[]) => {
    const uploadedImages: string[] = [];
  
    if (formDataArray.length === 0) {
      Alert.alert("Error", "No images were encoded.");
      setLoading(false);
      return uploadedImages;
    }
  
    for (const formData of formDataArray) {
      console.log("FormData for current image:", formData.get("file"));
      try {
        const response = await api.postForm("/media/upload/", formData);
        const result = await (response as Response).json();
        console.log("Uploaded image:", result);
        uploadedImages.push(result.url);
      } catch (error) {
        console.error("Error uploading image:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        Alert.alert("Error", `Failed to upload image: ${errorMessage}`);
      }
    }
  
    return uploadedImages;
  };

  return {
    uploadingImages,
  };
};

export default useUploadImages;