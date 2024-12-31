import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { useCurrentNavStore } from '../store/currentNavStore';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useUserStore } from '../store/userStore';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

export default function SettingsScreen({ navigation }) {
  const { logout } = useUserStore();
  const { setNavigation } = useCurrentNavStore();
  const user = useUserStore(state => state.user);

  const handleLogout = async () => {
    Toast.show({ type: 'success', text1: 'Success', text2: 'Successfully logged out' });
    setTimeout(() => {
      logout();
      navigation.navigate('Login');
    }, 1000)
  };

  useFocusEffect(
    useCallback(() => {
      setNavigation('Settings');
    }, [])
  );
  return (
    <View className="bg-white h-screen">
      <View className="flex flex-row justify-center border-b-2 border-slate-100">
        <View className="flex flex-row items-center justify-end w-2/6 h-52">
          <FontAwesome6 name="user-shield" size={60} color="black" className="w-24" />
        </View>
        <View className="flex flex-col ps-4 justify-center w-3/6">
          <Text className="text-2xl">
            {user?.firstname
              ?.split(' ')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ') + ' '
            }

            {user?.lastname
              ?.split(' ')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')
            }
          </Text>
          <Text className="text-xs text-slate-400">Gender: {user?.gender}</Text>
          <Text className="text-xs text-slate-400">Course: {user?.course}</Text>
          <Text className="text-xs text-slate-400">Year Level: {user?.year_level}</Text>
          <Text className="text-xs text-slate-400">Contact: {user?.contact}</Text>
        </View>
      </View>
      <ScrollView className="py-6 px-10 h-5/6">
        <TouchableOpacity className="flex py-4 flex-row items-center gap-1" onPress={() => navigation.navigate('Your Favorites')}>
          <AntDesign name="heart" size={20} color="teal" className="w-8" />
          <Text className="font-bold">
            Your Favorite
          </Text>
        </TouchableOpacity>


        <TouchableOpacity className="flex py-4 flex-row items-center gap-1" onPress={() => navigation.navigate('Change Password', { data: user })}>
          <MaterialIcons name="password" size={20} color="teal" className="w-8" />
          <Text className="font-bold">
            Change Password
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex py-4 flex-row items-center gap-1" onPress={() => navigation.navigate('Manage Information', { data: user })}>
          <Ionicons name="information-circle" size={24} color="teal" className="w-8" />
          <Text className="font-bold">
            Manage Information
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex py-4 flex-row items-center gap-1 mt-10" onPress={handleLogout}>
          <AntDesign name="logout" size={24} color="red" className="w-8" />
          <Text className="font-bold">
            Logout
          </Text>
        </TouchableOpacity>

      </ScrollView>
      <Toast />
    </View>
  )
}