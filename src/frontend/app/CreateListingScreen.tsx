import { NavBar } from '@/components/NavBar';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { api, useApi } from '@/context/api';
import { useAuth } from '@/context/auth';
import { useUser } from '@/context/user';
import * as ImagePicker from "expo-image-picker";
import { router } from 'expo-router';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, Alert, KeyboardTypeOptions } from 'react-native';
import { Colors } from '@/constants/Colors';
import ModalSelector from 'react-native-modal-selector';
import * as Yup from 'yup';
import { style } from '@/app/SignUpScreen';
import { Ionicons } from '@expo/vector-icons';
import { LinkedItems } from '@/components/Linkedtems';
import { usePosts } from '@/hooks/usePosts';
import { Collapsible } from '@/components/Collapsible';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Post } from '@/constants/Types';
import { LinkedItemsSelection } from '@/components/LinkItemsSelection';
import { LinkInputDropdown } from '@/components/LinkInputDropdown';


const validationSchema = Yup.object().shape({
    name: Yup.string().required('Item name is required'),
    price: Yup.string().matches(/^\d+(\.\d{1,2})?$/, 'Enter a valid price').required('Price is required'),
    size: Yup.string().required('Size is required'),
});
export default function CreateListing(): JSX.Element {
    const [name, setName] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [condition, setCondition] = useState<string>('');
    const [size, setSize] =  useState<string>('');
    const [description, setDescription] =  useState<string>('');
    const [brand, setBrand] =  useState<string>('');
    const [color, setColor] = useState('');
       
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const PlaceholderImage = require('@/assets/images/icon.png');

    const MAX_IMAGES = 10;
    const [images, setImages] = useState<string[]>([]);

    const [error, setError] = useState<string | null>(null);

    const api = useApi();
    const { logout } = useAuth();
    const { user } = useUser();
    const { posts } = usePosts(`/users/${user?.id}/posts/?is_listing=false`);
    const [ linkedPosts, setLinkedPosts] = useState<Post[]>([]);
    if (!user) logout();

    const uploadImages = async (): Promise<void> => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            Alert.alert(
                "Permission Denied", "Sorry, we need camera roll permission to upload images."
            );
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsMultipleSelection: true,
                selectionLimit: MAX_IMAGES - images.length,
                orderedSelection: true,
            });

            if (!result.canceled && result.assets) {
                const newImages = result.assets
                    .map((asset) => asset.uri)
                    .filter((uri) => !images.includes(uri));

                setImages((prevImages) => [...prevImages, ...newImages]);
                setError(null);
            }
        } catch (err) {
            setError("Failed to upload images. Please try again.");
        }
    };
    
    const handleSubmit = async (): Promise<void> => {
        try {
            await validationSchema.validate(
                { name, description, size, price, gender, condition, brand, color },
                { abortEarly: false }
            );
            setErrors({});
            setLoading(true);
    
            // Create the listing first
            const response = await api.post("/posts/listings/", {
                title: name,
                gender: gender,
                size: size,
                description: description,
                condition: condition,
                brand: brand,
                price: price,
                isSold: false,
                isListing: true,
                coverImage: "",
                color: color
            });
    
            if (!response.ok) {
                Alert.alert('Error', 'Something went wrong, we could not create your listing.');
                return;
            }
    
            const newListing = await response.json();
            const listingId = newListing.id;
    
            console.log("Created listing:", listingId);
    
            // Link listing to selected posts
            for (const post of linkedPosts) {
                console.log("linking post id = ", post.id)
                const linkResponse = await api.post(`/posts/${post.id}/link/${listingId}/`);

                console.log(linkResponse.json())
                if (!linkResponse.ok) {
                    console.error(`Failed to link post ${post.id} with listing ${listingId}`);
                }
            }
    
            // Navigate after success
            router.replace("/SelfProfileScreen");
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const newErrors: { [key: string]: string } = {};
                err.inner.forEach(error => {
                    if (error.path) {
                        newErrors[error.path] = error.message;
                    }
                });
                setErrors(newErrors);
            } else {
                Alert.alert('Error', 'An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <>
            <View style={ScreenStyles.screen}>
                <Text style={[TextStyles.h2, TextStyles.uppercase]}>New Listing</Text>
                <ScrollView>
                    <UploadPhotosCarousel images={images} onAddImages={uploadImages} />
                    <FormGroup labelText="Name" placeholderText="Enter item name" value={name} setter={setName} error={errors["name"]} required/>
                    <FormGroup labelText="Price" placeholderText="Enter price" value={price} setter={setPrice} error={errors["price"]} keyboardType="numeric" required/>
                    <Dropdown labelText="Gender" selectedValue={gender} onValueChange={setGender} options={["Men's", "Women's", "Unisex"]} error={errors["gender"]} />
                    <Dropdown labelText="Size" selectedValue={size} onValueChange={setSize} options={["XXSmall", "XSmall", "Small", "Medium", "Large", "XLarge", "XXLarge", "XXXLarge", "00", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"]} error={errors["size"]} required/>
                    <FormGroup labelText="Description" placeholderText="Enter item description" value={description} setter={setDescription} error={errors["description"]} multiline/>
                    <FormGroup labelText="Brand" placeholderText="Enter brand" value={brand} setter={setBrand} error={errors["brand"]}/>
                    <Dropdown labelText="Condition" selectedValue={condition} onValueChange={setCondition} options={["New", "Like New", "Good", "Fair", "Needs Repair"]} error={errors["condition"]}/>
                    <LinkInputDropdown posts={posts} selected={linkedPosts} setter={setLinkedPosts} columns={3}/>
                    
                    <TouchableOpacity 
                        style={[Styles.buttonDark, (name == "" || price == "" || size == "") && Styles.buttonDisabled]}
                        onPress={handleSubmit}
                        disabled={name == "" || price == "" || size == ""}
                    >
                        <Text style={TextStyles.light}>Post</Text>
                    </TouchableOpacity>

                </ScrollView>
            </View>
            <NavBar />
        </>
    );
}

function UploadPhotosCarousel({ images, onAddImages }: { images: string[]; onAddImages: () => Promise<void> }): JSX.Element {
    return (
        <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {images.map((imageUri, index) => (
                    <Image key={index} source={{ uri: imageUri }} style={Styles.image} resizeMode="cover" />
                ))}
                <TouchableOpacity style={[Styles.buttonLight, { backgroundColor:Colors.dark60, width: 220, height: 220, borderColor:Colors.dark, borderWidth:1 }]} onPress={onAddImages}>
                    <Text style={TextStyles.h3}>{images.length >= 10 ? "10 Photos Limit Reached" : "Upload Images"}</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
        
    );
}



function FormGroup({ labelText, placeholderText, value, setter, error, keyboardType, multiline, required}: {
    labelText: string;
    placeholderText: string;
    value: string;
    setter: React.Dispatch<React.SetStateAction<string>>;
    error: string;
    keyboardType?: string;
    multiline?: boolean;
    required?: boolean;
}): JSX.Element {
    return (
        <View style={CreateListingStyles.formGroup}>
             <View style={Styles.row}>
                <Text style={[TextStyles.h3, { textAlign: 'left' }]}>{labelText} </Text>  
                {required? <Text style={[TextStyles.required]}>*required</Text> : null }
            </View>
            <TextInput  
                style={[Styles.input, multiline ? CreateListingStyles.textArea : null]} 
                placeholder={placeholderText} 
                value={value} 
                onChangeText={setter} 
                keyboardType={keyboardType as KeyboardTypeOptions}
                textAlignVertical={multiline ? 'top' : 'center'} 
                multiline={multiline}
            />
            {error && <Text style={[TextStyles.error, {marginTop:-10}]}>{error}</Text>}
        </View>
    );
}


function Dropdown({ labelText, selectedValue, onValueChange, options, error, required }: {
  labelText: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: string[];
  error: string;
  required?: boolean;
}): JSX.Element {
  const data = options.map((option, index) => ({
      key: index,
      label: option,
      value: option,
  }));

  return (
    <>
      <View style={CreateListingStyles.formGroup}>
        <View style={Styles.row}>
            <Text style={[TextStyles.h3, { textAlign: 'left' }]}>{labelText} </Text>  
            {required ? <Text style={[TextStyles.required]}>*required</Text> : null}
        </View>

        <View style={{ position: 'relative' }}> 
            <ModalSelector
                data={data}
                initValue={selectedValue || "Select an option"} 
                onChange={(option) => onValueChange(option.value)}
                initValueTextStyle={selectedValue == "" ? { color: 'gray', textAlign: 'left', marginTop: 4 } : { color: Colors.dark, textAlign: 'left', marginTop: 4 }}
                overlayStyle={{
                    position: 'absolute',
                    top: '35%',
                    width: '90%',
                    maxHeight: 400,
                    backgroundColor: Colors.white,
                    borderRadius: 8,
                    alignSelf: 'center',
                    shadowColor: '#692b20',
                    shadowOpacity: 0.25,
                    shadowRadius: 10,
                    opacity: 0.95
                }}
                optionContainerStyle={{ backgroundColor: 'transparent' }}
                optionStyle={{ backgroundColor: 'transparent' }}
                optionTextStyle={{ color: Colors.dark }}
                selectStyle={{
                    backgroundColor: Colors.light60,
                    height: 45,
                    borderColor: Colors.dark,
                    borderRadius: 8,
                    paddingRight: 30, // Make space for the icon
                    justifyContent: 'center'
                }}
                selectTextStyle={{ color: Colors.dark, textAlign: 'left' }}
                selectedItemTextStyle={{ color: Colors.dark }}
                cancelStyle={{ backgroundColor: Colors.dark }}
                cancelTextStyle={{ color: Colors.white }}
                cancelText='Cancel'
            />
            
            <Ionicons
                name={'chevron-down-outline'}
                size={24}
                color={Colors.dark}
                style={{
                    position: 'absolute',
                    right: 10,
                    top: 15,
                    transform: [{ translateY: -12 }], // Adjusts it to center vertically
                    pointerEvents: 'none' // Prevents blocking touch events
                }}
            />
        </View>

    {error && <Text style={[TextStyles.error, { marginTop: 5 }]}>{error}</Text>}
</View>

        
   </>
  );
}

export const CreateListingStyles = StyleSheet.create({
    formGroup: {
        marginBottom: 10,
        maxWidth: '100%',
        position: 'relative',
    },

    textArea: {
      height: 120,
      textAlignVertical: 'top',

    },
   

});


