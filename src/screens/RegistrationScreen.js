
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react'

export default function RegistrationScreen({ navigation }) {
    const [credentials, setCredentials] = useState({
        email: null,
        firstname: null,
        middlename: null,
        lastname: null,
        year_level: null,
        gender: 'male',
        password: null,
        confirm_password: null
    })

    // handle register

    const handleRegister = async () => {
        console.log(credentials)
    }

    return (
        <View className="flex-1">
            <View className="flex-row items-center justify-center mt-5 bg-gray-100">
                <Text className="text-4xl mt-10 font-bold text-blue-500 mb-10">Welcome</Text>
            </View>
            <ScrollView className="flex-1 bg-gray-100">
                <View className="flex-1 items-center justify-center p-4">

                    {/* firstname input */}
                    <TextInput
                        placeholder="First Name"
                        value={credentials.firstname}
                        onChangeText={(value) => setCredentials({ ...credentials, firstname: value })}
                        className="bg-white w-5/6 p-4 mb-4 rounded-lg shadow-md text-lg"
                        keyboardType="default"
                        autoCapitalize="none"
                    />

                    {/* middlename input */}
                    <TextInput
                        placeholder="Middle Name"
                        value={credentials.middlename}
                        onChangeText={(value) => setCredentials({ ...credentials, middlename: value })}
                        className="bg-white w-5/6 p-4 mb-4 rounded-lg shadow-md text-lg"
                        keyboardType="default"
                        autoCapitalize="none"
                    />

                    {/* lastname input */}
                    <TextInput
                        placeholder="Last Name"
                        value={credentials.lastname}
                        onChangeText={(value) => setCredentials({ ...credentials, lastname: value })}
                        className="bg-white w-5/6 p-4 mb-4 rounded-lg shadow-md text-lg"
                        keyboardType="default"
                        autoCapitalize="none"
                    />

                    {/* Email input */}
                    <TextInput
                        placeholder="Email"
                        value={credentials.email}
                        onChangeText={(value) => setCredentials({ ...credentials, email: value })}
                        className="bg-white w-5/6 p-4 mb-4 rounded-lg shadow-md text-lg"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    {/* <View className="bg-white w-5/6 p-1 mb-4 rounded-lg shadow-md text-lg">
                        <Picker
                            selectedValue={credentials.gender}
                            onValueChange={(value) => setCredentials({ ...credentials, gender: value })}
                        >
                            <Picker.Item label="Male" value="male" />
                            <Picker.Item label="Female" value="female" />
                        </Picker>
                    </View> */}

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
                        value={credentials.confirm_password}
                        onChangeText={(value) => setCredentials({ ...credentials, confirm_password: value })}
                        className="bg-white w-5/6 p-4 mb-6 rounded-lg shadow-md text-lg"
                        secureTextEntry
                    />

                    {/* Login button */}
                    <TouchableOpacity
                        onPress={handleRegister}
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
        </View>
    )
}