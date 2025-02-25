import { useState } from 'react';
import { Alert } from 'react-native';
import { api, useApi } from '@/context/api'; 

const useUploadImages = () => {
  const [encodedFiles, setEncodedFiles] = useState<FormData[]>([]);
  const [loading, setLoading] = useState(false);
  const api = useApi();

  const encodingFiles = async (images: string | any[], postID: number): Promise<FormData[]> => {
    const encodedFiles: FormData[] = [];

    if (Array.isArray(images) && images.length > 0) {
      for (const image of images) {
        try {
          const response = await fetch(image);
          const blob = await response.blob();

          const formData = new FormData();
          formData.append("file", blob, image._data.name || "default.jpg");
          formData.append("post_id", postID.toString());

          encodedFiles.push(formData);
        } catch (error) {
          console.log("Error fetching image as Blob:", error);
        }
      }
    }

    return encodedFiles;
  };

  const uploadingImages = async (formDataArray: FormData[]) => {
    setLoading(true);
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
        uploadedImages.push(result.url); // Adjust if your endpoint uses "fileUrl"
      } catch (error) {
        console.error("Error uploading image:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        Alert.alert("Error", `Failed to upload image: ${errorMessage}`);
      }
    }
  
    setLoading(false);
    return uploadedImages;
  };

  return {
    encodingFiles,
    uploadingImages,
    loading,
  };
};

export default useUploadImages;