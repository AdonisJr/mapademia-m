import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { useCurrentNavStore } from '../../store/currentNavStore';
import { useBusinessStore } from '../../store/businessStore';
import Loading from '../../components/Loading';
import Header from '../../components/Header';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function BusinessesScreen({ navigation }) {
  const businessesData = useBusinessStore(state => state.businessesData);
  const { setNavigation } = useCurrentNavStore();
  const [businesses, setBusinesses] = useState([]);
  const [mainDataLoading, setMainDataLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setMainDataLoading(false);
    try {
      setMainDataLoading(false);
      setBusinesses(businessesData);
      console.log(businessesData)
    } catch (error) {
      console.log({ businessScreen: error });
    } finally {
      setMainDataLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      setNavigation('AdminBusinesses');
      fetchData();
    }, [businessesData])
  );

  useEffect(() => {
    fetchData();
  }, [])

  if (mainDataLoading) return <Loading />
  return (
    <View>
      <Header navigation={navigation} />
      <View className="px-2">
        <Text className="p-2 text-2xl sticky top-0 font-bold bg-white rounded-lg mt-4 shadow">
          Businesses List
        </Text>
      </View>
      <ScrollView className="px-3">
        {
          businesses.map((business, index) => (
            <View key={index} className="p-4 bg-white rounded-lg mt-3">
              <View className="">
                <Text className="text-lg font-semibold">{business.name}</Text>
                <Text className="text-md">{business.description}</Text>
                <Text className="text-slate-600">Category: {business.category.name}</Text>
                <Text className="text-slate-600">Address: {business.address}</Text>
                <Text className="text-slate-600">Owner: {business.owner}</Text>
                <Text className="text-slate-600">Contact: {business.contact}</Text>
                <Text className="text-slate-600">Email: {business.email}</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Update Business', { data: business })}
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