
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import logo from '../../assets/mapademia.png';
import logoText from '../../assets/logotext.png';
import Toast from 'react-native-toast-message';
import { API_URL, MAIN_URL, PROJECT_ID } from '@env'; // Import your project ID
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import Loading from '../components/Loading';

export default function RegistrationScreen({ navigation }) {
    const [credentials, setCredentials] = useState({
        email: null,
        firstname: null,
        middlename: null,
        lastname: null,
        gender: '',
        password: null,
        password_confirmation: null,
        role: 'user'
    })
    const [loading, setLoading] = useState(false);

    // handle register

    const handleSubmit = async () => {
        // return console.log(credentials)
        setLoading(true);
        try {
            // Validation
            if (!credentials.firstname || !credentials.lastname || !credentials.email || !credentials.middlename) {
                Toast.show({
                    type: 'error',
                    text1: 'Validation Error',
                    text2: 'Please fill in all required fields.',
                });
                setLoading(false);
                return;
            }

            if (credentials.password.length < 6) {
                Toast.show({
                    type: 'error',
                    text1: 'Validation Error',
                    text2: 'Password must be atleast 6 characters long',
                });
                setLoading(false);
                return;
            }

            if (credentials.password !== credentials.password_confirmation) {
                Toast.show({
                    type: 'error',
                    text1: 'Validation Error',
                    text2: 'Password not match',
                });
                setLoading(false);
                return;
            }
            // Make API call
            const response = await axios.post(`${API_URL}/register`, credentials);

            // Show success toast
            Toast.show({
                type: 'success',
                text1: 'Registration',
                text2: 'Registration successfully!',
            });

            // Return to the previous screen after a delay
            setTimeout(() => {
                navigation.goBack();
            }, 2000);
        } catch (error) {
            console.log('Submission Error: ', error.response.data.message);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.response.data.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1">
            <View className="flex-row items-center justify-center mt-5 bg-gray-100">
                <View className="flex flex-col items-center mt-10">
                    <Image
                        source={logo}
                        style={{ width: 100, height: 100 }}

                    />
                    {/* <Image
                        source={logoText}
                        className="rounded-lg"
                        style={{ width: 150, height: 50 }}
                        resizeMode="stretch"
                    /> */}
                </View>
            </View>
            <ScrollView className="flex-1 bg-gray-100">
                <View className="flex-1 items-center justify-center p-4">

                    {/* firstname input */}
                    <TextInput
                        placeholder="First Name"
                        value={credentials.firstname}
                        onChangeText={(value) => setCredentials({ ...credentials, firstname: value })}
                        className="bg-white w-5/6 p-4 mb-2 rounded-lg shadow-md text-lg"
                        keyboardType="default"
                        autoCapitalize="none"
                    />

                    {/* middlename input */}
                    <TextInput
                        placeholder="Middle Name"
                        value={credentials.middlename}
                        onChangeText={(value) => setCredentials({ ...credentials, middlename: value })}
                        className="bg-white w-5/6 p-4 mb-2 rounded-lg shadow-md text-lg"
                        keyboardType="default"
                        autoCapitalize="none"
                    />

                    {/* lastname input */}
                    <TextInput
                        placeholder="Last Name"
                        value={credentials.lastname}
                        onChangeText={(value) => setCredentials({ ...credentials, lastname: value })}
                        className="bg-white w-5/6 p-4 mb-2 rounded-lg shadow-md text-lg"
                        keyboardType="default"
                        autoCapitalize="none"
                    />

                    {/* Email input */}
                    <TextInput
                        placeholder="Email"
                        value={credentials.email}
                        onChangeText={(value) => setCredentials({ ...credentials, email: value })}
                        className="bg-white w-5/6 p-4 mb-2 rounded-lg shadow-md text-lg"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    {/* <View className="bg-white w-5/6 p-1 mb-2 rounded-lg shadow-md text-lg">
                        <Picker
                            selectedValue={credentials.gender}
                            onValueChange={(value) => setCredentials({ ...credentials, gender: value })}
                        >
                            <Picker.Item label="Male" value="male" />
                            <Picker.Item label="Female" value="female" />
                        </Picker>
                    </View> */}

                    <View className="w-5/6 bg-white p-2 rounded mb-2">
                        <Text className="text-lg text-slate-700">Gender</Text>
                        <Picker
                            selectedValue={credentials.gender}
                            onValueChange={(text) => setCredentials({ ...credentials, gender: text })}
                            style={{ height: 50, width: '100%' }}
                        >
                            <Picker.Item label="Select gender" value="" enabled={false} />
                            <Picker.Item label="Male" value="male" enabled={true} />
                            <Picker.Item label="Female" value="female" enabled={true} />
                        </Picker>
                    </View>

                    {/* Password input */}
                    <TextInput
                        placeholder="Password"
                        value={credentials.password}
                        onChangeText={(value) => setCredentials({ ...credentials, password: value })}
                        className="bg-white w-5/6 p-4 mb-6 rounded-lg shadow-md text-lg"
                        secureTextEntry
                    />

                    {/* Confirm Password input */}
                    <TextInput
                        placeholder="Confirm Password"
                        value={credentials.password_confirmation}
                        onChangeText={(value) => setCredentials({ ...credentials, password_confirmation: value })}
                        className="bg-white w-5/6 p-4 mb-6 rounded-lg shadow-md text-lg"
                        secureTextEntry
                    />

                    {/* Login button */}
                    <TouchableOpacity
                        onPress={handleSubmit}
                        className="bg-blue-500 w-5/6 p-4 rounded-lg items-center shadow-lg"
                    >
                        <Text className="text-white text-lg font-bold">Register</Text>
                    </TouchableOpacity>

                    {/* Sign up link */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                        className="mt-4"
                    >
                        <Text>Already have an account?
                            <Text className="text-blue-500 underline"> Sign in</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            {loading && <Loading />}
            <Toast />
        </View>
    )
}