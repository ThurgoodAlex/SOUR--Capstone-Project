import { LinkInputDropdown } from '@/components/LinkInputDropdown';
import { NavBar } from '@/components/NavBar';
import { Colors } from '@/constants/Colors';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';
import { Post } from '@/constants/Types';
import { api, useApi } from '@/context/api';
import { useAuth } from '@/context/auth';
import { useUser } from '@/context/user';
import { usePosts } from '@/hooks/usePosts';
import * as ImagePicker from "expo-image-picker";
import { router, Stack } from 'expo-router';
import { useState } from 'react';

import useUploadImages from '@/hooks/useUploadImages';  // Custom hook for videos
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import useCreateFormData from '@/hooks/useCreateFormData';
import { Video, ResizeMode } from 'expo-av';  // Import Video and ResizeMode from expo-av

export default function CreateVideo() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [video, setVideo] = useState<string | null>(null);  // Single video URI
    const [error, setError] = useState(null);
    const api = useApi();
    const [loading, setLoading] = useState(false);
    const { logout } = useAuth();
    const { user } = useUser();
    const { posts } = usePosts(`/users/${user?.id}/posts/?is_listing=true`);
    const [linkedListings, setLinkedListings] = useState<Post[]>([]);
    const { creatingFormData } = useCreateFormData();
    const { uploadingImages } = useUploadImages();  // Custom hook for videos

    // Pick a single video from the device's media library
    const uploadVideo = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            Alert.alert("Permission Denied", "We need media library permissions to upload a video.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'videos',  // Video only
            allowsMultipleSelection: false,  // Only one video
            quality: 1,  // Max quality
        });

        console.log('Video Picker Result:', result);

        if (!result.canceled && result.assets?.[0]) {
            const videoUri = result.assets[0].uri;
            setVideo(videoUri);
            setError(null);  // Clear any previous errors
        }
    };

    const handleSubmit = async () => {
        if (!video) {
            Alert.alert('Error', 'Please select a video to upload.');
            return;
        }

        try {
            setLoading(true);

            console.log("Submitting post with video:", video);

            // Create post first
            const response = await api.post("/posts/", {
                "title": name,
                "description": description,
            });

            const result = await response.json();

            if (!response.ok) {
                Alert.alert('Error', 'Failed to create post.');
                return;
            }

            console.log("Created post:", result);

            const postId = result.id;

            // Upload the video
            if (video) {
                const formData = creatingFormData([video], postId);
                const uploadedVideo = await uploadingImages(await formData);
                console.log("Uploaded Video:", uploadedVideo);
            }

            // Link listing to selected posts
            for (const listing of linkedListings) {
                console.log("Linking post id =", listing.id);
                const linkResponse = await api.post(`/posts/${postId}/link/${listing.id}/`);

                if (!linkResponse.ok) {
                    console.error(`Failed to link post ${postId} with listing ${listing.id}`);
                }
            }

            router.replace("/SelfProfileScreen");
        } catch (error) {
            console.error('Error creating post:', error);
            Alert.alert('Error', 'Failed to connect to the server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Stack.Screen options={{ headerBackButtonDisplayMode: 'minimal' }} />
            <View style={ScreenStyles.screen}>
                <Text style={[TextStyles.h2, TextStyles.uppercase]}>New Video Post</Text>

                {/* Video Upload Section */}
                <VideoUploadSection video={video} onUpload={uploadVideo} />

                <ScrollView>
                    <FormGroup labelText="Name" placeholderText="Enter post name" value={name} setter={setName} required />
                    <FormGroup labelText="Caption" placeholderText="Enter caption" value={description} setter={setDescription} multiline />
                    <LinkInputDropdown posts={posts} selected={linkedListings} setter={setLinkedListings} columns={1} />

                    <TouchableOpacity
                        style={[Styles.buttonDark, (!name || !video) && Styles.buttonDisabled]}
                        onPress={handleSubmit}
                        disabled={!name || !video || loading}
                    >
                        <Text style={TextStyles.light}>{loading ? "Uploading..." : "Post"}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
            <NavBar />
        </>
    );
}

function VideoUploadSection({ video, onUpload }: { video: string | null; onUpload: () => void }) {
    return (
        <View style={Styles.column}>
            {video ? (
                <Video
                    source={{ uri: video }}
                    style={{ width: '100%', height: 200 }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping
                    shouldPlay
                />
            ) : (
                <TouchableOpacity style={[Styles.buttonLight, { height: 200 }]} onPress={onUpload}>
                    <Text style={TextStyles.h3}>Upload Video</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

function FormGroup({ labelText, placeholderText, value, setter, multiline, required }: {
    labelText: string;
    placeholderText: string;
    value: string;
    setter: React.Dispatch<React.SetStateAction<string>>;
    multiline?: boolean;
    required?: boolean;
}): JSX.Element {
    return (
        <View style={CreateVideoStyles.formGroup}>
            <View style={Styles.row}>
                <Text style={[TextStyles.h3, { textAlign: 'left' }]}>{labelText} </Text>
                {required && <Text style={[TextStyles.required, { marginBottom: 5 }]}>*required</Text>}
            </View>
            <TextInput
                style={[Styles.input, multiline ? CreateVideoStyles.textArea : null]}
                placeholder={placeholderText}
                value={value}
                onChangeText={setter}
                textAlignVertical={multiline ? 'top' : 'center'}
                multiline={multiline}
            />
        </View>
    );
}

export const CreateVideoStyles = StyleSheet.create({
    formGroup: {
        marginBottom: 12,
        maxWidth: '100%',
        position: 'relative',
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
});
