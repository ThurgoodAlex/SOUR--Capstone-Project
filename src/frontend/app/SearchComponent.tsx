
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import React, { useState } from 'react';
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
import { Search } from 'lucide-react';

export default function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
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
  
  const handleSearch = () => {
    if (searchTerm.trim() === '') return;
    
    setIsSearching(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      const filteredResults = sampleData.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setResults(filteredResults);
      setIsSearching(false);
    }, 500);
  };
  
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.resultItem}>
      <Text style={styles.resultText}>{item.title}</Text>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <Text style={styles.title}>Search</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search for something..."
          placeholderTextColor="#9ca3af"
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity 
          style={styles.searchButton} 
          onPress={handleSearch}
          activeOpacity={0.7}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#1f2937',
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  searchButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
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
