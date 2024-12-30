// src/stores/businessStore.js
import { create } from 'zustand';

export const useRefreshStore = create((set, get) => ({
    isRefresh: true, // Initial state
    toggleRefresh: () => {
        console.log('Toggling refresh state');
        set({ isRefresh: !get().isRefresh }); // Use get() to access the current state
    },
}));
