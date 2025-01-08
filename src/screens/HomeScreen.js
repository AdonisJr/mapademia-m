import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Keyboard, ScrollView } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import Header from '../components/Header';
import { useFocusEffect } from '@react-navigation/native';
import { useCurrentNavStore } from '../store/currentNavStore';
import { fetchBusinesses, fetchFavorites } from '../services/apiServices';
import NetInfo from '@react-native-community/netinfo';
import { getData, storeData } from '../utils/LocalStorage';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';

import Loading from '../components/Loading';

import { useInternetStore } from '../store/internetStore';
import { useBusinessStore } from '../store/businessStore';
import { useFavoriteStore } from '../store/favoriteStore';
import { useRefreshStore } from '../store/refreshStore';
import Ads from '../components/Ads';

const HomeScreen = ({ navigation, route }) => {
  const { setConnection, isConnected } = useInternetStore();
  const { setBusinessesData } = useBusinessStore();
  const { setFavoritesData } = useFavoriteStore();
  const isRefresh = useRefreshStore((state) => state.isRefresh);

  const { setCurrentApp } = useCurrentNavStore();
  const [region, setRegion] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mainDataLoading, setMainDataLoading] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isShowHistory, setIsShowHistory] = useState(false);
  const [isAdsOpen, setIsAdsOpen] = useState(true);

  const getBusinesses = async () => {
    setMainDataLoading(false);
    try {
      setMainDataLoading(true);
      const data = await getData('businesses');
      setBusinesses(data);
      setFilteredBusinesses(data); // Initialize with full list
    } catch (error) {
      console.log(error);
      Toast.show({ type: 'error', text1: 'Error', text2: error.message });
    } finally {
      setMainDataLoading(false);
    }
  };

  const fetchData = async () => {
    setMainDataLoading(false);
    try {
      setMainDataLoading(true);
      const businessData = await fetchBusinesses();
      const favoriteData = await fetchFavorites();
      setBusinessesData(businessData);
      setFavoritesData(favoriteData);
      setBusinesses(businessData);
      setFilteredBusinesses(businessData); // Initialize with full list
    } catch (error) {
      console.log(error);
      Toast.show({ type: 'error', text1: 'Error', text2: error.message });
    } finally {
      setMainDataLoading(false);
    }
  };

  const mapRef = useRef([]);

  const checkInternet = useCallback(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setConnection(state.isConnected);
    });

    return () => {
      unsubscribe(); // Cleanup subscription on component unmount
    };
  }, []);

  // Handle search
  const handleSearch = async (text) => {
    setLoading(true);
    setSearch(text);
    const filtered = businesses.filter((business) =>
      business.name.toLowerCase().includes(text.toLowerCase()) ||
      business.category.name.toLowerCase().includes(text.toLowerCase())
    );
    setTimeout(() => {
      setFilteredBusinesses(filtered);
      setLoading(false);
      Keyboard.dismiss();
      setIsShowHistory(false);
    }, 2000)
    // if (text !== '') {
    //   setSearchHistory([...searchHistory, text])
    //   getHistory();
    // }
    if (text.trim() !== "") {
      // const searchData = searchHistory.filter(item => item !== text);
      // setSearchHistory([text, ...searchHistory])
      await storeData('history', [text, ...searchHistory.filter(history => history !== text)])
      getHistory();
    }

  };

  const removeHistory = async (text) => {
    setLoading(true);
    await storeData('history', searchHistory.filter(history => history !== text))
    setTimeout(() => {
      setLoading(false);
      getHistory();
    }, 1000)
  }

  const handleClearSearch = () => {
    setSearch('');
    setFilteredBusinesses(businesses);
  }

  useFocusEffect(
    useCallback(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission to access location was denied');
          return;
        }

        setRegion({
          latitude: 8.503779,
          longitude: 125.976459,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      })();
      setCurrentApp('MainApp');
      getBusinesses();
      checkInternet();
      getHistory();
      setIsAdsOpen(true);
    }, [])
  );

  useEffect(() => {
    if (isConnected) {
      fetchData();
    } else {
      getBusinesses();
    }
    setIsNotifOpen(true);

  }, [isConnected, region, isRefresh]);

  useEffect(() => {
      getBusinesses();
    }, [region])

  const getHistory = async () => {
    const historyData = await getData('history');
    if (!historyData) {
      setSearchHistory([]);
    } else {
      setSearchHistory(historyData)
    }
    console.log({ historyData: historyData })
  }

  const categoryImages = {
    CoffeeShop: require('../../assets/coffee.png'),
    Restaurant: require('../../assets/eatery.png'),
    Eatery: require('../../assets/eatery.png'),
    Supermarket: require('../../assets/supermarket.png'),
    Bakery: require('../../assets/bakery.png'),
    Pharmacy: require('../../assets/pharmacy.png'),
    Bookstore: require('../../assets/bookstore.png'),
    Vulcanizing: require('../../assets/vulcanizing.png'),
    Printing: require('../../assets/printing.png'),
    ComputerShop: require('../../assets/computer.png'),
  };

  if (mainDataLoading) return <Loading />;

  return (
    <View style={styles.container}>
      <Header navigation={navigation} route={route} />

      <View className="flex flex-row items-center p-2 bg-white mt-2">
        <View className="relative w-5/6">
          <TextInput
            className="border border-gray-300 p-2 rounded"
            placeholder="Search (business name, type)"
            value={search}
            onChangeText={(text) => setSearch(text)}
            onFocus={() => setIsShowHistory(true)}
          />
          <TouchableOpacity className="absolute top-2 right-0 bg-white">

            <AntDesign name="closecircleo" size={18} color="gray" className="absolute right-2 w-6" onPress={() => handleClearSearch()} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => handleSearch(search)}>
          <Feather name="search" size={24} color="black" className="ps-4" />
        </TouchableOpacity>
      </View>



      <View style={{ flex: 1 }} className="relative">
        {/* search history */}
        {
          isShowHistory && searchHistory.length !== 0 &&
          <ScrollView className="absolute z-20 h-32 pb-20 w-full mb-10">
            <View className="absolute z-10 h-full w-full bg-white opacity-90 top-0"></View>
            {
              searchHistory && searchHistory.map((history, index) => (
                <View key={index} className="flex flex-row justify-between items-center">
                  <TouchableOpacity className="z-30 mt-2 ps-5 w-40" onPress={() => handleSearch(history)}>
                    <Text className=" shadow p-1">{history}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="z-30 w-20" onPress={() => removeHistory(history)}>
                    <AntDesign name="close" size={12} color="black" />
                  </TouchableOpacity>
                </View>

              ))
            }
          </ScrollView>
        }

        {region ? (
          <MapView
            style={styles.map}
            region={region || { latitude: 8.503779, longitude: 125.976459, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
            showsUserLocation={true}
            provider={PROVIDER_GOOGLE}
            ref={mapRef}
            onPress={() => [Keyboard.dismiss(), setIsShowHistory(false)]}
          >
            {filteredBusinesses && filteredBusinesses.map((business) => (
              <Marker
                key={business.id}
                coordinate={{
                  latitude: parseFloat(business.latitude),
                  longitude: parseFloat(business.longitude),
                }}
                title={business.name}
                description={business.description}
                image={categoryImages[business.category.name] || require('../../assets/repair.png')}
              >
                <Callout onPress={() => navigation.navigate('View Business', { data: business })} />
              </Marker>
            ))}
          </MapView>
        ) : (
          <Text style={styles.loadingText}>Loading map...</Text>
        )}
        {isConnected || !isNotifOpen ? null : (
          <View className="absolute flex flex-row justify-end w-full bottom-3">
            <TouchableOpacity className="absolute right-3 top-5 z-10" onPress={() => setIsNotifOpen(false)}>
              <AntDesign name="close" size={12} color="black" />
            </TouchableOpacity>
            <View className="rounded-full bg-white w-4/6 pe-5">
              <Text className="text-xs p-2 text-red-400 text-center">
                Please connect to the internet to get latest updates.
              </Text>
            </View>
          </View>
        )}
        {
          !isAdsOpen ? '' :
            <View className="absolute bottom-0 z-50 w-full h-40">
              <Ads setIsAdsOpen={setIsAdsOpen} />
            </View>
        }

      </View>
      {loading && <Loading />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
});

export default HomeScreen;
