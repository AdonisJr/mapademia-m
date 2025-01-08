import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

import AntDesign from '@expo/vector-icons/AntDesign';

export default function Ads({ setIsAdsOpen }) {
    // Array of ad images
    const ads = [
        require('../../assets/ads/ads1.jpg'),
        require('../../assets/ads/ads2.jpg'),
        require('../../assets/ads/ads3.jpg'),
        require('../../assets/ads/ads4.jpg'),
        require('../../assets/ads/ads5.jpg'),
    ];

    // Function to get a random ad image
    const getRandomAd = () => {
        const randomIndex = Math.floor(Math.random() * ads.length);
        return ads[randomIndex];
    };

    // Get a random ad image
    const randomAd = getRandomAd();

    return (
        <View style={styles.container} className="relative">
            <TouchableOpacity className="absolute -right-14 top-2 z-50 w-20" onPress={() => setIsAdsOpen(false)}>
                <AntDesign name="close" size={12} color="red" />
            </TouchableOpacity>
            <Image source={randomAd} style={styles.adImage} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'start',
    },
    text: {
        fontSize: 24,
        marginBottom: 20,
    },
    adImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'stretch',
    },
});