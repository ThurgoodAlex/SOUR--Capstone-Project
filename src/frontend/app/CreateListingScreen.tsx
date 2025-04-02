import { NavBar } from '@/components/NavBar';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { api, useApi } from '@/context/api';
import { useAuth } from '@/context/auth';
import { useUser } from '@/context/user';
import * as ImagePicker from "expo-image-picker";
import { router, Stack } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, Alert, KeyboardTypeOptions, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Colors } from '@/constants/Colors';
import ModalSelector from 'react-native-modal-selector';
import * as Yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { Button } from 'react-native'; // Add this line if using the Button from react-native
import { usePosts } from '@/hooks/usePosts';
import { Post } from '@/constants/Types';
import { LinkedItemsSelection } from '@/components/LinkItemsSelection';
import useUploadImages from '@/hooks/useUploadImages';
import useCreateFormData from '@/hooks/useCreateFormData';
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
    const {uploadingImages} = useUploadImages();
    const { creatingFormData } = useCreateFormData();
    const [loading, setLoading] = useState(false);
    const [aiGenerated, setAiGenerated] = useState(false);
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
    const [ tags, setTags] = useState<string[]>([]);
    const [ colors, setColors] = useState<string[]>([]);


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

            if (images.length > 0) {
                await new Promise((resolve) => setTimeout(resolve, 100));
                const formData = creatingFormData(images, listingId);
                
                const uploadedImages = await uploadingImages(await formData);
                console.log("uploadedImages", uploadedImages);
            }
    
            // Link listing to selected posts
            for (const post of linkedPosts) {
                console.log("linking post id = ", post.id)
                const linkResponse = await api.post(`/posts/${post.id}/link/${listingId}/`);

                console.log(linkResponse.json())
                if (!linkResponse.ok) {
                    console.error(`Failed to link post ${post.id} with listing ${listingId}`);
                }
            }


            //upload tags
            for (const tag of tags) {
                const tagResponse = await api.post(`/posts/${listingId}/tags/`, { tag: tag });
                if (!tagResponse.ok) {
                    console.error(`Failed to upload tag ${tag} for listing ${listingId}`);
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
    
    const generateWithAI = async (): Promise<void> => {
        console.log("Generate AI listing Info");
    
        const visionApiKey = "AIzaSyDhh_6MMBG62N4NzGJeLVj4CksuF69Kui4";
        const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${visionApiKey}`;
    
        setLoading(true);
    
        let allTags: string[] = [];  // Temporary array to collect all tags
    
        for (const image of images) {
            try {
                const base64ImageData = await FileSystem.readAsStringAsync(image, {
                    encoding: FileSystem.EncodingType.Base64,
                });
    
                const requestData = {
                    requests: [
                        {
                            image: { content: base64ImageData },
                            features: [
                                { type: "LABEL_DETECTION", maxResults: 8 },
                                { type: "TEXT_DETECTION" },
                            ],
                        },
                    ],
                };
    
                const response = await fetch(visionApiUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestData),
                });
    
                if (!response.ok) {
                    Alert.alert("Error", "Failed to generate tags with AI.");
                    setLoading(false);
                    return;
                }
    
                const data = await response.json();
                console.log("AI Generated Data: ", data);
    
                const labels = data.responses[0]?.labelAnnotations || [];
                const filteredLabels = labels
                    .filter((label: any) => label.score >= 0.8)
                    //only keep labels that are not already in the tags
                    .filter((label: any) => !allTags.includes(label.description))
                    .map((label: any) => label.description);
    
                const textAnnotations = data.responses[0]?.textAnnotations|| [];
                const generatedText = textAnnotations[0]?.description || "";

                // Replace new lines with spaces
                const cleanedText = generatedText.replace(/\n/g, " ");
                // Remove any unwanted characters, allow %, $ and @
                let sanitizedText = cleanedText.replace(/[^a-zA-Z0-9\s%$@]/g, "");
                // minimum 3 characters
                const minLength = 3;
                const maxLength = 20;
                if(sanitizedText.length < minLength || sanitizedText.length > maxLength) {
                    console.log("Text too short or too long, skipping");
                    sanitizedText = null;
                }


              
    
                // Collect tags for this image
                const newTags = [
                    ...filteredLabels,
                    ...(sanitizedText ? [sanitizedText] : [])
                ];
    
                console.log("Tags for image:", newTags);
    
                // Append the tags for this image to the final list
                allTags = [...allTags, ...newTags];
    
            } catch (error) {
                console.error("Error processing image:", error);
            }
        }
    
        // Set all tags only once after processing all images
        console.log("All tags combined:", allTags);
        setTags(allTags);
    
        setAiGenerated(true);
        setLoading(false);
    };
    
       

    return (
        <>
            <Stack.Screen
                options={{
                    headerBackButtonDisplayMode: 'minimal'
                }}
            />
            <View style={ScreenStyles.screen}>
                <Text style={[TextStyles.h2, TextStyles.uppercase]}>New Listing</Text>
                <ScrollView>
                    <UploadPhotosCarousel images={images} onAddImages={uploadImages} />

                    <KeyboardAwareScrollView contentContainerStyle={ScreenStyles.screenCentered}>

                        <FormGroup labelText="Name" placeholderText="Enter item name" value={name} setter={setName} error={errors["name"]} required/>
                        <FormGroup labelText="Price" placeholderText="Enter price" value={price} setter={setPrice} error={errors["price"]} keyboardType="numeric" required/>
                        <Dropdown labelText="Gender" selectedValue={gender} onValueChange={setGender} options={["Men's", "Women's", "Unisex"]} error={errors["gender"]} />
                        <Dropdown labelText="Size" selectedValue={size} onValueChange={setSize} options={["XXSmall", "XSmall", "Small", "Medium", "Large", "XLarge", "XXLarge", "XXXLarge", "00", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"]} error={errors["size"]} required/>
                        <FormGroup labelText="Description" placeholderText="Enter item description" value={description} setter={setDescription} error={errors["description"]} multiline/>
                        <FormGroup labelText="Brand" placeholderText="Enter brand" value={brand} setter={setBrand} error={errors["brand"]}/>
                        <Dropdown labelText="Condition" selectedValue={condition} onValueChange={setCondition} options={["New", "Like New", "Good", "Fair", "Needs Repair"]} error={errors["condition"]}/>
                        
                        <Text style={[TextStyles.h3, { textAlign: 'left' }]}>Colors</Text>
                        <ColorTags colors={colors} setter={setColors} error={errors["colors"]}/>
                    
                        <Text style={[TextStyles.h3, { textAlign: 'left' }]}>Tags</Text>
                        {images.length > 0 &&
                            <TouchableOpacity 
                                style={[Styles.buttonLight, 
                                    { 
                                        padding:0,  
                                        backgroundColor: aiGenerated || loading ? Colors.white : Colors.green,
                                        width: 220, 
                                        height: 40, 
                                        borderColor: aiGenerated ? Colors.green60 : Colors.green,
                                        borderWidth:2,
                                    }

                                ]}
                                onPress={generateWithAI}
                                disabled={images.length == 0 || aiGenerated}
                            >
                                <View style={[Styles.row, {gap: 5}]}>
                                    <Text 
                                        style={aiGenerated? {color:Colors.green60, fontWeight:'bold'}: loading ? {color:Colors.green, fontWeight:'bold'}: TextStyles.light}
                                    >
                                    {loading ? ("Generating Tags") : (aiGenerated ? "Tags generated by AI" : "Generate Tags with AI")}
                                    </Text>
                                    {loading ? 
                                        <ActivityIndicator size="small" color={Colors.green} style={{marginLeft: 5}} /> 
                                        : <Ionicons name="sparkles" size={16} color={aiGenerated? Colors.green60 : Colors.white} />
                                    }
                                </View>
                            </TouchableOpacity>
                            
                        }
                        <Tags tags={tags} setter={setTags} error={errors["tags"]}/>

                        {linkedPosts.length > 0 &&  <LinkInputDropdown posts={posts} selected={linkedPosts} setter={setLinkedPosts} columns={3} isListing={true}/>}


                    </KeyboardAwareScrollView>

                   

                    
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


function Tags({ tags, setter, error }: {
    tags: string[];
    setter: React.Dispatch<React.SetStateAction<string[]>>;
    error: string;
}): JSX.Element {
    const [input, setInput] = useState("");

    const handleInputChange = (text: string): void => {
        setInput(text);
    };

    const handleKeyPress = (event: any): void => {
        if (input.trim()) {
            const newTag: string = input.trim();
            if (newTag && !tags.includes(newTag)) {
                setter([...tags, newTag]);
            }
            setInput("");  // Clear input after adding tag
        }
    };

    const removeTag = (index: number): void => {
        const newTags: string[] = tags.filter((_, i) => i !== index);
        setter(newTags);
    };

    return (
        <View style={Styles.column}>
           
            <View style={CreateListingStyles.tagsContainer}>
                {tags.map((tag, index) => (
                    <View key={index} style={CreateListingStyles.tag}>
                        <Text style={{color:Colors.dark}}>{tag}</Text>
                        <TouchableOpacity onPress={() => removeTag(index)}>
                            <Text style={CreateListingStyles.removeBtn}>✕</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                <TextInput
                    style={[CreateListingStyles.tagInput]}
                    placeholder="Type a tag and press enter"
                    value={input}
                    onChangeText={handleInputChange}
                    onSubmitEditing={handleKeyPress}
                />
            </View>

            {error && <Text style={TextStyles.error}>{error}</Text>}
        </View>
    );
};





const basicColors = [
    { name: 'Red', hex: '#FF0000' },
    { name: 'Orange', hex: '#FFA500' },
    { name: 'Yellow', hex: '#FFFF00' },
    { name: 'Green', hex: '#008000' },
    { name: 'Blue', hex: '#0000FF' },
    { name: 'Purple', hex: '#800080' },
    { name: 'Pink', hex: '#FFC0CB' },
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Gray', hex: '#808080' },
    { name: 'Brown', hex: '#A52A2A' }
];
function ColorTags({ colors, setter, error }: {
    colors: string[];
    setter: React.Dispatch<React.SetStateAction<string[]>>;
    error: string;
}): JSX.Element {
    const toggleColor = (color: string) => {
        if (colors.includes(color)) {
            setter(colors.filter(c => c !== color));
        } else {
            setter([...colors, color]);
        }
    };


    return (
        <ScrollView style={{ marginBottom: 25 }}>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {colors.map((color) => {
                    const colorData = basicColors.find(c => c.name === color);
                    return colorData ? (
                        <View
                            key={color}
                            style={CreateListingStyles.tag}
                        >
                            <View style= {
                                {
                                    backgroundColor: colorData.hex,
                                    width: 16,
                                    height: 16,
                                    borderRadius: 10,
                                    marginRight: 2,
                                }
                            }>
                                
                            </View>
                            <Text style={{ color: Colors.dark }}>{color}</Text>
                            <TouchableOpacity onPress={() => toggleColor(color)}>
                                <Text style={CreateListingStyles.removeBtn}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null;
                })}
            </View>
            
            {/* Color Checkboxes */}
            <View style={
                {   
                    flexDirection: 'column', 
                    alignContent: 'space-between',
                    flexWrap: 'wrap', 
                    paddingLeft: 10,
                    maxHeight:120,
                    padding: 4,
                    borderWidth: 1,
                    borderColor: Colors.dark,
                    borderRadius: 8,

                }}>
                {basicColors.map(({ name, hex }) => (
                    <TouchableOpacity
                        key={name}
                        onPress={() => toggleColor(name)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 3,
                            marginRight:18
                        }}
                    >
                         {colors.includes(name) && <Text style={{ color: '#692b2095', fontWeight: '400', fontSize:22, position: 'absolute', left:5 }}>X</Text>}
                        <View
                            style={{
                                width: 18,
                                height: 18,
                                borderWidth: 1,
                                borderColor: Colors.dark,
                                borderRadius: 4,
                                marginRight: 8
                            }}
                        />
                        
                        <Text style={{color:Colors.dark}}>{name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            {error && <Text style={{ color: Colors.grapefruit }}>{error}</Text>}
        </ScrollView>
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
      <View style={[CreateListingStyles.formGroup, { marginBottom: 20 }]}>
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
                    top: 13,
                    right:10,
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
    tag:{
        flexDirection: "row",
        gap:3,
        alignItems: "center",
        backgroundColor: Colors.light60,
        borderRadius: 8,
        padding: 5,
        margin: 2,
        color: Colors.dark
    },
    tagsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.dark,
        borderRadius: 8,
        padding: 10,
        minHeight: 50,
        marginBottom: 10,
    },
    tagInput:{
        backgroundColor: Colors.white,
        width:'100%',
        borderRadius: 8,
        fontSize: 16,
        marginTop:8,
    },
    removeBtn: {
        color: Colors.dark60,
        fontWeight: "bold",
    },
   

});


function creatingFormData(images: string[], id: any) {
    throw new Error('Function not implemented.');
}

