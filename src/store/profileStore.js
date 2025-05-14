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

    uploadAvatar: async (file, userId) => {
        try {
            console.log(`Uploading avatar for user ${userId}...`);

            if (!file) {
                console.error('No file provided for upload');
                throw new Error('No file provided for upload');
            }

            if (!userId) {
                console.error('No user ID provided for upload');
                throw new Error('No user ID provided for upload');
            }

            // Generate a unique filename with timestamp to avoid cache issues
            const timestamp = Date.now();
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}_${timestamp}.${fileExt}`;

            console.log(`Uploading as ${fileName} to avatars bucket`);

            const { data, error } = await supabase.storage
                .from('avatars')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (error) {
                console.error('Error uploading avatar to Supabase:', error);
                throw error;
            }

            const { data: urlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            if (!urlData || !urlData.publicUrl) {
                console.error('Failed to get public URL for uploaded avatar');
                throw new Error('Failed to get public URL for uploaded avatar');
            }

            const publicUrl = urlData.publicUrl;
            console.log('Avatar uploaded successfully, URL:', publicUrl);

            return publicUrl;
        } catch (err) {
            console.error('Error in uploadAvatar:', err);
            throw err;
        }
    },

    clearProfile: () => {
        set({ profile: null });
    }
})); 