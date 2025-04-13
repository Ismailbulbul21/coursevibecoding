import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCourseStore } from '../../store/courseStore';
import LoadingSpinner from '../../components/LoadingSpinner';

const CourseForm = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const isEditMode = courseId !== 'new';
  const fileInputRef = useRef(null);

  // Get functions and state from course store
  const { 
    addCourse, 
    updateCourse, 
    getCourseById,
    uploadCourseImage,
    isLoading, 
    error: storeError 
  } = useCourseStore();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    price: '',
    level: 'Beginner', // Default to Beginner
    imageUrl: '',
    videoUrl: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitError, setSubmitError] = useState(null);

  // Load course data if in edit mode
  useEffect(() => {
    const loadCourse = async () => {
      if (isEditMode) {
        try {
          const course = await getCourseById(courseId);
          if (course) {
            // Map database fields (snake_case) to form fields (camelCase)
            setFormData({
              title: course.title || '',
              description: course.description || '',
              short_description: course.short_description || '',
              price: course.price ? course.price.toString() : '',
              level: course.level || 'Beginner',
              imageUrl: course.image_url || '', // Map from snake_case
              videoUrl: course.video_url || '', // Map from snake_case
            });
            
            // Set image preview if there's an image_url
            if (course.image_url) {
              setImagePreview(course.image_url);
            }
          }
        } catch (err) {
          console.error('Failed to load course:', err);
        }
      } else {
        // Reset the form for new course
        setFormData({
          title: '',
          description: '',
          short_description: '',
          price: '',
          level: 'Beginner',
          imageUrl: '',
          videoUrl: '',
        });
        setImagePreview('');
        setImageFile(null);
      }
    };

    loadCourse();
  }, [courseId, isEditMode, getCourseById]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear errors when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSubmitError('Image file is too large. Maximum size is 5MB.');
        return;
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setSubmitError('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.');
        return;
      }
      
      setImageFile(file);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Clear any previous errors
      setSubmitError(null);
    }
  };

  // Trigger file input click
  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.short_description.trim()) {
      errors.short_description = 'Short description is required';
    } else if (formData.short_description.length > 150) {
      errors.short_description = 'Short description must be 150 characters or less';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.price) {
      errors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      errors.price = 'Price must be a valid positive number';
    }
    
    // Validate level
    const validLevels = ['Beginner', 'Intermediate', 'Advanced'];
    if (!formData.level || !validLevels.includes(formData.level)) {
      errors.level = 'Please select a valid difficulty level';
    }
    
    // Check if we have either an image URL or an image file
    if (!formData.imageUrl && !imageFile) {
      errors.imageUrl = 'An image URL or uploaded image is required';
    }
    
    setFormErrors(errors);
    
    // Display errors at the top of the form if any
    if (Object.keys(errors).length > 0) {
      const errorMessage = 'Please correct the following issues: ' + 
        Object.values(errors).join(', ');
      setSubmitError(errorMessage);
    } else {
      setSubmitError(null);
    }
    
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSaving(true);
    setSubmitError(null);
    
    try {
      // First, prepare the course data without the image
      const courseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        short_description: formData.short_description.trim(),
        price: parseFloat(formData.price),
        level: formData.level,
        image_url: formData.imageUrl || '', // Start with the URL if provided
        video_url: formData.videoUrl ? formData.videoUrl.trim() : '',
        is_published: true, // Default to published
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // For new courses, save the course first to get an ID, then handle the image
      if (!isEditMode && imageFile) {
        console.log('Creating new course first to get an ID');
        
        try {
          // Create course without image first
          const newCourse = await addCourse(courseData);
          console.log('New course created with ID:', newCourse?.id);
          
          if (!newCourse || !newCourse.id) {
            throw new Error('Failed to create course - no ID returned');
          }
          
          // Now upload the image with the real course ID
          console.log('Uploading image for new course with ID:', newCourse.id);
          const imageUrl = await uploadCourseImage(imageFile, newCourse.id);
          
          if (imageUrl) {
            // Update the course with the image URL - using the newCourse.id explicitly to avoid undefined
            await updateCourse(newCourse.id, {
              ...courseData,
              image_url: imageUrl
            });
            
            console.log('Course updated with image URL:', imageUrl);
            navigate('/admin/courses');
          } else {
            console.log('Image upload failed but course was created');
            navigate('/admin/courses');
          }
        } catch (saveError) {
          handleSaveError(saveError);
        }
      } else {
        // For existing courses or new courses without images, proceed normally
        let imageUrl = formData.imageUrl;
        
        // Upload image file if selected (for existing courses)
        if (imageFile && isEditMode && courseId) {
          try {
            // Upload the image - make sure courseId is valid
            imageUrl = await uploadCourseImage(imageFile, courseId);
            courseData.image_url = imageUrl;
          } catch (uploadError) {
            console.error('Image upload error:', uploadError);
            
            // If we have a fallback URL, use it
            if (formData.imageUrl) {
              console.log('Using fallback image URL:', formData.imageUrl);
              courseData.image_url = formData.imageUrl;
            } else {
              // Convert to data URL as fallback
              try {
                console.log('Converting image to data URL as fallback...');
                courseData.image_url = await convertToDataURL(imageFile);
              } catch (dataUrlError) {
                console.error('Failed to generate data URL:', dataUrlError);
                setSubmitError(`Image upload failed: ${uploadError.message}. Please try a different image or provide a URL.`);
                setIsSaving(false);
                return;
              }
            }
          }
        }
        
        try {
          // Save/update the course
          if (isEditMode && courseId) {
            await updateCourse(courseId, courseData);
          } else {
            await addCourse(courseData);
          }
          console.log('Course saved successfully');
          navigate('/admin/courses');
        } catch (saveError) {
          handleSaveError(saveError);
        }
      }
    } catch (error) {
      console.error('Unhandled error in form submission:', error);
      setSubmitError(`Unexpected error: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Helper to handle save errors consistently
  const handleSaveError = (saveError) => {
    console.error('Error saving course:', saveError);
    
    // Show a more helpful error message
    let errorMessage = 'An error occurred while saving the course. ';
    
    if (saveError.message.includes('duplicate key')) {
      errorMessage += 'A course with this title already exists.';
    } else if (saveError.message.includes('permission denied')) {
      errorMessage += 'You don\'t have permission to save this course. Please check your admin rights.';
    } else if (saveError.message.includes('foreign key constraint')) {
      errorMessage += 'There\'s a reference issue with the database. This is likely a bug.';
    } else if (saveError.message.includes('uuid')) {
      errorMessage += 'There was an issue with the course ID. Please try again.';
    } else {
      errorMessage += saveError.message || 'Please try again.';
    }
    
    setSubmitError(errorMessage);
  };

  // Fallback method to convert image to data URL
  const convertToDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  if (isLoading && isEditMode) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Course' : 'Create New Course'}
      </h1>
      
      {(storeError || submitError) && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
          {submitError || storeError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              formErrors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 mb-1">
            Short Description <span className="text-xs text-gray-500">(Displayed on course cards)</span>
          </label>
          <input
            type="text"
            id="short_description"
            name="short_description"
            value={formData.short_description}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md font-medium ${
              formErrors.short_description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="A brief summary of your course (1-2 sentences)"
            maxLength={150}
          />
          <p className="mt-1 text-xs text-gray-500">
            Maximum 150 characters. This will appear on course cards and search results.
          </p>
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Full Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              formErrors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={6}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </label>
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              formErrors.price ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty Level
          </label>
          <select
            id="level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              formErrors.level ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              formErrors.imageUrl ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter image URL or upload an image below"
          />
          <p className="mt-1 text-xs text-gray-500">
            Enter an external image URL (e.g., https://example.com/image.jpg) as a fallback in case direct upload fails
          </p>
          {formErrors.imageUrl && (
            <p className="mt-1 text-sm text-red-600">{formErrors.imageUrl}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Image
          </label>
          <div className="flex items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={handleBrowseClick}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md mr-3"
            >
              Browse...
            </button>
            <span className="text-sm text-gray-500">
              {imageFile ? imageFile.name : 'No file selected'}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Maximum file size: 5MB. Supported formats: JPEG, PNG, GIF, WebP
          </p>
          {imagePreview && (
            <div className="mt-3">
              <img src={imagePreview} alt="Preview" className="h-32 object-cover rounded-md" />
            </div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Video URL
          </label>
          <input
            type="text"
            id="videoUrl"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              formErrors.videoUrl ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>
        <div className="mt-6">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;