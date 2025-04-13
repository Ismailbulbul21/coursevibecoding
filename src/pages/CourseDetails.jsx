import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCourseStore } from '../store/courseStore';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import ImageDebugger from '../components/ImageDebugger';
import { supabase } from '../lib/supabase';

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { fetchCourse, fetchLessons, currentCourse, lessons, isLoading } = useCourseStore();
  const [isEnrolled, setIsEnrolled] = useState(false);
  
  useEffect(() => {
    if (courseId) {
      fetchCourse(courseId);
      fetchLessons(courseId);
    }
  }, [courseId, fetchCourse, fetchLessons]);
  
  useEffect(() => {
    if (currentCourse) {
      console.log('Course details loaded:', currentCourse);
      console.log('Image URL:', currentCourse.image_url);
      console.log('Thumbnail URL:', currentCourse.thumbnail_url);
      console.log('Video URL:', currentCourse.video_url);
      
      // Try to preload the image to check if it loads correctly
      if (currentCourse.image_url) {
        const img = new Image();
        img.onload = () => console.log('Image preloaded successfully');
        img.onerror = () => console.error('Failed to preload image:', currentCourse.image_url);
        img.src = currentCourse.image_url;
      }
    }
  }, [currentCourse]);
  
  // Check if user is enrolled - would typically be done via a query
  // For now we'll just use a placeholder
  useEffect(() => {
    // Check if user is admin and automatically set as enrolled
    const checkEnrollmentStatus = async () => {
      if (!isAuthenticated) {
        console.log('User is not authenticated, cannot be enrolled');
        setIsEnrolled(false);
        return;
      }
      
      try {
        console.log('CourseDetails: Checking enrollment for course:', courseId);
        
        // Get the current user ID
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;
        
        if (!user) {
          console.log('CourseDetails: No user available from auth');
          setIsEnrolled(false);
          return;
        }
        
        console.log('CourseDetails: Got user:', user.id);
        
        // Get the current user profile to check admin status
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          console.error('CourseDetails: Error fetching profile:', profileError);
        }
          
        // If the user is an admin, automatically set as enrolled
        if (profile?.is_admin) {
          console.log('CourseDetails: User is admin - automatically enrolled');
          setIsEnrolled(true);
          return;
        }
        
        // Otherwise check actual enrollment
        console.log('CourseDetails: Checking enrollment records');
        const { data, error } = await supabase
          .from('enrollments')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .single();
          
        if (error) {
          console.log('CourseDetails: No enrollment found', error);
          setIsEnrolled(false);
        } else {
          console.log('CourseDetails: Enrollment found', data);
          setIsEnrolled(!!data);
        }
      } catch (error) {
        console.error('CourseDetails: Error checking enrollment:', error);
        setIsEnrolled(false);
      }
    };
    
    checkEnrollmentStatus();
  }, [courseId, isAuthenticated]);
  
  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      console.log('CourseDetails: User not authenticated, redirecting to login');
      navigate('/login', { state: { returnUrl: `/courses/${courseId}` } });
      return;
    }
    
    // If already enrolled, don't navigate directly to the course content
    // Instead, allow them to click on individual lessons
    if (isEnrolled) {
      console.log('CourseDetails: User is already enrolled');
      return;
    }
    
    // User is not enrolled, redirect to payment
    console.log('CourseDetails: User not enrolled, redirecting to payment');
    navigate(`/courses/${courseId}/payment`);
  };
  
  if (isLoading || !currentCourse) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Course Header */}
        <div className="relative">
          {currentCourse.image_url ? (
            <div className="relative">
              <ImageDebugger 
                imageUrl={currentCourse.image_url}
                title={currentCourse.title}
                className="w-full h-64 object-cover"
                showDebugInfo={true}
              />
            </div>
          ) : currentCourse.thumbnail_url ? (
            <div className="relative">
              <ImageDebugger 
                imageUrl={currentCourse.thumbnail_url}
                title={currentCourse.title}
                className="w-full h-64 object-cover"
                showDebugInfo={true}
              />
            </div>
          ) : (
            <div className="w-full h-64 bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500">No image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
            <div className="p-6 w-full">
              <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${
                currentCourse.level === 'beginner' || currentCourse.level === 'Beginner'
                  ? 'text-green-600 bg-green-100'
                  : currentCourse.level === 'intermediate' || currentCourse.level === 'Intermediate'
                    ? 'text-yellow-600 bg-yellow-100' 
                    : 'text-red-600 bg-red-100'
              }`}>
                {currentCourse.level}
              </span>
              <h1 className="text-3xl font-bold text-white mt-2">{currentCourse.title}</h1>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
          <div className="lg:col-span-2">
            {/* Course Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">About This Course</h2>
              <p className="text-gray-700 whitespace-pre-line">{currentCourse.description}</p>
            </div>
            
            {/* Course Video */}
            {currentCourse.video_url && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Course Preview</h2>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={currentCourse.video_url.includes('youtube.com/watch?v=') 
                      ? currentCourse.video_url.replace('youtube.com/watch?v=', 'youtube.com/embed/') 
                      : currentCourse.video_url.includes('youtu.be/') 
                        ? currentCourse.video_url.replace('youtu.be/', 'youtube.com/embed/') 
                        : currentCourse.video_url}
                    title="Course Preview"
                    className="w-full h-64 rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
            
            {/* Course Curriculum */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Course Curriculum</h2>
              {lessons && lessons.length > 0 ? (
                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <div key={lesson.id} className="border border-gray-200 rounded p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-gray-500 text-sm">Lesson {index + 1}</span>
                          <h3 className="font-semibold">{lesson.title}</h3>
                          {lesson.duration_minutes && (
                            <span className="text-gray-500 text-sm">{lesson.duration_minutes} minutes</span>
                          )}
                        </div>
                        {isEnrolled ? (
                          <Link
                            to={`/courses/${courseId}/learn?lessonId=${lesson.id}`}
                            className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition duration-200"
                          >
                            Watch Lesson
                          </Link>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                            Locked
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No lessons available for this course yet.</p>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm sticky top-8">
              <div className="mb-4">
                <span className="text-3xl font-bold text-indigo-600">${currentCourse.price}</span>
              </div>
              
              <ul className="mb-6 space-y-2">
                <li className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>{lessons?.length || 0} lessons</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Level: {currentCourse.level}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Duration: {currentCourse.duration_hours || 'N/A'} hours</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Full lifetime access</span>
                </li>
              </ul>
              
              <button
                onClick={handleEnrollClick}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition duration-200"
              >
                {isEnrolled ? 'Enrolled' : 'Enroll Now'}
              </button>
              
              {isEnrolled && (
                <p className="text-sm text-gray-700 mt-4 text-center">
                  You're enrolled! Click on "Watch Lesson" below to start learning.
                </p>
              )}
              
              {!isAuthenticated && (
                <p className="text-sm text-gray-500 mt-4 text-center">
                  You need to <Link to="/login" className="text-indigo-600 hover:text-indigo-800">login</Link> to enroll
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails; 