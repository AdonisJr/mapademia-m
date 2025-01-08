import { View, Text, TouchableOpacity, Modal, Image } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react';
import { useCurrentNavStore } from '../store/currentNavStore';
import { useUserStore } from '../store/userStore';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';


import { getData } from '../utils/LocalStorage';
import { useFavoriteStore } from '../store/favoriteStore';

import logo from '../../assets/mapademia.png';
import logoText from '../../assets/logotext.png';

import { useRefreshStore } from '../store/refreshStore';

export default function Header({ navigation, route }) {
  const { initializeFavoriteStore } = useFavoriteStore();
  const favoritesData = useFavoriteStore(state => state.favoritesData);
  const { isRefresh } = useRefreshStore();
  const { currentApp } = useCurrentNavStore();
  const { user, logout } = useUserStore();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const handleLogout = async () => {
    Toast.show({ type: 'success', text1: 'Success', text2: 'Successfully logged out' });
    setTimeout(() => {
      logout();
      navigation.navigate('Login');
      setDropdownVisible(false);
    }, 1000)
  };

  const getFavorite = async () => {
    setFavorites(await getData('favorites'));
  }

  useFocusEffect(
    useCallback(() => {
      // getFavorite();
      setFavorites(favoritesData);
    }, [favoritesData])
  );

  return (
    <View className="bg-slate-100 mt-8">
      <View className="p-4 bg-white rounded-3xl mx-2">
        <View className="absolute -top-2 flex-row w-screen justify-center">
          <View className="bg-slate-100 w-72 h-5 rounded-lg">
            <Text></Text>
          </View>
        </View>
        <View className="flex-row justify-between items-center pl-2">
          <TouchableOpacity
            className="flex-col items-center"
            onPress={() =>
              currentApp === 'MainApp'
                ? navigation.navigate('MainApp') 
                  : navigation.navigate('AdminApp')
            }
          >
            <View className="flex flex-row items-center">
              <Image
                source={logo}
                style={{ width: 30, height: 30 }}

              />
              <Image
                source={logoText}
                className="h-4 w-14 rounded-sm"
                resizeMode="stretch"
              />
            </View>

          </TouchableOpacity>

          <View className="flex-row items-center gap-4">

            <TouchableOpacity onPress={() => setDropdownVisible(true)} className="flex flex-row items-center gap-2">
              <TouchableOpacity onPress={() => navigation.navigate('Your Favorites', { data: favorites })}>
                <MaterialIcons name="favorite" size={18} color={`${favorites.length === 0 ? 'black' : 'red'}`} />
              </TouchableOpacity>
              <View className="bg-slate-200 p-2 rounded-full">
                <Entypo name="user" size={20} color="black" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal
        transparent={true}
        visible={dropdownVisible}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <View
          onPress={() => setDropdownVisible(false)}
          className="bg-black bg-opacity-30">
        </View>
        <TouchableOpacity
          className="flex-1"
          onPress={() => setDropdownVisible(false)}
          activeOpacity={1}
        >
          <View className="absolute top-14 right-4 bg-slate-100 shadow-lg rounded-lg p-4 w-40">
            <Text className="text-lg font-bold mb-2 text-gray-800">{user?.firstname} {user?.lastname}</Text>
            <TouchableOpacity
              className="flex-row items-center py-2"
              onPress={() => {
                navigation.navigate('Settings');
                setDropdownVisible(false);
              }}
            >
              <MaterialIcons name="settings" size={20} color="gray" />
              <Text className="ml-2 text-gray-800">Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center py-2"
              onPress={handleLogout}
            >
              <AntDesign name="logout" size={20} color="gray" />
              <Text className="ml-2 text-gray-800">Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}