import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useLessonStore from '../../store/lessonStore';
import { useCourseStore } from '../../store/courseStore';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

const LessonForm = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  
  // Get methods from stores
  const { 
    addLesson, 
    updateLesson, 
    getLessonById, 
    isLoading: lessonLoading 
  } = useLessonStore();
  
  const { getCourseById } = useCourseStore();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    videoUrl: '',
    order: '',
    duration: '',
    courseId: courseId,
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Check if we're in edit mode
  const isEditMode = !!lessonId;

  // Load lesson data if in edit mode
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Load course information
        setLoadingMessage('Loading course information...');
        const course = await getCourseById(courseId);
        if (course) {
          setCourseTitle(course.title);
        }
        
        // Load lesson data if in edit mode
        if (isEditMode) {
          setLoadingMessage('Loading lesson data...');
          const lessonData = await getLessonById(lessonId);
          
          if (lessonData) {
            setFormData({
              title: lessonData.title || '',
              content: lessonData.description || '', // Map 'description' from DB to 'content' in form
              videoUrl: lessonData.youtube_video_id || '',  // Map 'youtube_video_id' from DB to 'videoUrl' in form
              order: lessonData.order_index?.toString() || '', // Map 'order_index' from DB to 'order' in form
              duration: lessonData.duration_minutes?.toString() || '', // Map 'duration_minutes' from DB to 'duration' in form
              courseId: courseId,
            });
          } else {
            toast.error('Failed to load lesson data');
            navigate(`/admin/courses/${courseId}/lessons`);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error(`Error loading data: ${error.message}`);
      } finally {
        setIsLoading(false);
        setLoadingMessage('');
      }
    };

    loadData();
  }, [courseId, lessonId, isEditMode, getCourseById, getLessonById, navigate]);

  // Update form data when input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear the error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (!formData.order.trim()) {
      newErrors.order = 'Order is required';
    } else if (isNaN(Number(formData.order)) || Number(formData.order) <= 0) {
      newErrors.order = 'Order must be a positive number';
    }
    
    // Optional fields with validation
    if (formData.duration && (isNaN(Number(formData.duration)) || Number(formData.duration) <= 0)) {
      newErrors.duration = 'Duration must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    console.log('Submitting form data:', formData);
    console.log('Course ID from params:', courseId);
    console.log('Form courseId:', formData.courseId);
    
    setIsLoading(true);
    
    try {
      if (isEditMode) {
        setLoadingMessage('Updating lesson...');
        await updateLesson(lessonId, formData);
        toast.success('Lesson updated successfully');
      } else {
        setLoadingMessage('Creating new lesson...');
        await addLesson(formData);
        toast.success('Lesson created successfully');
      }
      
      // Navigate back to lessons list
      navigate(`/admin/courses/${courseId}/lessons`);
    } catch (error) {
      console.error('Error saving lesson:', error);
      toast.error(`Failed to save lesson: ${error.message}`);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  if (isLoading || lessonLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">{loadingMessage || 'Loading...'}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Lesson' : 'Create New Lesson'} 
        {courseTitle && ` - ${courseTitle}`}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Lesson Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter lesson title"
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>

        {/* Content textarea */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Lesson Content *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="6"
            className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              errors.content ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter lesson content"
          ></textarea>
          {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
        </div>

        {/* Video URL input */}
        <div>
          <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
            YouTube Video URL or ID
          </label>
          <input
            type="text"
            id="videoUrl"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter YouTube URL or video ID (e.g. 'dQw4w9WgXcQ' or complete URL)"
          />
          <p className="mt-1 text-xs text-gray-500">
            Enter a YouTube video ID or full URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)
          </p>
        </div>

        {/* Order input */}
        <div>
          <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
            Order *
          </label>
          <input
            type="number"
            id="order"
            name="order"
            value={formData.order}
            onChange={handleChange}
            min="1"
            className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              errors.order ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter lesson order (e.g., 1, 2, 3)"
          />
          {errors.order && <p className="mt-1 text-sm text-red-500">{errors.order}</p>}
        </div>

        {/* Duration input */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
            Duration (minutes)
          </label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            min="1"
            className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              errors.duration ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter lesson duration in minutes"
          />
          {errors.duration && <p className="mt-1 text-sm text-red-500">{errors.duration}</p>}
        </div>

        {/* Form buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(`/admin/courses/${courseId}/lessons`)}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : isEditMode ? 'Update Lesson' : 'Create Lesson'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LessonForm; 