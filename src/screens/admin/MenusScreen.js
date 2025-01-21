import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native'
import React from 'react';
import { IMG_URL, API_URL } from '@env';
import { useUserStore } from '../../store/userStore';


import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function MenusScreen({ navigation, route }) {
    const data = route.params.data;
    const { user } = useUserStore();
    return (
        <View className="flex-1 h-screen bg-gray-100">
            {
                user.role === 'user' ? '' :
                    <View className="flex flex-row justify-between items-center bg-white pe-2">
                        <Text className="text-2xl w-3/6 text-slate-600 p-4 bg-white sticky top-0"></Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Insert Menu', { data: data })}
                            className="flex flex-row gap-2 justify-center mt-4 items-center bg-teal-500 p-2 rounded-full mb-2">
                            <FontAwesome6 name="add" size={20} color={'white'} />
                            <Text className="text-white">
                                INSERT {data.category.name === 'Restaurant' || 'Eatery' ? 'MENU' : 'SERVICES'}
                            </Text>
                        </TouchableOpacity>
                    </View>
            }
            <ScrollView className="bg-white p-4">

                {
                    data.menus.length === 0 ? <Text className="text-2xl">No Menu Found</Text> :
                    data.menus.map((menu, index) => (
                        <View key={index} className="border-2 border-slate-100 mb-8">
                            {/* Image Section */}
                            <View className="h-72 overflow-hidden">
                                <Image
                                    // source={require('../../assets/samplebg.jpg')} // Local image
                                    source={{ uri: `${API_URL}${menu?.image}` }}
                                    className="w-full h-full object-cover"
                                />

                            </View>
                            <View className="py-2 px-4">
                                <Text className="text-4xl font-bold">{menu.name}</Text>
                                <Text className="text-2xl text-slate-600">{menu.description}</Text>
                                <Text className="text-3xl font-bold mt-2">{`\u20B1${menu.price}`}</Text>
                            </View>
                        </View>
                    ))
                }
            </ScrollView>
        </View>
    )
}