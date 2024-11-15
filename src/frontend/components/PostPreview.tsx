import { Alert, View, Image, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';

type Post = {
    id: number;
    // preview: TexImageSource;
    preview: string; // Assuming the preview is a URI to an image
    user: string;
    type: string;
};

/**
 * The visualization of how a campus post looks like.
 * @param post - Props object containing the post details.
 * @returns A post view component.
 */
export function PostPreview(post: Post) {
  const { id, preview, user, type } = post;
  const [isSaved, setIsSaved] = useState(false);

  return (
    <View key={id}>
      {/* Display the image */}
      <Image source={{ uri: preview }}/>
      
      {/* Display additional information */}
      <Text>{user}</Text>
      <Text>{type}</Text>
    </View>
  );
}