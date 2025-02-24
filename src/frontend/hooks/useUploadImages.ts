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

  const uploadingImages = async (images: string | any[]) => {
    setLoading(true);
    const uploadedImages: string[] = [];


    if (images.length === 0) {
      Alert.alert('Error', 'No images were encoded.');
      setLoading(false);
      return uploadedImages;
    }

    // Now proceed with uploading images
    for (const file of images) {
      console.log("FormData for current image:", file.get("file"));
      const uploadResponse = await api.postForm("/media/upload/", file);
      
      if (uploadResponse.ok) {
        const result = await uploadResponse.json();
        console.log("Uploaded image:", result);
        uploadedImages.push(result.fileUrl);
      } else {
        console.log("Upload failed for image");
        Alert.alert('Error', 'Some images failed to upload, but your post was created.');
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