// src/useStore.js
import { create } from 'zustand';
import { removeData, storeData } from '../utils/LocalStorage';

export const useUserStore = create((set, get) => ({
    user: null, // Initialize user as null
    accessToken: null,
    // Initialize the store with data from localStorage
    initializeUserStore: async () => {
        const storedUser = await getData('user'); // Retrieve user data from storage
        const storedAccessToken = await getData('accessToken'); // Retrieve token from storage
        console.log({local: storedUser})
        set({
            user: storedUser ? JSON.parse(storedUser) : null, // Parse JSON if user exists
            accessToken: storedAccessToken || null, // Set token or null
        });
    },
    setUser: (newUser) => set({ user: newUser }), // Method to set user
    setAccessToken: (token) => set({ accessToken: token }), // Method to set user
    logout: () => {
        set({ user: null, accessToken: null }); // Clear the in-memory state
        removeData('user'); // Remove user data from AsyncStorage
        removeData('accessToken'); // Remove accessToken from AsyncStorage
        console.log('User logged out and data removed');
    },
    isAuthenticated: () => !!get().accessToken && !!get().user, // Returns true if accessToken is present
}));
