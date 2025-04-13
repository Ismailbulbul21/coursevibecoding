import { create } from 'zustand';
import { supabase, addCourseDirectly } from '../lib/supabase';

// Function to initialize storage buckets
const initializeStorage = async () => {
    try {
        console.log('Checking storage buckets...');

        // First, check if we can access the Supabase project
        const { data: user, error: authError } = await supabase.auth.getUser();
        if (authError) {
            console.error('Error authenticating with Supabase:', authError);
            console.log('Authentication status: Not authenticated. This may limit storage operations.');
        } else {
            console.log('Authentication status: Authenticated as', user?.user?.email || 'anonymous user');
        }

        // Try to list buckets - this will tell us if we have admin access
        const { data: buckets, error } = await supabase.storage.listBuckets();

        if (error) {
            console.error('Error listing buckets:', error);
            console.warn('You may not have admin permissions to list or create buckets.');

            // Check if buckets exist by trying to list objects directly
            console.log('Trying to access course-images bucket directly...');
            const { data: imageFiles, error: imageError } = await supabase
                .storage
                .from('course-images')
                .list();

            if (imageError) {
                console.error('Error accessing course-images bucket:', imageError);
                console.log('Attempting to create course-images bucket...');

                try {
                    // Try to create the bucket
                    const { data, error: createError } = await supabase
                        .storage
                        .createBucket('course-images', { public: true });

                    if (createError) {
                        console.error('Failed to create course-images bucket:', createError);

                        // Try a different approach - create a tiny test file
                        console.log('Attempting to upload a test file to create the bucket...');
                        const testBlob = new Blob(['test'], { type: 'text/plain' });
                        const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });

                        const { data: uploadData, error: uploadError } = await supabase
                            .storage
                            .from('course-images')
                            .upload('test.txt', testFile, {
                                cacheControl: '3600',
                                upsert: true
                            });

                        if (uploadError) {
                            console.error('Failed to create test file in course-images:', uploadError);
                        } else {
                            console.log('Successfully created test file in course-images bucket');
                        }
                    } else {
                        console.log('Successfully created course-images bucket');
                    }
                } catch (e) {
                    console.error('Exception when creating bucket:', e);
                }
            } else {
                console.log('course-images bucket exists and is accessible');
            }

            // Try the same for course-materials bucket
            console.log('Trying to access course-materials bucket directly...');
            const { data: materialFiles, error: materialError } = await supabase
                .storage
                .from('course-materials')
                .list();

            if (materialError) {
                console.error('Error accessing course-materials bucket:', materialError);
                console.log('Attempting to create course-materials bucket...');

                try {
                    // Try to create the bucket
                    const { data, error: createError } = await supabase
                        .storage
                        .createBucket('course-materials', { public: true });

                    if (createError) {
                        console.error('Failed to create course-materials bucket:', createError);

                        // Try a different approach - create a tiny test file
                        console.log('Attempting to upload a test file to create the bucket...');
                        const testBlob = new Blob(['test'], { type: 'text/plain' });
                        const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });

                        const { data: uploadData, error: uploadError } = await supabase
                            .storage
                            .from('course-materials')
                            .upload('test.txt', testFile, {
                                cacheControl: '3600',
                                upsert: true
                            });

                        if (uploadError) {
                            console.error('Failed to create test file in course-materials:', uploadError);
                        } else {
                            console.log('Successfully created test file in course-materials bucket');
                        }
                    } else {
                        console.log('Successfully created course-materials bucket');
                    }
                } catch (e) {
                    console.error('Exception when creating bucket:', e);
                }
            } else {
                console.log('course-materials bucket exists and is accessible');
            }

            return; // Exit early since we can't use the normal bucket operations
        }

        console.log('Available buckets:', buckets?.map(b => b.name) || []);

        // Check if course-images bucket exists, create if it doesn't
        const hasImagesBucket = buckets?.some(bucket => bucket.name === 'course-images');
        if (!hasImagesBucket) {
            console.log('Creating course-images bucket...');
            const { data, error: createError } = await supabase.storage.createBucket(
                'course-images',
                { public: true }
            );

            if (createError) {
                console.error('Error creating course-images bucket:', createError);
            } else {
                console.log('course-images bucket created successfully');
                // Set public access policy
                await setPublicBucketPolicy('course-images');
            }
        } else {
            // Ensure existing bucket has public policy
            console.log('course-images bucket already exists');
            await setPublicBucketPolicy('course-images');
        }

        // Check if course-materials bucket exists, create if it doesn't
        const hasMaterialsBucket = buckets?.some(bucket => bucket.name === 'course-materials');
        if (!hasMaterialsBucket) {
            console.log('Creating course-materials bucket...');
            const { data, error: createError } = await supabase.storage.createBucket(
                'course-materials',
                { public: true }
            );

            if (createError) {
                console.error('Error creating course-materials bucket:', createError);
            } else {
                console.log('course-materials bucket created successfully');
                // Set public access policy
                await setPublicBucketPolicy('course-materials');
            }
        } else {
            // Ensure existing bucket has public policy
            console.log('course-materials bucket already exists');
            await setPublicBucketPolicy('course-materials');
        }
    } catch (err) {
        console.error('Error initializing storage:', err);
    }
};

// Function to set public access for a bucket
const setPublicBucketPolicy = async (bucketName) => {
    try {
        console.log(`Setting public policy for ${bucketName} bucket...`);

        const { error } = await supabase.storage.from(bucketName).createSignedUrl(
            'dummy-path', 60 // Just a test to check bucket access
        );

        if (error && error.statusCode === 400) {
            console.log(`Setting public policy for ${bucketName}...`);

            // Create public access policy
            const { error: policyError } = await supabase.storage.from(bucketName)
                .createSignedUrl('test.txt', 60); // This will fail but helps check permissions

            if (policyError) {
                console.warn(`Unable to set public policy for ${bucketName}: ${policyError.message}`);
                console.log('Using alternative method...');

                // Try to make the bucket public
                const { error: updateError } = await supabase.rpc('update_bucket_policy', {
                    bucket_name: bucketName,
                    public_policy: true
                });

                if (updateError) {
                    console.error(`Failed to update ${bucketName} policy:`, updateError);
                } else {
                    console.log(`Successfully updated ${bucketName} policy to public`);
                }
            }
        } else {
            console.log(`${bucketName} bucket appears to have proper access configuration`);
        }
    } catch (err) {
        console.error(`Error setting public policy for ${bucketName}:`, err);
    }
};

// Try to initialize storage buckets
initializeStorage();

// Function to ensure Supabase URLs are formatted correctly
const ensurePublicUrl = (url) => {
    if (!url) return url;

    // If it's a Supabase URL and missing the /public/ path segment
    if (url.includes('supabase.co/storage/v1/object/') && !url.includes('/public/')) {
        return url.replace('/object/', '/object/public/');
    }

    return url;
};

export const useCourseStore = create((set, get) => ({
    courses: [],
    currentCourse: null,
    lessons: [],
    currentLesson: null,
    isLoading: false,
    error: null,

    fetchCourses: async () => {
        set({ isLoading: true, error: null });
        console.log('Fetching all courses...');
        try {
            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching courses:', error);
                throw error;
            }

            // Ensure image URLs are correct
            const processedData = data.map(course => ({
                ...course,
                image_url: ensurePublicUrl(course.image_url),
                thumbnail_url: ensurePublicUrl(course.thumbnail_url)
            }));

            console.log('Fetched courses:', processedData);
            set({ courses: processedData, isLoading: false });
            return processedData;
        } catch (error) {
            console.error('Exception when fetching courses:', error);
            set({ error: error.message, isLoading: false });
            return [];
        }
    },

    fetchCourse: async (courseId) => {
        set({ isLoading: true, error: null });
        try {
            if (!courseId || courseId === 'undefined') {
                set({ error: 'Invalid course ID', isLoading: false });
                return null;
            }

            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .eq('id', courseId)
                .single();

            if (error) throw error;

            // Ensure image URLs are correct
            const processedData = {
                ...data,
                image_url: ensurePublicUrl(data.image_url),
                thumbnail_url: ensurePublicUrl(data.thumbnail_url)
            };

            console.log('Fetched course with corrected URLs:', processedData);
            set({ currentCourse: processedData, isLoading: false });
            return processedData;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return null;
        }
    },

    getCourseById: async (courseId) => {
        if (!courseId || courseId === 'undefined' || courseId === 'new') {
            return null;
        }
        return get().fetchCourse(courseId);
    },

    uploadCourseImage: async (file, courseId) => {
        try {
            console.log(`Uploading image for course ${courseId}...`);

            if (!file) {
                console.error('No file provided for upload');
                throw new Error('No file provided for upload');
            }

            // Generate a unique ID for new courses or undefined IDs
            const timestamp = Date.now();
            const safeId = courseId && courseId !== 'new' && courseId !== 'undefined' ?
                courseId : 'temp-' + timestamp;

            // Generate a unique filename with timestamp to avoid cache issues
            const fileExt = file.name.split('.').pop();
            const fileName = `${safeId}_${timestamp}.${fileExt}`;

            console.log(`Uploading as ${fileName} to course-images bucket`);

            const { data, error } = await supabase.storage
                .from('course-images')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (error) {
                console.error('Error uploading image to Supabase:', error);
                throw error;
            }

            const { data: urlData } = supabase.storage
                .from('course-images')
                .getPublicUrl(fileName);

            if (!urlData || !urlData.publicUrl) {
                console.error('Failed to get public URL for uploaded image');
                throw new Error('Failed to get public URL for uploaded image');
            }

            const publicUrl = urlData.publicUrl;
            console.log('Image uploaded successfully, URL:', publicUrl);

            return publicUrl;
        } catch (err) {
            console.error('Error in uploadCourseImage:', err);
            throw err;
        }
    },

    uploadCourseMaterial: async (file, courseId) => {
        set({ isLoading: true, error: null });
        try {
            if (!file) throw new Error('No file provided');

            const fileExt = file.name.split('.').pop();
            const fileName = `${courseId}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { data, error } = await supabase.storage
                .from('course-materials')
                .upload(filePath, file);

            if (error) throw error;

            const { data: urlData } = supabase.storage
                .from('course-materials')
                .getPublicUrl(filePath);

            set({ isLoading: false });
            return urlData.publicUrl;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return null;
        }
    },

    fetchLessons: async (courseId) => {
        set({ isLoading: true, error: null });
        try {
            console.log(`Fetching lessons for course ID: ${courseId}`);

            if (!courseId || courseId === 'undefined') {
                console.error('Invalid course ID provided to fetchLessons');
                set({ error: 'Invalid course ID', isLoading: false, lessons: [] });
                return [];
            }

            const { data, error } = await supabase
                .from('lessons')
                .select('*')
                .eq('course_id', courseId)
                .order('order_index', { ascending: true });

            if (error) {
                console.error('Error fetching lessons:', error);
                throw error;
            }

            console.log(`Found ${data?.length || 0} lessons for course ${courseId}:`, data);

            // Even if no lessons are found, we should set an empty array rather than undefined
            set({ lessons: data || [], isLoading: false });
            return data || [];
        } catch (error) {
            console.error('Exception in fetchLessons:', error);
            set({ error: error.message, isLoading: false, lessons: [] });
            return [];
        }
    },

    fetchLesson: async (lessonId) => {
        set({ isLoading: true, error: null });
        try {
            console.log(`Fetching lesson with ID: ${lessonId}`);

            if (!lessonId || lessonId === 'undefined') {
                console.error('Invalid lesson ID provided to fetchLesson');
                set({ error: 'Invalid lesson ID', isLoading: false });
                return null;
            }

            const { data, error } = await supabase
                .from('lessons')
                .select('*')
                .eq('id', lessonId)
                .single();

            if (error) {
                console.error('Error fetching lesson:', error);
                throw error;
            }

            console.log('Lesson fetched:', data);
            set({ currentLesson: data, isLoading: false });
            return data;
        } catch (error) {
            console.error('Exception in fetchLesson:', error);
            set({ error: error.message, isLoading: false });
            return null;
        }
    },

    updateProgress: async (lessonId, isCompleted, position = 0) => {
        try {
            // Get current user
            const { data: userData } = await supabase.auth.getUser();
            const userId = userData?.user?.id;

            if (!userId) {
                console.error('Cannot update progress: No user ID available');
                return null;
            }

            console.log(`Updating progress for lesson ${lessonId}, user ${userId}`);

            const { data, error } = await supabase
                .from('progress')
                .upsert({
                    user_id: userId,
                    lesson_id: lessonId,
                    is_completed: isCompleted,
                    last_watched_position: position,
                    updated_at: new Date().toISOString()
                })
                .select();

            if (error) {
                console.error('Error updating progress:', error);
                throw error;
            }

            console.log('Progress updated successfully:', data);
            return data;
        } catch (error) {
            console.error('Error updating progress:', error);
            return null;
        }
    },

    addCourse: async (courseData) => {
        set({ isLoading: true, error: null });
        try {
            console.log('Adding new course with data:', courseData);

            // Make sure the data is formatted correctly for the database
            const cleanedData = {
                ...courseData,
                price: parseFloat(courseData.price || 0),
                created_at: courseData.created_at || new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            const { data, error } = await supabase
                .from('courses')
                .insert([cleanedData])
                .select()
                .single();

            if (error) {
                console.error('Database error adding course:', error);
                set({ error: `Failed to add course: ${error.message}`, isLoading: false });
                throw new Error(`Database error: ${error.message}`);
            }

            if (!data) {
                console.error('No data returned from insert operation');
                set({ error: 'Failed to add course: No data returned', isLoading: false });
                throw new Error('No data returned from insert operation');
            }

            console.log('Course added successfully, ID:', data.id);

            // Update the courses list with the new course
            set(state => ({
                courses: [data, ...state.courses],
                currentCourse: data,
                isLoading: false,
                error: null
            }));

            return data;
        } catch (err) {
            console.error('Error adding course:', err);
            set({ error: err.message || 'Failed to add course', isLoading: false });
            throw err;
        }
    },

    updateCourse: async (courseId, courseData) => {
        set({ isLoading: true, error: null });
        try {
            // Validate course ID
            if (!courseId || courseId === 'undefined') {
                console.error('Invalid course ID provided to updateCourse:', courseId);
                set({ error: 'Invalid course ID', isLoading: false });
                throw new Error('Invalid course ID provided to updateCourse');
            }

            console.log(`Updating course ${courseId} with data:`, courseData);

            // Make sure the data is formatted correctly for the database
            const cleanedData = {
                ...courseData,
                price: parseFloat(courseData.price || 0),
                updated_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('courses')
                .update(cleanedData)
                .eq('id', courseId)
                .select()
                .single();

            if (error) {
                console.error('Database error updating course:', error);
                set({ error: `Failed to update course: ${error.message}`, isLoading: false });
                throw new Error(`Database error: ${error.message}`);
            }

            if (!data) {
                console.error('No data returned from update operation');
                set({ error: 'Failed to update course: No data returned', isLoading: false });
                throw new Error('No data returned from update operation');
            }

            console.log('Course updated successfully:', data);

            // Update the courses list with the updated course
            set(state => ({
                courses: state.courses.map(c => c.id === courseId ? data : c),
                currentCourse: data,
                isLoading: false,
                error: null
            }));

            return data;
        } catch (err) {
            console.error('Error updating course:', err);
            set({ error: err.message || 'Failed to update course', isLoading: false });
            throw err;
        }
    },

    deleteCourse: async (courseId) => {
        set({ isLoading: true, error: null });
        try {
            if (!courseId || courseId === 'undefined') {
                set({ error: 'Invalid course ID', isLoading: false });
                return false;
            }

            const { error } = await supabase
                .from('courses')
                .delete()
                .eq('id', courseId);

            if (error) throw error;

            // Update courses list after successful deletion
            set({
                courses: get().courses.filter(course => course.id !== courseId),
                isLoading: false
            });

            return true;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return false;
        }
    },
})); 