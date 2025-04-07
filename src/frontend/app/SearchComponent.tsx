import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { Colors } from '@/constants/Colors';
import React, { useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  FlatList, 
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Search } from 'lucide-react-native';
import { useApi } from '@/context/api';
import { Post } from '@/constants/Types';
import { PostPreview } from '@/components/PostPreview';

export default function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = useApi();

  useEffect(() => {
    const searchPosts = async () => {
      if (searchTerm.trim() === '') {
        setIsSearching(false);
        setResults([]);
        setError(null);
        return;
      }
    
      setIsSearching(true);
      setError(null);
    
      try {
        const response = await api.get(`/posts/search?search=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const rawPosts = await response.json();
    
        if (Array.isArray(rawPosts)) {
          const posts = rawPosts.map(post => ({
            id: post.id,
            createdDate: new Date(post.created_at), 
            sellerID: post.sellerID,
            seller: post.seller || null, 
            title: post.title,
            description: post.description,
            brand: post.brand,
            condition: post.condition,
            size: post.size,
            gender: post.gender,
            coverImage: post.coverImage,
            price: post.price,
            isSold: post.isSold,
            isListing: post.isListing,
            isVideo: post.isVideo,
          }));
    
          const sellerIds = [...new Set(posts.map(post => post.sellerID).filter(id => id))];
          console.log('Seller IDs:', sellerIds); // Debug
    
          const sellerPromises = sellerIds.map(id =>
            api.get(`/users/${id}/`).then(res => res.json()).catch(err => {
              console.error(`Failed to fetch user ${id}:`, err);
              return null;
            })
          );
          const sellers = (await Promise.all(sellerPromises)).filter(s => s !== null);
          console.log('Fetched sellers:', sellers); // Debug
    
          const enrichedPosts = posts.map(post => ({
            ...post,
            seller: sellers.find(s => s.id === post.sellerID) || null,
          }));
          console.log('Enriched posts:', enrichedPosts); // Debug
    
          setResults(enrichedPosts);
        } else {
          setResults([]);
        }
    
        setIsSearching(false);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch search results');
        setResults([]);
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchPosts();
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  const renderItem = ({ item }: { item: Post }) => (
    console.log('Rendering item:', item),
    <PostPreview post={item} size={160} profileThumbnail='small' />
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <Text style={styles.title}>Search</Text>
      
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <Search size={20} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Search for something..."
            placeholderTextColor="#9ca3af"
            returnKeyType="search"
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity 
              onPress={() => setSearchTerm('')}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.resultsContainer}>
        {isSearching ? (
          <ActivityIndicator size="large" color="#3b82f6" style={styles.loader} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : results.length > 0 ? (
          <View>
            <Text style={styles.resultsTitle}>
              Search Results ({results.length})
            </Text>
            <FlatList
              data={results}
              renderItem={renderItem}
              numColumns={2}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.resultsList}
            />
          </View>
        ) : searchTerm !== '' && (
          <Text style={styles.noResults}>
            No results found for "{searchTerm}"
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.dark,
  },
  searchContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    height: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#1f2937',
  },
  clearButton: {
    padding: 6,
  },
  clearButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: Colors.dark,
  },
  resultsList: {
    paddingBottom: 20,
  },
  resultItem: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#ffffff',
  },
  resultText: {
    fontSize: 16,
    color: '#1f2937',
  },
  loader: {
    marginTop: 20,
  },
  noResults: {
    marginTop: 20,
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  errorText: {
    marginTop: 20,
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
});