import { useState, useEffect, useCallback } from 'react';
import { useApi } from '@/context/api';
import { Post } from '@/constants/Types';


/**
 * Custom hook to fetch post with given id
 * @param id - id of the post to fetch
 */
export function usePost(id: string) {
  const api = useApi();
  const [post, setPost] = useState<Post>();
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

  const fetchPost = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/posts/${id}/`);
      const result = await response.json();

      if (!response.ok) throw new Error('Could not fetch post');

      const seller = await fetchSeller(result.sellerID);

      if (seller) {
        const transformedPost: Post = {
            id: result.id,
            createdDate: result.created_at,
            seller: seller,
            title: result.title,
            description: result.description,
            brand: result.brand,
            condition: result.condition,
            size: result.size || "n/a", // Set default size
            gender: result.gender,
            coverImage: result.coverImage,
            price: result.price,
            isSold: result.isSold,
            isListing: result.isListing
        };
        setPost(transformedPost);
      }
        
    } catch (error) {
      console.error('Error fetching post:', error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return { post, loading, error, refetch: fetchPost };
}
