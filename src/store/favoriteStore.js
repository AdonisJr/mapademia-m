// src/stores/businessStore.js
import { create } from 'zustand';
import { getData, storeData, removeData } from '../utils/LocalStorage';

export const useFavoriteStore = create((set, get) => ({
    favoritesData: [], // Initialize businesses as an empty array
    initializeFavoriteStore: async () => {
        try {
            const storedFavorites = await getData('favorites'); // Retrieve businesses from localStorage
            set({
                favoritesData: storedFavorites ? storedFavorites : [], // Parse JSON if it exists, otherwise use an empty array
            });
        } catch (error) {
            console.error('Error initializing favorite store:', error);
        }
    },
    setFavoritesData: (newFavorites) => {
        set({ favoritesData: newFavorites }); // Update state
        storeData('favorites', newFavorites); // Persist data to localStorage
    }
}));
