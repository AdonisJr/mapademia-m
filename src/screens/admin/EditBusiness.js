import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import { fetchCategory, updateBusiness } from '../../services/apiServices';
import Loading from '../../components/Loading';
import { Picker } from '@react-native-picker/picker';
import { useRefreshStore } from '../../store/refreshStore';
import { getData } from '../../utils/LocalStorage';
import axios from 'axios';
import { API_URL, API_KEY } from '@env';

export default function EditBusiness({ navigation, route }) {
    const data = route.params.data;
    const toggleRefresh = useRefreshStore(state => state.toggleRefresh);
    const [categories, setCategories] = useState([]);
    const [mainDataLoading, setMainDataLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        latitude: data.latitude,
        longitude: data.longitude,
        name: data.name,
        category_id: data.category_id,
        description: data.description,
        address: data.address,
        contact: data.contact,
        email: data.email,
        owner: data.owner,
        other: data.other
    });

    const [image, setImage] = useState(null);

    const handleInputChange = (field, value) => {
        setForm({ ...form, [field]: value });
    };

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
        const accessToken = await getData('accessToken')
        setLoading(true);
        try {
            // Validation
            if (!form.name || !form.category_id || !form.latitude || !form.longitude) {
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
            if (image) {
                formData.append('image', {
                    uri: image,
                    name: 'photo.jpg', // Ensure a valid file name with an extension
                    type: 'image/jpeg', // Adjust MIME type based on your file
                });
            }


            // Make API call
            // const response = await updateBusiness(formData, data.id);
            const response = await axios.post(`${API_URL}/updateBusinesses/${data.id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data',
                }
            });

            // Show success toast
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Business updated successfully!',
            });
            toggleRefresh();

            // Return to the previous screen after a delay
            setTimeout(() => {
                clearForm();
                navigation.goBack();
            }, 2000);
        } catch (error) {
            console.log('Submission Error: ', error.response.data.message);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const clearForm = () => {
        // Reset form after submission
        setForm({
            name: '',
            category_id: '',
            description: '',
            address: '',
            contact: '',
            email: '',
            owner: '',
            other: '',
            latitude: data.latitude.toString(),
            longitude: data.longitude.toString(),
        });
        setImage(null);
    }

    const getCategories = async () => {
        setMainDataLoading(true);
        try {
            const response = await fetchCategory();
            setCategories(response);
        } catch (error) {
            console.log(error);
            Toast.show({ type: 'error', text1: 'Error', text2: error.message });
        } finally {
            setMainDataLoading(false);
        }
    };

    useEffect(() => {
        getCategories();
    }, [])

    if (mainDataLoading) return <Loading />

    return (
        <View className="flex-1 bg-gray-100">
            <Text className="text-2xl text-slate-600 p-4 bg-white sticky top-0">FORM</Text>
            <ScrollView className="bg-white p-4">
                <Text className="text-lg text-slate-700 mb-2">Latitude</Text>
                <TextInput
                    className="border border-gray-300 p-2 rounded mb-4"
                    placeholder="Enter latitude"
                    value={form.latitude}
                    onChangeText={(text) => handleInputChange('latitude', text)}
                />

                <Text className="text-lg text-slate-700 mb-2">Longitude</Text>
                <TextInput
                    className="border border-gray-300 p-2 rounded mb-4"
                    placeholder="Enter longitude"
                    value={form.longitude}
                    onChangeText={(text) => handleInputChange('longitude', text)}
                />

                <Text className="text-lg text-slate-700 mb-2">Name</Text>
                <TextInput
                    className="border border-gray-300 p-2 rounded mb-4"
                    placeholder="Enter business name"
                    value={form.name}
                    onChangeText={(text) => handleInputChange('name', text)}
                />

                <View className="border border-gray-300 p-2 rounded mb-2">
                    <Text className="text-lg text-slate-700">Category</Text>
                    <Picker
                        selectedValue={form.category_id}
                        onValueChange={(text) => handleInputChange('category_id', text)}
                        style={{ height: 50, width: '100%' }}
                    >
                        <Picker.Item label="Select category" value="" enabled={false} />
                        {categories.length > 0 ? (
                            categories.map((data) => (
                                <Picker.Item
                                    key={data?.id}
                                    label={data?.name}
                                    value={data?.id}
                                />
                            ))
                        ) : (
                            <Picker.Item label="No available category" value="" enabled={false} />
                        )}
                    </Picker>
                </View>

                <Text className="text-lg text-slate-700 mb-2">Description</Text>
                <TextInput
                    className="border border-gray-300 p-2 rounded mb-4"
                    placeholder="Enter description"
                    value={form.description}
                    onChangeText={(text) => handleInputChange('description', text)}
                />

                <Text className="text-lg text-slate-700 mb-2">Address</Text>
                <TextInput
                    className="border border-gray-300 p-2 rounded mb-4"
                    placeholder="Enter address"
                    value={form.address}
                    onChangeText={(text) => handleInputChange('address', text)}
                />

                <Text className="text-lg text-slate-700 mb-2">Contact</Text>
                <TextInput
                    className="border border-gray-300 p-2 rounded mb-4"
                    placeholder="Enter contact"
                    value={form.contact}
                    onChangeText={(text) => handleInputChange('contact', text)}
                />

                <Text className="text-lg text-slate-700 mb-2">Email</Text>
                <TextInput
                    className="border border-gray-300 p-2 rounded mb-4"
                    placeholder="Enter email"
                    value={form.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                />

                <Text className="text-lg text-slate-700 mb-2">Owner</Text>
                <TextInput
                    className="border border-gray-300 p-2 rounded mb-4"
                    placeholder="Enter owner"
                    value={form.owner}
                    onChangeText={(text) => handleInputChange('owner', text)}
                />

                <Text className="text-lg text-slate-700 mb-2">Operating Hours</Text>
                <TextInput
                    className="border border-gray-300 p-2 rounded mb-4"
                    placeholder="Enter other"
                    value={form.other}
                    onChangeText={(text) => handleInputChange('other', text)}
                />

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
                        className="w-full h-40 rounded mb-4"
                        resizeMode="cover"
                    />
                )}

                <TouchableOpacity
                    className="bg-blue-500 p-4 rounded mt-4 mb-6"
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white text-center text-lg">Save Business</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
            <Toast />
        </View>
    );
}