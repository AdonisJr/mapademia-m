// src/stores/businessStore.js
import { create } from 'zustand';
import { getData, storeData, removeData } from '../utils/LocalStorage';

export const useBusinessStore = create((set, get) => ({
    businessesData: [], // Initialize businesses as an empty array
    initializeBusinessStore: async () => {
        try {
            const storedBusinesses = await getData('businesses'); // Retrieve businesses from localStorage
            set({
                businesses: storedBusinesses ? JSON.parse(storedBusinesses) : [], // Parse JSON if it exists, otherwise use an empty array
            });
        } catch (error) {
            console.error('Error initializing business store:', error);
        }
    },
    setBusinessesData: (newBusinesses) => {
        set({ businessesData: newBusinesses }); // Update state
        storeData('businesses', newBusinesses); // Persist data to localStorage
    },
    addBusiness: (business) => {
        const updatedBusinesses = [...get().businesses, business]; // Add a new business
        set({ businesses: updatedBusinesses });
        storeData('businesses', updatedBusinesses); // Persist data to localStorage
    },
    removeBusiness: (businessId) => {
        const updatedBusinesses = get().businesses.filter((b) => b.id !== businessId); // Remove business by ID
        set({ businesses: updatedBusinesses });
        storeData('businesses', updatedBusinesses); // Persist data to localStorage
    },
    clearBusinesses: () => {
        set({ businesses: [] }); // Clear the in-memory state
        removeData('businesses'); // Remove businesses from localStorage
    },
}));
