import { useState, useEffect, useCallback } from 'react';
import { useApi } from '@/context/api';
import { Post } from '@/constants/Types';


/**
 * Custom hook to fetch posts from a given endpoint
 * @param endpoint - API endpoint for fetching posts
 */
export function usePosts(endpoint: string) {
  const api = useApi();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSeller = async (sellerId: string) => {
    try {
      const sellerResponse = await api.get(`/users/${sellerId}/`);
      const sellerData = await sellerResponse.json();
      if (sellerResponse.ok) {
        return {
          firstname: sellerData.firstname,
          lastname: sellerData.lastname,
          username: sellerData.username,
          bio: sellerData.bio,
          profilePicture: sellerData.profilePicture,
          isSeller: sellerData.isSeller,
          email: sellerData.email,
          id: sellerData.id,
        };
      }
    } catch (error) {
      console.error(`Error fetching seller with id ${sellerId}:`, error);
    }
    return null;
  };

  const fetchPosts = useCallback(async () => {
    if (!endpoint || endpoint.trim() === '' || endpoint.includes('undefined')) {
      setPosts([]);
      setLoading(false);
      return;
    }
  
    setLoading(true);
    setError(null);
    try {
      console.log('calling endpoint:', endpoint);
      const response = await api.get(endpoint);
      
      if (!response.ok) {
        throw new Error('Could not fetch posts.');
      }
      
      const result = await response.json();
      console.log('Posts fetched:', result);
      
      // Check if result is an array before mapping
      if (!Array.isArray(result)) {
        console.error('API did not return an array:', result);
        setPosts([]);
        return;
      }

      const transformedPosts: Post[] = await Promise.all(
        result.map(async (item: any) => {
          const seller = await fetchSeller(item.sellerID);
          return {
            id: item.id,
            createdDate: item.created_at || new Date().toISOString(),
            coverImage: item.coverImage,
            title: item.title,
            description: item.description,
            brand: item.brand,
            condition: item.condition,
            size: item.size,
            gender: item.gender,
            price: item.price,
            isSold: item.isSold,
            isListing: item.isListing,
            seller,
          };
        })
      );

      setPosts(transformedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, refetch: fetchPosts };
}
