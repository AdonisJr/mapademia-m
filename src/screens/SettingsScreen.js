import { View, Text } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { useCurrentNavStore } from '../store/currentNavStore';

export default function SettingsScreen() {
  const { setNavigation } = useCurrentNavStore();

  
  useFocusEffect(
    useCallback(() => {
      setNavigation('Settings');
    }, [])
  );
  return (
    <View>
      <Text>UsersScreen</Text>
    </View>
  )
}