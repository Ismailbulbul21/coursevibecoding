import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useProfileStore = create((set) => ({
    profile: null,
    isLoading: false,
    error: null,

    fetchProfile: async (userId) => {
        if (!userId) {
            console.log('fetchProfile called with no userId');
            return;
        }

        console.log('fetchProfile: Fetching profile for user ID:', userId);
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('fetchProfile: Error fetching profile:', error);
                throw error;
            }
            console.log('fetchProfile: Profile data received:', data);
            set({ profile: data, isLoading: false });
            return data;
        } catch (error) {
            console.error('fetchProfile: Error in profile fetch:', error);
            set({ error: error.message, isLoading: false });
            return null;
        }
    },

    updateProfile: async (userId, updates) => {
        if (!userId) return;

        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', userId)
                .select()
                .single();

            if (error) throw error;
            set(state => ({ profile: { ...state.profile, ...updates }, isLoading: false }));
            return data;
        } catch (error) {
            console.error('Error updating profile:', error);
            set({ error: error.message, isLoading: false });
            return null;
        }
    },

    clearProfile: () => {
        set({ profile: null });
    }
})); 