import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import Loading from '../components/Loading';

import { fetchFavorites } from '../services/apiServices';
import { useFocusEffect } from '@react-navigation/native';
import { useFavoriteStore } from '../store/favoriteStore';
import { getData } from '../utils/LocalStorage';

const FavoritesScreen = ({ navigation, route }) => {
    const data = route.params.data;
    const { initializeFavoriteStore } = useFavoriteStore();
    const favoritesData = useFavoriteStore(state => state.favoritesData);
    const [favorites, setFavorites] = useState([]);
    const [mainDataLoading, setMainDataLoading] = useState(false);

    const fetchData = async () => {
        setFavorites(favoritesData);
    }

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [favoritesData])
    );

    if (mainDataLoading) return <Loading />

    const renderFavoriteItem = ({ item }) => (
        <View className="flex flex-row justify-between items-center bg-white p-4 mb-2 rounded shadow">
            <TouchableOpacity onPress={() => navigation.navigate('View Business', { data: item.business })}>
                <Text className="text-lg font-semibold">{item.business.name}</Text>
                <Text className="text-sm text-gray-500">{item.business.description}</Text>
                <Text className="text-sm text-gray-500">{item.business.category.name}</Text>
                <Text className="text-sm text-gray-500">Address: {item.business.address}</Text>
                <Text className="text-sm text-gray-500">Owner: {item.business.owner}</Text>
                <Text className="text-sm text-gray-500">Contact: {item.business.contact}</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <MaterialIcons name="favorite" size={18} color="red" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View className="flex-1 bg-gray-100 p-4">
            <Text className="text-2xl font-bold mb-4 sticky top-0 left-0">Business</Text>
            {favorites.length > 0 ? (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderFavoriteItem}
                />
            ) : (
                <Text className="text-center text-gray-500 mt-4">No favorites yet!</Text>
            )}
            <Toast />
        </View>
    );
};

export default FavoritesScreen;
