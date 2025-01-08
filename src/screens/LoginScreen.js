// src/screens/LoginScreen.js
import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';
import { useUserStore } from '../store/userStore';
import { API_URL, MAIN_URL, PROJECT_ID } from '@env'; // Import your project ID
import Toast from 'react-native-toast-message'; // Import Toast
import { storeData } from '../utils/LocalStorage';
import logo from '../../assets/mapademia.png';

// component
import Loading from '../components/Loading';


export default function LoginScreen({ navigation }) {
  const { setUser, setAccessToken } = useUserStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(false); // Set loading to true when the login process starts\
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      const token = response.data.token;
      const userDetails = response.data.user;
      setUser(userDetails, token);
      setAccessToken(token);
      storeData('user', userDetails);
      storeData('accessToken', token)
      if (userDetails.role === 'admin') {
        navigation.navigate('AdminApp');
      } else {
        navigation.navigate('MainApp');
      }
      // setUser({ firstname: 'adonis', type: 'general services' })
      // setIsLoading(false); // Set loading to false after the process completes
      // navigation.navigate('MainApp');
    } catch (error) {
      console.log('error on login: ', error)
      Toast.show({ type: 'error', text1: 'Error', text2: 'Invalid login credentials' });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View className="flex-1 justify-center items-center">
      {isLoading && <Loading />}

      <View className="flex-row items-center justify-center mt-5 bg-gray-100 mb-10">
        <View className="flex flex-col items-center">
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
          <Text className="mt-5 text-xl text-slate-500 font-bold">
              Login here
          </Text>
        </View>
      </View>
      {/* Email input */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="bg-white w-5/6 p-4 mb-4 rounded-full shadow-md text-lg"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        contextMenuHidden={true}
      />
      {/* Password input */}
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        className="bg-white w-5/6 p-4 mb-6 rounded-full shadow-md text-lg"
        secureTextEntry
      />



      {/* Login button */}
      <TouchableOpacity
        onPress={handleLogin}
        className="bg-blue-500 w-5/6 p-4 rounded-full shadow-lg"
      >
        <Text className="text-white text-center text-lg font-bold">
          Login
        </Text>
      </TouchableOpacity>

      {/* Sign up link */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
        className="mt-4"
      >
        <Text>Don't have an account?
          <Text className="text-blue-500 underline"> Sign up</Text>
        </Text>
      </TouchableOpacity>
      <Toast />
      {/* Loading Overlay */}

    </View>
  )
}
