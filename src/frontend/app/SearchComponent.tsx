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

export default function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<{ id: string; title: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Sample data for demonstration
  const sampleData = [
    { id: '1', title: 'React Native Basics' },
    { id: '2', title: 'Building a Search Component' },
    { id: '3', title: 'Styling in React Native' },
    { id: '4', title: 'JavaScript ES6 Features' },
    { id: '5', title: 'Mobile App Design Principles' },
    { id: '6', title: 'State Management in React Native' },
    { id: '7', title: 'API Integration for Mobile' },
    { id: '8', title: 'App Performance Optimization' }
  ];
  
  // Real-time search effect that triggers whenever searchTerm changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setIsSearching(false);
      setResults([]);
      return;
    }
        
    setIsSearching(true);
    
    // Simulate API call with setTimeout
    const timeoutId = setTimeout(() => {
      const filteredResults = sampleData.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setResults(filteredResults);
      setIsSearching(false);
    }, 300);
    
    // Clean up timeout if component unmounts or searchTerm changes again
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);
  
  const renderItem = ({ item }: { item: { id: string; title: string } }) => (
    <TouchableOpacity style={styles.resultItem}>
      <Text style={styles.resultText}>{item.title}</Text>
    </TouchableOpacity>
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
        ) : results.length > 0 ? (
          <View>
            <Text style={styles.resultsTitle}>
              Search Results ({results.length})
            </Text>
            <FlatList
              data={results}
              renderItem={renderItem}
              keyExtractor={item => item.id}
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
};

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
});