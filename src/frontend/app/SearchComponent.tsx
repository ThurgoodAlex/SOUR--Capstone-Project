import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
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
import { router } from 'expo-router';
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
        // Log timing to check token freshness
        console.log('Request initiated at:', new Date().toISOString());
        
        const response = await api.get(`/posts/search?search=${encodeURIComponent(searchTerm)}`);
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        const responseText = await response.clone().text();
        console.log('Response body:', responseText);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - ${responseText}`);
        }

        const data = await response.json();
        
        if (Array.isArray(data)) {
          setResults(data);
        } else {
          console.warn('Unexpected response format:', data);
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
    backgroundColor: '#ffffff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1f2937',
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
    backgroundColor: '#ffffff',
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
    color: '#374151',
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