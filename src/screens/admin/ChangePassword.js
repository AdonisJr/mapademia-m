import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import { changePassword } from '../../services/apiServices';
import Loading from '../../components/Loading';
import { Picker } from '@react-native-picker/picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function ChangePassword({ navigation, route }) {
    const formData = route.params.data;
    const [mainDataLoading, setMainDataLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const handleInputChange = (field, value) => {
        setForm({ ...form, [field]: value });
    };


    const handleSubmit = async () => {
        setLoading(true);
        console.log(form)
        try {
            // Validation
            if (!form.current_password) {
                Toast.show({
                    type: 'error',
                    text1: 'Validation Error',
                    text2: 'Password is required',
                });
                setLoading(false);
                return;
            }

            if (form.new_password.length < 6) {
                Toast.show({
                    type: 'error',
                    text1: 'Validation Error',
                    text2: 'Password must be atleast 6 characters long',
                });
                setLoading(false);
                return;
            }

            if (form.new_password !== form.new_password_confirmation) {
                Toast.show({
                    type: 'error',
                    text1: 'Validation Error',
                    text2: 'Password not match',
                });
                setLoading(false);
                return;
            }

            // Make API call
            const response = await changePassword(form, formData.id);

            // Show success toast
            Toast.show({
                type: 'success',
                text1: 'Success Changing Password',
                text2: 'CHanging password completed!',
            });

            // Return to the previous screen after a delay
            setTimeout(() => {
                navigation.goBack();
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
            other: ''
        });
    }

    if (mainDataLoading) return <Loading />

    return (
        <View className="flex-1 bg-gray-100">
            <View className="flex flex-row pe-2 justify-between items-center">
                <Text className="text-2xl text-slate-600 px-4 pt-4 bg-white sticky top-0">FORM</Text>
            </View>
            <ScrollView className="bg-white p-4">


                <Text className="text-lg text-slate-700 mb-2">Current Password</Text>
                <TextInput
                    className="border border-gray-300 p-2 rounded mb-4"
                    placeholder="Enter Current Password"
                    value={form.current_password}
                    onChangeText={(text) => handleInputChange('current_password', text)}
                />
                <Text className="text-lg text-slate-700 mb-2">New Password</Text>

                <TextInput
                    className="border border-gray-300 p-2 rounded mb-4"
                    placeholder="Enter New Password"
                    value={form.new_password}
                    onChangeText={(text) => handleInputChange('new_password', text)}
                />

                <Text className="text-lg text-slate-700 mb-2">Password Confirmation</Text>
                <TextInput
                    className="border border-gray-300 p-2 rounded mb-4"
                    placeholder="Enter Password Confirmation"
                    value={form.new_password_confirmation}
                    onChangeText={(text) => handleInputChange('new_password_confirmation', text)}
                />


                <TouchableOpacity
                    className="bg-teal-500 rounded-full p-4 mt-4 mb-8"
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white text-center text-lg">Change Password</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
            <Toast />
        </View>
    );
}