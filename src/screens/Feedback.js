import { View, Text, Image, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { AirbnbRating, Rating } from 'react-native-ratings'; // For star rating
import { IMG_URL, API_URL } from '@env';
import { submitFeedback, fetchFeedbacks, insertFavorite, fetchFavorites, removeFavorite } from '../services/apiServices';
import Toast from 'react-native-toast-message';
import { timeAgo } from '../utils/convertDate';
import Loading from '../components/Loading';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';

import { getData } from '../utils/LocalStorage';
import { useRefreshStore } from '../store/refreshStore';
import { useInternetStore } from '../store/internetStore';
import { useFavoriteStore } from '../store/favoriteStore';

export default function Feedback({ route }) {
    const data = route.params.data;

    const toggleRefresh = useRefreshStore(state => state.toggleRefresh);
    const favoritesData = useFavoriteStore(state => state.favoritesData)
    const { isConnected } = useInternetStore();

    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0); // Default rating set to 0
    const [activeTab, setActiveTab] = useState('write'); // Track active tab (either 'write' or 'show')
    const [mainDataLoading, setMainDataLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [hasFavorite, setHasFavorite] = useState(false);

    const [feedbacks, setFeedbacks] = useState([]);

    // Handle comment change
    const handleCommentChange = (text) => {
        setComment(text);
    };

    // Handle rating change
    const handleRatingChange = (rating) => {
        setRating(rating);
    };

    const ratingCompleted = (rating) => {
        // console.log("Rating is: " + rating);
        setRating(rating);
    };

    const handleSubmit = async () => {
        const payload = { stars: rating, comment, id: data.id }
        setLoading(true);
        try {
            // Validation
            if (!comment) {
                Toast.show({
                    type: 'error',
                    text1: 'Validation Error',
                    text2: 'Comment is required.',
                });
                setLoading(false);
                return;
            }

            // Make API call
            const response = await submitFeedback(payload);

            // Show success toast
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Feedback successfully sent!',
            });
            getFeedbacks();
            // Return to the previous screen after a delay
            // setTimeout(() => {
            //     navigation.goBack();
            // }, 2000);
        } catch (error) {
            console.log('Submission Error: ', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message,
            });
        } finally {
            setLoading(false);
        }
    }

    const getFavorite = async () => {
        setMainDataLoading(false);
        try {
            setMainDataLoading(true);
            const response = favoritesData;
            const isFavorite = response.find(favorite => favorite.business_id === data.id)
            // console.log({ isFavorite: isFavorite })
            if (isFavorite) {
                setHasFavorite(true)
            } else {
                setHasFavorite(false)
            }
            setFavorites(response);
        } catch (error) {
            console.log(error);
            Toast.show({ type: 'error', text1: 'Error', text2: error.message });
        } finally {
            setMainDataLoading(false);
        }
    };

    const handleFavorite = async () => {

        setLoading(true);
        try {
            // Make API call
            const response = await insertFavorite({ business_id: data.id });

            // Show success toast
            Toast.show({
                type: 'success',
                text1: 'Added to Favorites',
                text2: 'This business has been added to your favorites.',
                // position: 'bottom',
            });
            toggleRefresh();
        } catch (error) {
            console.log('Submission Error: ', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message,
            });
        } finally {
            setLoading(false);
        }
    }

    const handleRemove = async () => {

        setLoading(true);
        try {
            // Make API call
            const response = await removeFavorite(data.id);

            // Show success toast
            Toast.show({
                type: 'success',
                text1: 'Removed from Favorites',
                text2: 'This business has been removed from your favorites.',
                // position: 'bottom',
            });
            toggleRefresh();
        } catch (error) {
            console.log('Submission Error: ', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message,
            });
        } finally {
            setLoading(false);
        }
    }

    const getFeedbacks = async () => {
        setMainDataLoading(false);
        try {
            setMainDataLoading(true);
            const response = await fetchFeedbacks(data.id);
            setFeedbacks(response.feedback);
        } catch (error) {
            console.log(error);
            Toast.show({ type: 'error', text1: 'Error', text2: error.message });
        } finally {
            setMainDataLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (isConnected) {
                getFeedbacks();
            }
            getFavorite();
        }, [favoritesData])
    );

    // useEffect(() => {
    //     const fetchData = async () => {
    //         await getFeedbacks();
    //         await getFavorite();

    //         // Check if the current data is in favorites
    //         const isFavorite = favorites.some(favorite => favorite.id === data.id);
    //         setHasFavorite(isFavorite); // Assuming setFavorites expects a boolean
    //     };


    //     fetchData();
    //     console.log({data: favorites})
    // }, [data.id]);

    if (mainDataLoading) return <Loading />

    return (
        <View className="flex-1">
            {/* Image Section */}
            <View className="h-72 overflow-hidden border-b-8 border-slate-200">
                <Image
                    // source={require('../../assets/samplebg.jpg')} // Local image
                    source={{ uri: `${API_URL}${data?.image}` }}
                    className="w-full h-full object-cover"
                />

            </View>
            {/* Header Text */}
            <View className="px-4 pb-2 bg-slate-100 flex flex-row justify-between pe-5 items-center">
                <View>
                    <Text className="font-bold text-lg">{data.name}</Text>
                    <Text className="font-semibold text-slate-600 text-sm">{data.description}</Text>
                    <Text className="font-semibold text-slate-600 text-xs">Address: {data.address}</Text>
                    <Text className="font-semibold text-slate-600 text-xs">Owner: {data.owner}</Text>
                    <Text className="font-semibold text-slate-600 text-xs">Contact: {data.contact}</Text>
                    <Text className="font-semibold text-slate-600 text-xs">Operating Hours: {data.other}</Text>
                </View>
                {
                    hasFavorite ?
                        <TouchableOpacity className="flex flex-row gap-1 items-center bg-white p-2 rounded-full"
                            onPress={handleRemove}>
                            <MaterialIcons name="favorite" size={14} color="gray" />
                            <Text>Remove</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity className="flex flex-row gap-1 items-center bg-emerald-600 p-2 rounded-full"
                            onPress={handleFavorite}>
                            <MaterialIcons name="favorite" size={14} color="red" />
                            <Text className="text-white">Favorite</Text>
                        </TouchableOpacity>
                }

            </View>

            {/* Tab Navigation */}
            <View className="flex-row px-4 border-b">
                <TouchableOpacity
                    className={`flex-1 py-2 text-center ${activeTab === 'write' ? 'border-b-4 border-green-500' : ''}`}
                    onPress={() => setActiveTab('write')}
                >
                    <Text className="text-xs font-medium text-center">Write Feedback</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-1 py-2 text-center ${activeTab === 'show' ? 'border-b-4 border-green-500' : ''}`}
                    onPress={() => setActiveTab('show')}
                >
                    <Text className="text-xs font-medium text-center">Show Feedback</Text>
                </TouchableOpacity>
            </View>

            {/* Tab Content */}
            {activeTab === 'write' ? (
                <ScrollView className="p-4 pb-10">
                    {/* Star Rating */}
                    <View className="mb-6">
                        <Text className="text-lg font-medium text-gray-700 mb-2">Rate the service:</Text>
                        <Rating
                            showRating
                            onFinishRating={ratingCompleted}
                            style={{ paddingVertical: 10 }}
                            startingValue={rating}
                        />
                    </View>

                    {/* Comment Section */}
                    <View className="mb-6">
                        <Text className="text-lg font-medium text-gray-700 mb-2">Your Comment:</Text>
                        <TextInput
                            style={{ height: 100 }}
                            className="border border-gray-300 rounded-xl p-3 text-base text-gray-700 bg-white"
                            placeholder="Write your feedback here..."
                            multiline
                            numberOfLines={4}
                            value={comment}
                            onChangeText={(text) => setComment(text)}
                        />
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        className="bg-green-500 py-3 rounded-xl mt-6 mb-14"
                        onPress={handleSubmit}
                    >
                        <Text className="text-white text-lg font-bold text-center">Submit Feedback</Text>
                    </TouchableOpacity>
                </ScrollView>
            ) : (
                <ScrollView className="p-4">
                    {/* Show feedback */}
                    {feedbacks.length === 0 ?
                        <View className="relative mb-4 px-4 pb-4 pt-20">
                            <Text className="text-center font-bold">
                                No Feedback
                            </Text>
                        </View> :
                        feedbacks.map((feedback) => (
                            <View key={feedback.id} className="relative mb-4 px-4 pb-4 border-b border-gray-300 rounded-xl">
                                <View className="absolute top-0 left-0 w-full h-full z-20">
                                </View>
                                <View>
                                    <Fontisto name={feedback.user.gender === 'male' ? 'male' : 'female'} size={40} color={'white'} />
                                </View>
                                <Text className="text-base font-bold">
                                    {feedback.user.firstname + ' ' + feedback.user.lastname}
                                </Text>
                                <Rating
                                    showRating
                                    startingValue={feedback.stars}
                                    style={{ paddingVertical: 10 }}
                                    isDisabled={true}
                                />

                                <Text className="text-base text-gray-800 mt-2">{feedback.comment}</Text>

                                <Text className="text-xs text-blue-500">{timeAgo(feedback.created_at)}</Text>
                            </View>
                        ))}
                </ScrollView>
            )}
            <Toast />
            {loading && <Loading />}
        </View>
    );
}
