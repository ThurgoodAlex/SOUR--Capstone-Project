import { useState, useEffect, useCallback } from 'react';
import { useApi } from '@/context/api';
import { PostImage, PostImagesResponse } from '@/constants/Types';

export function useGetMedia(postId: number) {
    const api = useApi();
    const [images, setImages] = useState<PostImage[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    const fetchImages = useCallback(async () => {
      if (!postId) {
        setImages([]);
        setLoading(false);
        return;
      }
  
      setLoading(true);
      setError(null);
  
      try {
        const response = await api.get(`/posts/${postId}/`);
        const data: PostImagesResponse = await response.json();
  
        if (!response.ok) throw new Error('Could not fetch post images');
  
        setImages(data.items || []);
      } catch (error) {
        console.error('Error fetching post images:', error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    }, [postId, api]);
  
    useEffect(() => {
      fetchImages();
    }, [fetchImages]);
  
    return { images, loading, error, refetch: fetchImages };
  }