import {
    View,
    TextInput, 
    TouchableOpacity,
    StyleSheet

} from 'react-native'; 
import { Search } from 'lucide-react-native';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { Colors } from '@/constants/Colors';

export default function SearchBar () {
    return (
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
        )
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