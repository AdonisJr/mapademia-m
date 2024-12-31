import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import { fetchCategory, updateUser } from '../../services/apiServices';
import Loading from '../../components/Loading';
import { Picker } from '@react-native-picker/picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Feather from '@expo/vector-icons/Feather';

export default function UpdateUser({ navigation, route }) {
    const formData = route.params.data;
    const [mainDataLoading, setMainDataLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isPasswordEditable, setIsPasswordEditable] = useState(false);
    const [isSecure, setIsSecure] = useState(true);

    const [form, setForm] = useState(formData);

    const handleInputChange = (field, value) => {
        setForm({ ...form, [field]: value });
    };


    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Validation
            if (!form.firstname || !form.lastname || !form.email || !form.middlename) {
                Toast.show({
                    type: 'error',
                    text1: 'Validation Error',
                    text2: 'Please fill in all required fields.',
                });
                setLoading(false);
                return;
            }

            if (isPasswordEditable && form.password.length < 6) {
                Toast.show({
                    type: 'error',
                    text1: 'Validation Error',
                    text2: 'Password must be atleast 6 characters long',
                });
                setLoading(false);
                return;
            }
            // Make API call
            const response = await updateUser(form);

            // Show success toast
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Business added successfully!',
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
                <TouchableOpacity className=" flex flex-row items-center p-1 px-2 bg-emerald-500 rounded-full gap-1"
                    onPress={() => setIsPasswordEditable(!isPasswordEditable)}>
                    {
                        !isPasswordEditable ?
                            <MaterialIcons name="password" size={16} color="white" className="ps-3" /> :
                            <EvilIcons name="check" size={16} color="white" />
                    }
                    <Text className="text-white">
                        Change password
                    </Text>
                </TouchableOpacity>
            </View>
            <ScrollView className="bg-white p-4">
                <Text className="text-lg text-slate-700 mb-2">First Name</Text>
                <TextInput
                    className="border border-gray-300 p-2 rounded mb-4"
                    placeholder="Enter first name"
                    value={form.firstname}
                    onChangeText={(text) => handleInputChange('firstname', text)}
                />

                <Text className="text-lg text-slate-700 mb-2">Middle Name</Text>
                <TextInput
                    className="border border-gray-300 p-2 rounded mb-4"
                    placeholder="Enter middle name"
                    value={form.middlename}
                    onChangeText={(text) => handleInputChange('middlename', text)}
                />

                <Text className="text-lg text-slate-700 mb-2">Last Name</Text>
                <TextInput
                    className="border border-gray-300 p-2 rounded mb-4"
                    placeholder="Enter last name"
                    value={form.lastname}
                    onChangeText={(text) => handleInputChange('lastname', text)}
                />

                <Text className="text-lg text-slate-700 mb-2">Email</Text>
                <TextInput
                    className="border border-gray-300 p-2 rounded mb-4 bg-slate-100"
                    placeholder="Enter email"
                    value={form.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                    editable={false}
                />

                <View className="border border-gray-300 p-2 rounded mb-2">
                    <Text className="text-lg text-slate-700">Gender</Text>
                    <Picker
                        selectedValue={form.gender}
                        onValueChange={(text) => handleInputChange('gender', text)}
                        style={{ height: 50, width: '100%' }}
                    >
                        <Picker.Item label="Select gender" value="" enabled={false} />
                        <Picker.Item label="Male" value="male" enabled={true} />
                        <Picker.Item label="Female" value="female" enabled={true} />
                    </Picker>
                </View>

                <Text className="text-lg text-slate-700 mb-2">Contact</Text>
                <TextInput
                    className="border border-gray-300 p-2 rounded mb-4"
                    placeholder="Enter contact number"
                    value={form.contact}
                    onChangeText={(text) => handleInputChange('contact', text)}
                />

                <View className="border border-gray-300 p-2 rounded mb-2">
                    <Text className="text-lg text-slate-700">Course</Text>
                    <Picker
                        selectedValue={form.course}
                        onValueChange={(text) => handleInputChange('course', text)}
                        style={{ height: 50, width: '100%' }}
                    >
                        <Picker.Item label="Select course" value="" enabled={false} />
                        <Picker.Item label="BSIT" value="bsit" enabled={true} />
                        <Picker.Item label="BSBA" value="bsba" enabled={true} />
                        <Picker.Item label="BSCRIM" value="bscrim" enabled={true} />
                    </Picker>
                </View>

                <View className="border border-gray-300 p-2 rounded mb-2">
                    <Text className="text-lg text-slate-700">Year Level</Text>
                    <Picker
                        selectedValue={form.year_level}
                        onValueChange={(text) => handleInputChange('year_level', text)}
                        style={{ height: 50, width: '100%' }}
                    >
                        <Picker.Item label="Select year level" value="" enabled={false} />
                        <Picker.Item label="1st" value="1st" enabled={true} />
                        <Picker.Item label="2nd" value="2nd" enabled={true} />
                        <Picker.Item label="3rd" value="3rd" enabled={true} />
                        <Picker.Item label="4th" value="4th" enabled={true} />
                    </Picker>
                </View>
                <View className="relative">
                    <Text className="text-lg text-slate-700 mb-2">New Password</Text>
                    <TextInput
                        className={`border border-gray-300 p-2 rounded mb-4 
                    ${isPasswordEditable ? 'bg-emerald-200' : 'bg-slate-200'}`}
                        editable={isPasswordEditable}
                        placeholder="Enter new password"
                        value={form.password}
                        secureTextEntry={isSecure}
                        onChangeText={(text) => handleInputChange('password', text)}
                    />
                    <TouchableOpacity className="absolute bottom-5 right-0 bg-white">
                        <Feather name={!isSecure ? 'eye-off' : 'eye'} size={18} color="black" className="absolute bottom-1 right-2"
                            onPress={() => setIsSecure(!isSecure)} />
                    </TouchableOpacity>
                </View>


                <TouchableOpacity
                    className="bg-teal-500 rounded-full p-4 mt-4 mb-8"
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white text-center text-lg">Save User</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
            <Toast />
        </View>
    );
}