import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { useCurrentNavStore } from '../../store/currentNavStore';
import { useBusinessStore } from '../../store/businessStore';
import Loading from '../../components/Loading';
import Header from '../../components/Header';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRefreshStore } from '../../store/refreshStore';
import { deleteBusiness } from '../../services/apiServices';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function BusinessesScreen({ navigation }) {
  const businessesData = useBusinessStore(state => state.businessesData);
  const toggleRefresh = useRefreshStore(state => state.toggleRefresh);
  const { setNavigation } = useCurrentNavStore();
  const [businesses, setBusinesses] = useState([]);
  const [mainDataLoading, setMainDataLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setMainDataLoading(false);
    try {
      setMainDataLoading(true);
      setBusinesses(businessesData);
      console.log(businessesData)
    } catch (error) {
      console.log({ businessScreen: error });
    } finally {
      setMainDataLoading(false);
    }
  }

  const handleDelete = (id) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this business?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setMainDataLoading(false);
            try {
              setMainDataLoading(true);
              const response = await deleteBusiness(id);
              Toast.show({
                type: 'success',
                text1: 'Delete',
                text2: 'Business deleted successfully',
              });
              toggleRefresh();
            } catch (error) {
              console.log({ deleteBusiness: error });
            } finally {
              setMainDataLoading(false);
            }
          },
        },
      ]
    );
  };

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
      <ScrollView className="px-3 mb-48">
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
                <Text className="text-slate-600">Price Range: {business.price_from} - {business.price_to}</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Menu List', { data: business })}
                className="flex flex-row gap-2 justify-center mt-4 items-center bg-teal-500 p-2 rounded-full">
                <MaterialCommunityIcons name="menu-down" size={20} color={'white'} />
                <Text className="text-white">VIEW {business.category.name === 'Restaurant' || 'Eatery' ? 'MENU' : 'SERVICES'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Update Business', { data: business })}
                className="flex flex-row gap-2 justify-center mt-4 items-center bg-teal-500 p-2 rounded-full">
                <FontAwesome6 name="edit" size={18} color={'white'} />
                <Text className="text-white">EDIT</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(business.id)}
                className="flex flex-row gap-2 justify-center mt-4 items-center bg-red-700 p-2 rounded-full">
                <AntDesign name="delete" size={18} color="white" />
                <Text className="text-white">DELETE</Text>
              </TouchableOpacity>
            </View>

          ))
        }
      </ScrollView>
      <Toast />
    </View>
  )
}