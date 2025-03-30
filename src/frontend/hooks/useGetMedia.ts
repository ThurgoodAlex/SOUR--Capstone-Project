import { useState, useEffect, useCallback } from 'react';
import { useApi } from '@/context/api';
import { PostImage, PostImagesResponse } from '@/constants/Types';
import { localhostIP } from '@/context/urls';

export function useGetMedia(postId: number) {
  const api = useApi();
  const [images, setImages] = useState<PostImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [alreadyFetched, setAlreadyFetched] = useState<boolean>(false);


  const localhost = localhostIP;

  const fetchImages = useCallback(async () => {
    if (alreadyFetched)
      return;

    if (!postId) {
      console.log("No postId provided, skipping fetch");
      setImages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching from:", `/media/${postId}/`);
      const response = await api.get(`/media/${postId}/`);
      console.log("Response status:", response.status, "OK:", response.ok);

      if (response.status === 404) {
        console.log(`No media found for post with id=${postId}`);
        setImages([]);
        setLoading(false);
        setAlreadyFetched(true);
        return;
      }
      

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Could not fetch post images: ${response.status} ${response.statusText} - ${errorData}`);
      }

      const data: PostImagesResponse = await response.json();
      console.log("Raw data:", data);

      
      if (!data.items) {
        setImages([]);
        setLoading(false)
        setAlreadyFetched(true);
        return;
      }

      const adjustedImages = data.items.map(item => {
        let newUrl;
        if(localhost != "127.0.0.1"){
          newUrl = item.url.replace("localhost", localhost);
        }
        else newUrl = item.url;
        console.log("Original URL:", item.url, "Adjusted URL:", newUrl);
        return {
          ...item,
          url: newUrl
        };
      });
      console.log("Items to set:", adjustedImages);
      setImages(adjustedImages || []);
      setAlreadyFetched(true);
    } catch (error) {
      console.error('Error fetching post images:', error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [postId, api, localhost]);

  useEffect(() => {
    fetchImages();
    return () => {
    };
  }, [fetchImages]);

  return { images, loading, error, refetch: fetchImages };
}