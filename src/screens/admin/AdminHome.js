import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';
import { useCurrentNavStore } from '../../store/currentNavStore';
import Toast from 'react-native-toast-message';
import { addEventListener } from '@react-native-community/netinfo';

import Header from '../../components/Header';
import { fetchBusinesses, fetchFavorites } from '../../services/apiServices';
import Loading from '../../components/Loading';
import NetInfo from '@react-native-community/netinfo';
import { getData } from '../../utils/LocalStorage';

import { useBusinessStore } from '../../store/businessStore';
import { useFavoriteStore } from '../../store/favoriteStore';
import { useInternetStore } from '../../store/internetStore';
import { useRefreshStore } from '../../store/refreshStore';

const HomeScreen = ({ navigation, route }) => {
    const { setCurrentApp, setNavigation } = useCurrentNavStore();

    const { setConnection, isConnected } = useInternetStore();
    const { setBusinessesData } = useBusinessStore();
    const { setFavoritesData } = useFavoriteStore();
    const isRefresh = useRefreshStore((state) => state.isRefresh)

    const [region, setRegion] = useState(null);
    const [businesses, setBusinesses] = useState([]);
    const [mainDataLoading, setMainDataLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [isNotifOpen, setIsNotifOpen] = useState(true);


    const mapRef = useRef([]);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Toast.show({ type: 'error', text1: 'Error', text2: 'Permission to access location was denied' });
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
            const [businessesData, favoritesData] = await Promise.all([
                fetchBusinesses(),
                fetchFavorites()
            ]);

            // Update state with fetched data
            setBusinessesData(businessesData);
            setFavoritesData(favoritesData);
        } catch (error) {
            console.log(error);
            Toast.show({ type: 'error', text1: 'Error', text2: error.message });
        } finally {
            setMainDataLoading(false);
        }
    }

    // Function to check internet connection
    const checkInternet = useCallback(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setConnection(state.isConnected)
        });

        return () => {
            unsubscribe(); // Cleanup subscription on component unmount
        };
    }, []);

    useFocusEffect(
        useCallback(() => {
            setSelectedLocation(null);
            setCurrentApp('AdminApp');
            setNavigation('AdminHome');
            getBusinesses();
            checkInternet();
        }, [])
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

    useEffect(() => {
        getBusinesses();
    }, [region])

    const handleMapPress = (event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setSelectedLocation({ latitude, longitude });
    };

    const categoryImages = {
        CoffeeShop: require('../../../assets/coffee.png'),
        Restaurant: require('../../../assets/eatery.png'),
        Supermarket: require('../../../assets/supermarket.png'),
        Bakery: require('../../../assets/bakery.png'),
        Pharmacy: require('../../../assets/pharmacy.png'),
        Bookstore: require('../../../assets/bookstore.png'),
        Vulcanizing: require('../../../assets/vulcanizing.png'),
        Printing: require('../../../assets/printing.png'),
        ComputerShop: require('../../../assets/computer.png'),
    };

    if (mainDataLoading) return <Loading />

    return (
        <View className="flex-1">
            <Header navigation={navigation} route={route} />
            <View className="flex-1">
                {region ? (
                    <MapView
                        style={{ flex: 1 }}
                        region={region}
                        showsUserLocation={true}
                        provider={PROVIDER_GOOGLE}
                        ref={mapRef}
                        onPress={handleMapPress}
                    >
                        { businesses && businesses.map((business) => (
                            <Marker
                                key={business.id}
                                coordinate={{
                                    latitude: parseFloat(business.latitude),
                                    longitude: parseFloat(business.longitude),
                                }}
                                title={business.name}
                                description={`${business.description}`}
                                image={categoryImages[business.category.name] || require('../../../assets/repair.png')}
                            >
                                <Callout onPress={() => navigation.navigate('View Business', { data: business })} />
                            </Marker>
                        ))}
                        {
                            !selectedLocation ? '' :
                                <Marker
                                    key={selectedLocation.latitude}
                                    coordinate={{
                                        latitude: parseFloat(selectedLocation.latitude),
                                        longitude: parseFloat(selectedLocation.longitude),
                                    }}
                                    title={'Selected location'}
                                >
                                    {/* <Callout onPress={() => navigation.navigate('Feedback', { data: business })} /> */}
                                </Marker>
                        }


                    </MapView>
                ) : (
                    <Text className="text-center mt-5 text-lg text-gray-700">Loading map...</Text>
                )}
                {selectedLocation && (
                    <View className="absolute w-screen justify-center left-0 bottom-2 p-3">
                        <View className="flex flex-row w-full items-center pe-10 justify-between bg-white p-2">
                            <View>
                                <Text className="text-sm text-gray-800 font-semibold">
                                    Latitude: {selectedLocation.latitude.toFixed(6)}
                                </Text>
                                <Text className="text-sm text-gray-800 font-semibold">
                                    Longitude: {selectedLocation.longitude.toFixed(6)}
                                </Text>
                            </View>
                            <TouchableOpacity
                                className="bg-blue-500 w-20 p-2 rounded-full"
                                onPress={() => navigation.navigate('Insert Business', { data: selectedLocation })}
                            >
                                <Text className="text-white text-center font-bold">
                                    ADD
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                )}
            </View>
        </View>
    );
};

export default HomeScreen;


// HomeScreen.js

// import React from 'react';
// import { StyleSheet, View } from 'react-native';
// import MapView from 'react-native-maps';

// const HomeScreen = () => {
//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         initialRegion={{
//           latitude: 37.78825,
//           longitude: -122.4324,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         }}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
// });

// export default HomeScreen;