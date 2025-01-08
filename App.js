import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Import Stack Navigator
import { Ionicons } from '@expo/vector-icons';
import './global.css';
import { useUserStore } from './src/store/userStore';
import { getData } from './src/utils/LocalStorage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';

// components import
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen'; // Import Login Screen
import RegistrationScreen from './src/screens/RegistrationScreen';
import UsersScreen from './src/screens/admin/UsersScreen';
import Feedback from './src/screens/Feedback';
import AdminHome from './src/screens/admin/AdminHome';
import InsertBusiness from './src/screens/admin/InsertBusiness';
import Favorite from './src/screens/Favorite';
import { useCurrentNavStore } from './src/store/currentNavStore';
import InsertUsers from './src/screens/admin/InsertUsers';
import { useNavigation } from '@react-navigation/native';
import BusinessesScreen from './src/screens/admin/BusinessesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import UpdateBusiness from './src/screens/admin/UpdateBusiness';
import UpdateUser from './src/screens/admin/UpdateUser';
import ChangePassword from './src/screens/admin/ChangePassword';
import ManageInformation from './src/screens/admin/ManageInformation';
import SplashScreen from './src/screens/SplashScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
export default function App() {
  const { setUser, setAccessToken } = useUserStore();
  const [userState, setUserState] = useState(null);
  const [accessTokenState, setAccessTokenState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getCredentials = async () => {
    const token = await getData('accessToken');
    const storedUser = await getData('user');
    setAccessTokenState(token);
    setUserState(storedUser);
    setUser(storedUser); // Update Zustand store
    setAccessToken(token);
    console.log({ token: token })
    console.log({ user: storedUser })
  };

  // useEffect(() => {
  //   initializeUserStore();
  //   getCredentials();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      await getCredentials();
      setTimeout(() => {
        setIsLoading(false); // Mark loading as false when data is fetched
      }, 10000)
    };
    fetchData();
  }, []);


  // Show loading screen while fetching credentials
  if (isLoading) {
    return (
      // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      //   <Text>Loading...</Text>
      // </View>
      <SplashScreen />
    );
  }


  return (
    <NavigationContainer>
      <StatusBar />
      <Stack.Navigator initialRouteName={!userState ? 'Login' : userState.role === 'admin' ? 'AdminApp' : 'MainApp'}>
        <Stack.Screen name="MainApp" component={MainApp} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegistrationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AdminApp" component={AdminApp} options={{ headerShown: false }} />
        <Stack.Screen name="Insert Business" component={InsertBusiness} />
        <Stack.Screen name="Update Business" component={UpdateBusiness} />
        <Stack.Screen name="View Business" component={Feedback} />
        <Stack.Screen name="Your Favorites" component={Favorite} />
        <Stack.Screen name="Insert User" component={InsertUsers} />
        <Stack.Screen name="Update User" component={UpdateUser} />
        <Stack.Screen name="Change Password" component={ChangePassword} />
        <Stack.Screen name="Manage Information" component={ManageInformation} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

function MainApp() {
  const [currentRoute, setCurrentRoute] = useState('Services'); // Default route
  const navigate = useNavigation();
  return (
    <View className="flex-1">
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'map-marker-radius' : 'map-marker-radius-outline';
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />
            } {
              iconName = focused ? 'gears' : 'gear';
              return <FontAwesome6 name={iconName} size={size} color={color} />
            }
          },
          tabBarActiveTintColor: 'teal',
          tabBarInactiveTintColor: 'black',
          tabBarStyle: {
            backgroundColor: 'white', // Set the background color to black
            height: 50,              // Adjust height if needed
            padding: 8,              // Optional padding for better spacing
            shadowColor: 'black',    // Optional shadow or border styles
          },
          tabBarLabelStyle: 'text-sm font-semibold',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={{ headerShown: true }} />
      </Tab.Navigator>

      {/* Floating Add Button using NativeWind */}
      {/* <FloatingAddButton currentRoute={currentRoute} /> */}
    </View>
  );
}

function AdminApp() {
  const [currentRoute, setCurrentRoute] = useState('Services'); // Default route
  const currentNav = useCurrentNavStore(state => state.currentNav)
  const navigation = useNavigation();
  return (
    <View className="flex-1">
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;


            if (route.name === 'Home') {
              iconName = focused ? 'map-marker-radius' : 'map-marker-radius-outline';
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />
            } else if (route.name === 'Users') {
              iconName = 'users';
              if (focused) {
                return <FontAwesome6 name={iconName} size={size} color={color} />
              } else {
                return <Feather name={iconName} size={size} color={color} />
              }
            } else if (route.name === 'Business') {
              iconName = focused ? 'business' : 'business-outline';
              return <Ionicons name={iconName} size={size} color={color} />
            } else {
              iconName = focused ? 'gears' : 'gear';
              return <FontAwesome6 name={iconName} size={size} color={color} />
            }
          },
          tabBarActiveTintColor: 'teal',
          tabBarInactiveTintColor: 'black',
          tabBarStyle: {
            backgroundColor: 'white', // Set the background color to black
            height: 50,              // Adjust height if needed
            padding: 8,              // Optional padding for better spacing
            shadowColor: 'black',    // Optional shadow or border styles
          },
          tabBarLabelStyle: 'text-sm font-semibold',
        })}
      >
        <Tab.Screen name="Home" component={AdminHome} options={{ headerShown: false }} />
        <Tab.Screen name="Business" component={BusinessesScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Users" component={UsersScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={{ headerShown: true }} />
      </Tab.Navigator>

      {/* Floating Add Button using NativeWind */}
      {/* <FloatingAddButton currentRoute={currentRoute} /> */}
      <TouchableOpacity className={`absolute bottom-8 self-center bg-white rounded-full z-10 
            ${currentNav !== 'AdminUsers' ? 'hidden' : ''}`}
        onPress={() => currentNav === 'AdminUsers' ? navigation.navigate('Insert User') : ''}
      >
        <Ionicons name="add-circle" size={60} color="skyblue" />
      </TouchableOpacity>
    </View>
  );
}

function FloatingAddButton({ currentRoute }) {
  // Conditionally render the "+" button, hide it on the "Settings" screen
  if (currentRoute === 'Settings') {
    return null;
  }

  return (
    <TouchableOpacity className="absolute bottom-5 self-center bg-white rounded-full z-10">
      <Ionicons name="add-circle" size={60} color="tomato" />
    </TouchableOpacity>
  );
}
