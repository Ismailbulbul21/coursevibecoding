import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useAuthStore = create((set) => ({
    user: null,
    isLoading: false,
    error: null,

    setUser: (user) => set({ user }),

    signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            set({ user: data.user, isLoading: false });
            return data;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { error };
        }
    },

    signUp: async (email, password, fullName) => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });

            if (error) throw error;
            set({ isLoading: false });
            return data;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { error };
        }
    },

    signOut: async () => {
        set({ isLoading: true });
        try {
            await supabase.auth.signOut();
            set({ user: null, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    checkUser: async () => {
        set({ isLoading: true });
        try {
            const { data } = await supabase.auth.getUser();
            set({ user: data.user || null, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },
})); 