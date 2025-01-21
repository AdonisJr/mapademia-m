import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { insertMenu } from '../../services/apiServices';
import { useRefreshStore } from '../../store/refreshStore';

export default function InsertMenus({ navigation, route }) {
    const data = route.params.data;

    const toggleRefresh = useRefreshStore(state => state.toggleRefresh);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [form, setForm] = useState({
        business_id: data.id,
        name: '',
        description: '',
        price: '',
        image: ''
    })


    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Toast.show({
                type: 'error',
                text1: 'Permission Denied',
                text2: 'We need access to your photos to upload an image.',
            });
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            // aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };


    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Validation
            if (!form.name || !form.description || !form.price || !image) {
                Toast.show({
                    type: 'error',
                    text1: 'Validation Error',
                    text2: 'Please fill in all required fields.',
                });
                setLoading(false);
                return;
            }

            // Prepare FormData
            const formData = new FormData();
            Object.keys(form).forEach(key => {
                formData.append(key, form[key]);
            });

            // Handle image attachment
            formData.append('image', {
                uri: image,
                name: 'photo.jpg', // Ensure a valid file name with an extension
                type: 'image/jpeg', // Adjust MIME type based on your file
            });

            // Make API call
            const response = await insertMenu(formData);

            // Show success toast
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Menu added successfully!',
            });
            toggleRefresh();

            // Return to the previous screen after a delay
            setTimeout(() => {
                // clearForm();
                // navigation.goBack();
                navigation.navigate('Business');
            }, 2000);

        } catch (error) {
            console.log('Submission Error: ', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message,
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <View className="flex-1 h-screen bg-gray-100">
            <View className="flex flex-row justify-between items-center bg-white pe-2">
                <Text className="text-2xl w-3/6 text-slate-600 p-4 bg-white sticky top-0">FORM</Text>
                <TouchableOpacity
                    className="bg-blue-500 p-4 rounded mt-4 mb-6"
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white text-center text-lg">SUBMIT</Text>
                    )}
                </TouchableOpacity>
            </View>
            <ScrollView className="bg-white p-4">

                <Text className="text-lg text-slate-700 mb-2">Name</Text>
                <TextInput
                    className="border border-gray-300 p-2 rounded mb-4"
                    placeholder="Enter name"
                    value={form.name}
                    onChangeText={(value) => setForm({ ...form, name: value })}
                />

                <Text className="text-lg text-slate-700 mb-2">Description</Text>
                <TextInput
                    className="border border-gray-300 p-2 rounded mb-4"
                    placeholder="Enter description"
                    value={form.description}
                    onChangeText={(value) => setForm({ ...form, description: value })}
                />

                <Text className="text-lg text-slate-700 mb-2">Price</Text>
                <TextInput
                    className="border border-gray-300 p-2 rounded mb-4"
                    placeholder="Enter price"
                    value={form.price}
                    onChangeText={(value) => setForm({ ...form, price: value })}
                    keyboardType='numeric'
                />

                {/* image */}
                <Text className="text-lg text-slate-700 mb-2">Image</Text>
                <TouchableOpacity
                    className="bg-gray-200 p-4 rounded mb-4"
                    onPress={pickImage}
                >
                    <Text className="text-center text-slate-700">{image ? 'Change Image' : 'Pick an Image'}</Text>
                </TouchableOpacity>
                {image && (
                    <Image
                        source={{ uri: image }}
                        className="w-full h-5/6 rounded mb-4 border-2 border-slate-100 shadow"
                        resizeMode="stretch"
                    />
                )}


            </ScrollView>
            <Toast />
        </View>
    )
}