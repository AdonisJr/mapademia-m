import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { fetchUsers } from '../../services/apiServices';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import { useCurrentNavStore } from '../../store/currentNavStore';
import Loading from '../../components/Loading';
import Header from '../../components/Header';

export default function UsersScreen({ navigation }) {
  const { setNavigation } = useCurrentNavStore();
  const [users, setUsers] = useState([]);
  const [mainDataLoading, setMainDataLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setMainDataLoading(false);
    try {
      setMainDataLoading(false);
      const response = await fetchUsers();
      setUsers(response);
    } catch (error) {
      console.log({ businessScreen: error });
    } finally {
      setMainDataLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      setNavigation('Users');
      fetchData();
    }, [])
  );

  if (mainDataLoading) return <Loading />

  return (
    <View>
      <Header navigation={navigation} />
      <View className="px-2">
        <Text className="p-2 text-2xl sticky top-0 font-bold bg-white rounded-lg mt-4 shadow">
          Users List
        </Text>
      </View>
      <ScrollView className="px-3">
        {
          users.filter(user => user.role !== 'admin')
            .map((user, index) => (
              <View key={index} className="p-4 bg-white rounded-lg mt-3">
                <View>
                  <Text className="text-lg font-semibold">{user.firstname} {user.lastname}</Text>
                  <Text className="text-md text-slate-600">{user.email}</Text>
                  <Text className="text-md text-slate-600">{user.gender}</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Your Favorites', { data: business })}
                  className="flex flex-row gap-2 justify-center mt-4 items-center bg-pink-300 p-2 rounded-full">
                  <FontAwesome6 name="edit" size={18} color={'white'} />
                  <Text className="text-white">EDIT</Text>
                </TouchableOpacity>
              </View>
            ))
        }
      </ScrollView>
      <Toast />
    </View>
  )
}