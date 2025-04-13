import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

const useLessonStore = create((set, get) => ({
    lessons: [],
    currentLesson: null,
    isLoading: false,
    error: null,

    // Reset store state
    resetState: () => {
        set({
            lessons: [],
            currentLesson: null,
            isLoading: false,
            error: null
        });
    },

    // Fetch all lessons for a course
    getLessonsByCourseId: async (courseId) => {
        if (!courseId) return [];

        set({ isLoading: true, error: null });

        try {
            console.log('Fetching lessons for course:', courseId);

            const { data, error } = await supabase
                .from('lessons')
                .select('*')
                .eq('course_id', courseId)
                .order('order_index', { ascending: true });

            if (error) throw error;

            console.log('Lessons fetched:', data);
            set({ lessons: data || [] });
            return data || [];
        } catch (error) {
            console.error('Error fetching lessons:', error);
            set({ error: error.message });
            return [];
        } finally {
            set({ isLoading: false });
        }
    },

    // Fetch a single lesson
    getLessonById: async (lessonId) => {
        if (!lessonId) return null;

        set({ isLoading: true, error: null });

        try {
            console.log('Fetching lesson:', lessonId);

            const { data, error } = await supabase
                .from('lessons')
                .select('*')
                .eq('id', lessonId)
                .single();

            if (error) throw error;

            console.log('Lesson fetched:', data);
            set({ currentLesson: data });
            return data;
        } catch (error) {
            console.error('Error fetching lesson:', error);
            set({ error: error.message });
            return null;
        } finally {
            set({ isLoading: false });
        }
    },

    // Add a new lesson
    addLesson: async (lessonData) => {
        set({ isLoading: true, error: null });

        try {
            console.log('Adding lesson with data:', lessonData);

            const { title, content, videoUrl, order, duration, courseId } = lessonData;
            console.log('Extracted courseId:', courseId);

            // Extract YouTube video ID from URL or use directly
            let youtubeVideoId = videoUrl || '';

            // If it's a full YouTube URL, extract the ID
            if (youtubeVideoId.includes('youtube.com') || youtubeVideoId.includes('youtu.be')) {
                const urlObj = new URL(youtubeVideoId);
                if (youtubeVideoId.includes('youtube.com')) {
                    youtubeVideoId = urlObj.searchParams.get('v') || '';
                } else if (youtubeVideoId.includes('youtu.be')) {
                    youtubeVideoId = urlObj.pathname.substring(1) || '';
                }
            }

            // If no video ID, use a placeholder
            if (!youtubeVideoId) {
                youtubeVideoId = 'placeholder';
            }

            // Map form fields to database columns
            const lessonToAdd = {
                title,
                description: content, // Map 'content' from form to 'description' in DB
                youtube_video_id: youtubeVideoId, // Use the extracted ID or placeholder
                order_index: parseInt(order), // Map 'order' from form to 'order_index' in DB
                duration_minutes: duration ? parseInt(duration) : null, // Map 'duration' from form to 'duration_minutes' in DB
                course_id: courseId
            };

            console.log('Lesson object to add:', lessonToAdd);

            const { data, error } = await supabase
                .from('lessons')
                .insert(lessonToAdd)
                .select();

            if (error) throw error;

            console.log('Lesson added successfully:', data);

            // Update lessons list
            const { getLessonsByCourseId } = get();
            await getLessonsByCourseId(courseId);

            return data[0];
        } catch (error) {
            console.error('Error adding lesson:', error);
            set({ error: error.message });
            toast.error(`Failed to add lesson: ${error.message}`);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // Update a lesson
    updateLesson: async (lessonId, lessonData) => {
        if (!lessonId) return null;

        set({ isLoading: true, error: null });

        try {
            console.log('Updating lesson:', lessonId, 'with data:', lessonData);

            const { title, content, videoUrl, order, duration, courseId } = lessonData;

            // Extract YouTube video ID from URL or use directly
            let youtubeVideoId = videoUrl || '';

            // If it's a full YouTube URL, extract the ID
            if (youtubeVideoId.includes('youtube.com') || youtubeVideoId.includes('youtu.be')) {
                const urlObj = new URL(youtubeVideoId);
                if (youtubeVideoId.includes('youtube.com')) {
                    youtubeVideoId = urlObj.searchParams.get('v') || '';
                } else if (youtubeVideoId.includes('youtu.be')) {
                    youtubeVideoId = urlObj.pathname.substring(1) || '';
                }
            }

            // If no video ID, use a placeholder
            if (!youtubeVideoId) {
                youtubeVideoId = 'placeholder';
            }

            // Map form fields to database columns
            const lessonToUpdate = {
                title,
                description: content, // Map 'content' from form to 'description' in DB
                youtube_video_id: youtubeVideoId, // Use the extracted ID
                order_index: parseInt(order), // Map 'order' from form to 'order_index' in DB
                duration_minutes: duration ? parseInt(duration) : null, // Map 'duration' from form to 'duration_minutes' in DB
            };

            const { data, error } = await supabase
                .from('lessons')
                .update(lessonToUpdate)
                .eq('id', lessonId)
                .select();

            if (error) throw error;

            console.log('Lesson updated successfully:', data);

            // Update the current lesson and lessons list
            set({ currentLesson: data[0] });

            const { getLessonsByCourseId } = get();
            await getLessonsByCourseId(courseId);

            return data[0];
        } catch (error) {
            console.error('Error updating lesson:', error);
            set({ error: error.message });
            toast.error(`Failed to update lesson: ${error.message}`);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // Delete a lesson
    deleteLesson: async (lessonId, courseId) => {
        if (!lessonId) return false;

        console.log('deleteLesson called with:', { lessonId, courseId });

        if (!courseId) {
            console.error('deleteLesson: courseId is missing');
            toast.error('Cannot delete lesson: course ID is missing');
            return false;
        }

        set({ isLoading: true, error: null });

        try {
            console.log('Attempting to delete lesson:', lessonId, 'from course:', courseId);

            const { error } = await supabase
                .from('lessons')
                .delete()
                .eq('id', lessonId);

            if (error) throw error;

            console.log('Lesson deleted successfully');

            // Update lessons list
            const { getLessonsByCourseId } = get();
            await getLessonsByCourseId(courseId);

            return true;
        } catch (error) {
            console.error('Error deleting lesson:', error);
            set({ error: error.message });
            toast.error(`Failed to delete lesson: ${error.message}`);
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    // Reset the current lesson state
    resetCurrentLesson: () => {
        set({ currentLesson: null });
    },

    // Clear errors
    clearError: () => {
        set({ error: null });
    }
}));

export default useLessonStore; 