import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import Header from '../components/Header';
import { useFocusEffect } from '@react-navigation/native';
import { useCurrentNavStore } from '../store/currentNavStore';
import { fetchBusinesses, fetchFavorites } from '../services/apiServices';
import { addEventListener } from '@react-native-community/netinfo';
import NetInfo from '@react-native-community/netinfo';
import { getData } from '../utils/LocalStorage';
import AntDesign from '@expo/vector-icons/AntDesign';


import Loading from '../components/Loading';

import { useInternetStore } from '../store/internetStore';
import { useBusinessStore } from '../store/businessStore';
import { useFavoriteStore } from '../store/favoriteStore';
import { useRefreshStore } from '../store/refreshStore';

const HomeScreen = ({ navigation, route }) => {
  const { setConnection, isConnected } = useInternetStore();
  const { setBusinessesData } = useBusinessStore();
  const { setFavoritesData } = useFavoriteStore();
  const isRefresh = useRefreshStore((state) => state.isRefresh)

  const { setCurrentApp } = useCurrentNavStore();
  const [region, setRegion] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mainDataLoading, setMainDataLoading] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(true);

  const getBusinesses = async () => {
    setMainDataLoading(false);
    try {
      setMainDataLoading(true);
      setBusinesses(await getData('businesses'));
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
      setBusinessesData(await fetchBusinesses());
      setFavoritesData(await fetchFavorites());
    } catch (error) {
      console.log(error);
      Toast.show({ type: 'error', text1: 'Error', text2: error.message });
    } finally {
      setMainDataLoading(false);
    }
  }

  const mapRef = useRef([]);

  useEffect(() => {
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
  }, []);

  // Function to check internet connection
  const checkInternet = useCallback(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setConnection(state.isConnected)
    });

    return () => {
      unsubscribe(); // Cleanup subscription on component unmount
    };
  }, []);

  // Use useFocusEffect to trigger getMyTasks when screen regains focus
  useFocusEffect(
    useCallback(() => {
      setCurrentApp('MainApp');
      getBusinesses();
      checkInternet();
    }, [region])
  );

  useEffect(() => {
    if (isConnected) {
      fetchData();
      getBusinesses();
    } else {
      getBusinesses();
    }

    setIsNotifOpen(true);
  }, [isConnected, region, isRefresh])

  if (mainDataLoading) return <Loading />

  return (
    <View style={styles.container}>
      <Header navigation={navigation} route={route} />

      <View style={{ flex: 1 }}>

        {region ? (
          <MapView
            style={styles.map}
            region={region || { latitude: 8.503779, longitude: 125.976459, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
            showsUserLocation={true}
            provider={PROVIDER_GOOGLE}
            ref={mapRef}
          >

            {businesses.map((business) => (
              <Marker
                key={business.id}
                coordinate={{
                  latitude: parseFloat(business.latitude),
                  longitude: parseFloat(business.longitude),
                }}
                title={business.name}
                description={business.description}
                image={
                  business.category.name === 'Eatery' || business.category.name === 'Restaurant'
                    ? require(`../../assets/eatery.png`)
                    : require(`../../assets/printing.png`)
                }
              >
                <Callout onPress={() => navigation.navigate('View Business', { data: business })} />
              </Marker>
            ))}
          </MapView>
        ) : (
          <Text style={styles.loadingText}>Loading map...</Text>
        )}
        {
          isConnected || !isNotifOpen ? '' :
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
        }
      </View>
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
