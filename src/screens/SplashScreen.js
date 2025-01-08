// SplashScreen.js
import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const SplashScreen = () => {
    return (
        <View style={styles.container} className="relative">
            <Image
                source={require('../../assets/background.png')} // Replace with your image path
                style={styles.image}
            />
            <View className="flex flex-col gap-2 absolute w-screen h-screen items-center justify-center">
                <Image
                    source={require('../../assets/mapademia.png')} // Replace with your image path
                    className="animate-bounce"
                    style={{ width: 150, height: 150 }}
                />
                
                <Text className="text-2xl font-bold">Welcome to MAPADEMIA</Text>
                <Text className="text-md font-bold text-slate-600">Connecting Students with Local Businesses</Text>
                <Text className="text-lg font-semibold animate-pulse mt-20">Please wait...</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff', // Background color
    },
    image: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        resizeMode: 'cover', // Make the image cover the entire screen
    },
    text: {
        fontSize: 24,
        color: '#000000', // Text color
        fontWeight: 'bold',
        position: 'absolute',
        bottom: 50, // Position text at the bottom
    },
});

export default SplashScreen;