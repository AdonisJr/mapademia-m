// src/useStore.js
import { create } from 'zustand';

export const useInternetStore = create((set, get) => ({
    isConnected: null,
    setConnection: (connection) => set({ isConnected: connection }),
}));
