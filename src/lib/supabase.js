import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dffmmlqukcxepvoaqloy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmZm1tbHF1a2N4ZXB2b2FxbG95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNjU1OTQsImV4cCI6MjA1OTg0MTU5NH0.bGbM173J4Q9ZiC3_2QVSkj33jqYmMq7a8Rlc_WvlcM0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Use this to log in with the admin user (helpful for testing)
export const loginWithEmail = async (email, password) => {
    return supabase.auth.signInWithPassword({
        email,
        password,
    });
};

// Helper function to check if user is logged in
export const isLoggedIn = async () => {
    const { data } = await supabase.auth.getSession();
    return !!data?.session;
};

// Helper function to directly access course data (without RLS)
export const addCourseDirectly = async (courseData) => {
    try {
        const { data, error } = await supabase
            .from('courses')
            .insert([{
                title: courseData.title,
                description: courseData.description,
                price: courseData.price,
                image_url: courseData.image_url,
                video_url: courseData.video_url,
                level: courseData.level || 'Beginner',
                is_published: true
            }])
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Direct course insert error:', error);
        throw error;
    }
}; 