import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useCourseStore } from '../store/courseStore';
import { usePaymentStore } from '../store/paymentStore';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ReactPlayer from 'react-player';
import { supabase } from '../lib/supabase';

// Helper function to extract YouTube ID from various URL formats
const extractYoutubeId = (url) => {
  if (!url) return null;
  
  console.log('Extracting YouTube ID from:', url);
  
  // Handle standard youtube.com/watch?v= format
  const watchRegex = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/)|youtu\.be\/)([^?&/]+)/;
  const match = url.match(watchRegex);
  
  if (match && match[1]) {
    console.log('Extracted YouTube ID using regex:', match[1]);
    return match[1];
  }
  
  // If it's already just an ID (11 characters)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    console.log('URL is already a valid YouTube ID');
    return url;
  }
  
  console.log('Could not extract YouTube ID from URL');
  return null;
};

const CourseContent = () => {
  const { courseId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAdmin: contextIsAdmin } = useAuth();
  const lessonIdFromUrl = searchParams.get('lessonId');
  
  const { 
    fetchCourse, 
    fetchLessons, 
    fetchLesson,
    updateProgress,
    currentCourse, 
    lessons,
    currentLesson,
    isLoading: storeLoading,
    error: storeError
  } = useCourseStore();
  
  const { fetchUserPayments, userPayments, isLoading: paymentsLoading } = usePaymentStore();
  
  const [activeLesson, setActiveLesson] = useState(null);
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null); // 'approved', 'pending', 'none'
  const [accessError, setAccessError] = useState(null);
  const playerRef = useRef(null);
  const youtubePlayerRef = useRef(null);
  const progressInterval = useRef(null);
  const playerContainerRef = useRef(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [playerError, setPlayerError] = useState(false);
  const [showDirectIframe, setShowDirectIframe] = useState(false);
  const [playerInitialized, setPlayerInitialized] = useState(false);
  const youtubePlayer = useRef(null);
  const progressIntervalRef = useRef(null);
  
  // Load user payments when component mounts
  useEffect(() => {
    if (user) {
      fetchUserPayments();
    }
  }, [user, fetchUserPayments]);
  
  // Check authentication and permissions first
  useEffect(() => {
    const checkAccess = async () => {
      setIsLoading(true);
      setAccessError(null);
        
        if (!user) {
        console.log('CourseContent: No authenticated user');
        setAccessError('Authentication required');
        navigate('/login', { state: { from: `/courses/${courseId}/learn` } });
          return;
        }
      
      try {
        console.log('CourseContent: Checking access for user', user.id, 'to course', courseId);
        
        // 1. Check if user is admin
        let isUserAdmin = contextIsAdmin;
        if (!isUserAdmin) {
          const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
          
          if (profileError) {
            console.error('Error fetching profile:', profileError);
          } else {
            isUserAdmin = profileData?.is_admin || false;
          }
        }
        
        setIsAdmin(isUserAdmin);
        console.log('CourseContent: User admin status:', isUserAdmin);
        
        // Admin has full access, skip enrollment check
        if (isUserAdmin) {
          setEnrollmentStatus('approved');
          setIsLoading(false);
        return;
      }
      
        // 2. Check enrollment status
        const { data: enrollmentData, error: enrollmentError } = await supabase
          .from('enrollments')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .single();
          
        if (enrollmentError) {
          console.log('CourseContent: No enrollment found');
          
          // 3. Check for verified payment if no enrollment exists
          const verifiedPayment = userPayments.find(p => 
            p.course_id === courseId && p.status === 'Verified');
            
          if (verifiedPayment) {
            console.log('CourseContent: Found verified payment, creating enrollment');
            
            // Create a new enrollment with pending status
            const { data: newEnrollment, error: createError } = await supabase
              .from('enrollments')
              .insert([{
                  user_id: user.id, 
                  course_id: courseId,
                is_active: true,
                created_at: new Date().toISOString()
              }])
              .select()
              .single();
              
            if (createError) {
              console.error('Error creating enrollment:', createError);
              setEnrollmentStatus('none');
              setAccessError('Failed to create enrollment');
            } else {
              console.log('CourseContent: Created enrollment with status:', newEnrollment.is_active ? 'active' : 'inactive');
              setEnrollmentStatus(newEnrollment.is_active ? 'approved' : 'pending');
            }
          } else {
            console.log('CourseContent: No verified payment found');
            setEnrollmentStatus('none');
            setAccessError('Payment required');
            navigate(`/courses/${courseId}`);
          }
        } else {
          console.log('CourseContent: Found enrollment with status:', enrollmentData.is_active ? 'active' : 'inactive');
          setEnrollmentStatus(enrollmentData.is_active ? 'approved' : 'pending');
          
          if (!enrollmentData.is_active) {
            setAccessError('Enrollment pending approval');
          }
        }
      } catch (error) {
        console.error('CourseContent: Error checking access:', error);
        setAccessError('Error checking access');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (courseId) {
      checkAccess();
    }
  }, [user, courseId, contextIsAdmin, navigate, userPayments]);
  
  // Fetch course data and lessons after verifying access
  useEffect(() => {
    const fetchCourseData = async () => {
      if (isLoading || !courseId || accessError === 'Payment required') return;
      
      try {
        console.log('CourseContent: Fetching course data for:', courseId);
        
        // 1. Fetch the course
        await fetchCourse(courseId);
        
        // 2. Fetch lessons for this course
        const currentLessons = await fetchLessons(courseId);
        console.log('CourseContent: Fetched', currentLessons?.length, 'lessons');
        
        if (currentLessons && currentLessons.length > 0) {
          // If there's a lesson ID in the URL, try to use that
          if (lessonIdFromUrl) {
            const lessonById = currentLessons.find(lesson => lesson.id === lessonIdFromUrl);
            if (lessonById) {
              console.log('CourseContent: Setting active lesson by ID:', lessonIdFromUrl);
              setActiveLesson(lessonById);
              await fetchLesson(lessonIdFromUrl);
            } else {
              // Fallback to first lesson if ID not found
              console.log('CourseContent: Lesson ID not found, setting to first lesson');
              setActiveLesson(currentLessons[0]);
              setSearchParams({ lessonId: currentLessons[0].id });
              await fetchLesson(currentLessons[0].id);
            }
          } else {
            // No lesson ID in URL, default to first lesson
            console.log('CourseContent: No lesson ID in URL, setting to first lesson');
            setActiveLesson(currentLessons[0]);
            setSearchParams({ lessonId: currentLessons[0].id });
            await fetchLesson(currentLessons[0].id);
          }
        } else {
          console.log('CourseContent: No lessons found for course:', courseId);
          setActiveLesson(null);
        }
      } catch (error) {
        console.error('CourseContent: Error fetching course data:', error);
        setActiveLesson(null);
      }
    };

    fetchCourseData();
  }, [courseId, fetchCourse, fetchLessons, fetchLesson, lessonIdFromUrl, setSearchParams, isLoading, accessError]);
  
  // Handle lesson change
  const handleLessonChange = async (lesson) => {
    console.log('CourseContent: Changing to lesson:', lesson.id);
    
    // Clean up existing player
    cleanupPlayer();
    
    // Reset all states
    setPlayerInitialized(false);
    setPlayerError(false);
    setShowDirectIframe(false);
    setIsVideoCompleted(false);
    setLessonProgress(0);
    
    // Set the new active lesson
    setActiveLesson(lesson);
    
    // Update the URL
    setSearchParams({ lessonId: lesson.id });
    
    // Fetch the detailed lesson data
    try {
      console.log('Fetching lesson details for ID:', lesson.id);
      await fetchLesson(lesson.id);
    } catch (error) {
      console.error('CourseContent: Error fetching lesson details:', error);
    }
  };
  
  // Improved cleanup function to handle all player resources
  const cleanupPlayer = useCallback(() => {
    console.log('Cleaning up player resources');
    // Clear the progress tracking interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    // Destroy the YouTube player instance if it exists
    if (youtubePlayer.current) {
      try {
        youtubePlayer.current.destroy();
      } catch (error) {
        console.error('Error destroying YouTube player:', error);
      }
      youtubePlayer.current = null;
    }

    // Remove any child elements from the player container
    if (playerContainerRef.current) {
      while (playerContainerRef.current.firstChild) {
        playerContainerRef.current.removeChild(playerContainerRef.current.firstChild);
      }
    }

    setPlayerInitialized(false);
  }, []);
  
  // Handle video progress
  const handleProgress = (progress) => {
    if (!activeLesson) return;
    
    const progressPercent = Math.round(progress.played * 100);
    setLessonProgress(progressPercent);
    
    if (progressPercent > 95) {
      setIsVideoCompleted(true);
        updateProgress(activeLesson.id, true, progress.playedSeconds);
    }
  };
  
  // Handle video completion
  const handleEnded = useCallback(() => {
    if (!activeLesson) return;
    
    console.log('CourseContent: Video ended, marking as completed');
    setIsVideoCompleted(true);
      updateProgress(activeLesson.id, true, activeLesson.duration_minutes * 60);
  }, [activeLesson, updateProgress]);
  
  // Improved YouTube player initialization with better error handling and performance
  useEffect(() => {
    if (!activeLesson || !isApiLoaded || isVideoCompleted || showDirectIframe) return;

    // Clean up any existing player first
    cleanupPlayer();

    console.log('Initializing YouTube player for lesson:', activeLesson.id);
    
    const videoId = activeLesson.youtube_video_id || extractYoutubeId(activeLesson.video_url);
    if (!videoId) {
      console.error('No valid YouTube video ID found for lesson:', activeLesson);
      setPlayerError(true);
      setShowDirectIframe(true);
      return;
    }

    console.log('Using video ID:', videoId);

    // Slight delay to ensure DOM is ready
    const initTimer = setTimeout(() => {
      try {
        if (!playerContainerRef.current) {
          console.error('Player container ref is not available');
          setPlayerError(true);
          setShowDirectIframe(true);
          return;
        }

        // Create a new YouTube player instance
        youtubePlayer.current = new window.YT.Player('youtube-player-container', {
          videoId: videoId,
          playerVars: {
            rel: 0,              // Don't show related videos
            modestbranding: 1,   // Hide YouTube logo
            autoplay: 1,         // Auto-play when ready
            controls: 1,         // Show video controls
            enablejsapi: 1,      // Enable JS API
            origin: window.location.origin, // Set origin for security
            playsinline: 1       // Play inline on mobile devices
          },
          events: {
            'onReady': (event) => {
              console.log('YouTube player ready');
              setPlayerInitialized(true);
              
              // Start tracking progress when player is ready
              if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
              }
              
              progressIntervalRef.current = setInterval(() => {
                if (youtubePlayer.current && typeof youtubePlayer.current.getCurrentTime === 'function') {
                  try {
                    const currentTime = youtubePlayer.current.getCurrentTime();
                    const duration = youtubePlayer.current.getDuration();
                    
                    if (duration > 0) {
                      const progressPercent = Math.floor((currentTime / duration) * 100);
                      setLessonProgress(progressPercent);
                      
                      // Check if video is completed (95% or more)
                      if (progressPercent >= 95 && !isVideoCompleted) {
                        handleEnded();
                      }
                      
                      // Update progress in the database every 5 seconds
                      updateProgress(activeLesson.id, currentTime, progressPercent);
                    }
                  } catch (error) {
                    console.error('Error tracking progress:', error);
                  }
                }
              }, 5000);
            },
            'onStateChange': (event) => {
              // YT.PlayerState values: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
              console.log('Player state changed:', event.data);
              
              if (event.data === window.YT.PlayerState.ENDED) {
                handleEnded();
              } else if (event.data === window.YT.PlayerState.PLAYING) {
                setPlayerError(false);
              }
            },
            'onError': (event) => {
              console.error('YouTube player error:', event.data);
              setPlayerError(true);
              
              // If video not found or embedding disabled, use the fallback
              if (event.data === 100 || event.data === 101 || event.data === 150) {
                setShowDirectIframe(true);
              }
            }
          }
        });
        
        console.log('YouTube player instance created successfully');
      } catch (error) {
        console.error('Failed to create YouTube player:', error);
        setPlayerError(true);
        setShowDirectIframe(true);
      }
    }, 300); // Reduced delay for faster initialization
    
    return () => {
      if (initTimer) clearTimeout(initTimer);
      cleanupPlayer();
    };
  }, [activeLesson, updateProgress, handleEnded, cleanupPlayer, isVideoCompleted, isApiLoaded]);
  
  // YouTube API initialization with better error handling
  useEffect(() => {
    // Only load the YouTube API once
    if (window.YT || document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      setIsApiLoaded(!!window.YT);
      return;
    }
    
    console.log('Loading YouTube iframe API');
    
    // Create global callback for when YouTube API is ready
    window.onYouTubeIframeAPIReady = () => {
      console.log('YouTube iframe API ready');
      setIsApiLoaded(true);
    };
    
    // Load the YouTube API script
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.onload = () => console.log('YouTube API script loaded');
    script.onerror = (error) => {
      console.error('Failed to load YouTube API:', error);
      setShowDirectIframe(true); // Fall back to direct iframe if script fails to load
    };
    
    document.body.appendChild(script);
    
    return () => {
      // Clean up global callback
      window.onYouTubeIframeAPIReady = null;
    };
  }, []);
  
  // Add a timeout to automatically fall back to ReactPlayer if the YouTube API takes too long
  useEffect(() => {
    if (!activeLesson) return;
    
    let timeoutId;
    
    if (!playerInitialized && !showDirectIframe && !playerError) {
      console.log('Setting up automatic fallback timeout');
      
      // If YouTube player doesn't initialize within 8 seconds, use the fallback
      timeoutId = setTimeout(() => {
        console.log('YouTube player took too long to initialize, using fallback');
        setShowDirectIframe(true);
      }, 8000); // Increased from 5s to 8s to give more time for initialization
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [activeLesson, playerInitialized, showDirectIframe, playerError]);
  
  // At the beginning of the component, add additional logging for debugging
  useEffect(() => {
    // Log player references to help debug player initialization issues
    console.log('Component mounted or updated');
    console.log('Player container ref exists:', !!playerContainerRef.current);
    console.log('Player initialized:', playerInitialized);
    console.log('Is API loaded:', isApiLoaded);
    console.log('Show direct iframe:', showDirectIframe);
    console.log('Player error:', playerError);
    
    // On component unmount
    return () => {
      console.log('Component unmounting - cleaning up');
      cleanupPlayer();
    };
  }, [cleanupPlayer]);
  
  if (isLoading || storeLoading || paymentsLoading) {
    return <LoadingSpinner />;
  }
  
  if (accessError && accessError !== 'Enrollment pending approval') {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <h2 className="text-2xl font-bold text-red-700 mb-2">Access Denied</h2>
          <p className="text-gray-700 mb-4">{accessError}</p>
          <Link to={`/courses/${courseId}`} className="btn btn-primary">
            Return to Course Page
          </Link>
        </div>
      </div>
    );
  }
  
  const isPendingApproval = enrollmentStatus === 'pending';
  
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header with course title */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              {currentCourse?.title || 'Course Content'}
            </h1>
            {isAdmin && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Admin View
              </span>
            )}
            {isPendingApproval && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Pending Approval
              </span>
            )}
          </div>
        </div>
      </header>
      
      {/* Display approval pending message */}
      {isPendingApproval && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-yellow-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Enrollment Pending</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Your enrollment is waiting for admin approval. You can view the course content, but some features may be limited until approval.</p>
          </div>
        </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main content grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar - Curriculum */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Course Curriculum</h2>
      </div>
            <div className="divide-y divide-gray-200 max-h-[70vh] overflow-y-auto">
              {lessons && lessons.map((lesson, index) => (
                <button
                  key={lesson.id} 
                  onClick={() => handleLessonChange(lesson)}
                  className={`w-full text-left px-4 py-4 hover:bg-gray-50 transition-colors flex items-start ${
                    activeLesson?.id === lesson.id ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex-shrink-0 mr-3 mt-1">
                    <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                          {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{lesson.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{lesson.duration_minutes} min</p>
                </div>
                </button>
              ))}
              
              {(!lessons || lessons.length === 0) && (
                <div className="px-4 py-5 text-sm text-gray-500">
                  No lessons available for this course.
                </div>
              )}
            </div>
          </div>
          
          {/* Right content - Video player and description */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            {activeLesson ? (
              <>
                {/* Video player container */}
                <div className="relative aspect-video bg-black w-full">
                  {playerError ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-6">
                        <p className="text-white mb-4">Unable to load video. It may be private or have embedding disabled.</p>
                        <button
                          onClick={() => setShowDirectIframe(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Try Alternative Player
                        </button>
        </div>
                </div>
                  ) : showDirectIframe ? (
                    <div className="relative w-full h-full">
                      {/* Use ReactPlayer as a fallback */}
                <ReactPlayer
                  ref={playerRef}
                        url={activeLesson?.video_url || `https://www.youtube.com/watch?v=${activeLesson?.youtube_video_id}`}
                  width="100%"
                  height="100%"
                        playing
                  controls
                  onProgress={handleProgress}
                  onEnded={handleEnded}
                  config={{
                    youtube: {
                      playerVars: { 
                              modestbranding: 1,
                              rel: 0,
                              autoplay: 1
                            }
                          }
                        }}
                        onError={(e) => {
                          console.error('ReactPlayer error:', e);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      {/* YouTube Player API container */}
                      <div 
                        id="youtube-player-container"
                        ref={playerContainerRef} 
                        className="absolute inset-0 w-full h-full"
                        style={{display: 'block'}}
                      ></div>
                      
                      {/* Loading indicator */}
                      {!playerInitialized && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10">
                          <div className="text-center">
                            <div className="w-12 h-12 border-t-4 border-b-4 border-white rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-white">Loading video player...</p>
                            {!isApiLoaded && <p className="text-white text-sm mt-2">YouTube API still loading...</p>}
                            <button
                              onClick={() => setShowDirectIframe(true)}
                              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                              Use Alternative Player
                            </button>
                          </div>
                        </div>
                      )}
                </div>
              )}
            </div>
              </>
            ) : (
              <div className="flex items-center justify-center aspect-video bg-gray-100">
                <p className="text-gray-500">Select a lesson to start learning</p>
              </div>
            )}
            
            {/* Lesson content */}
            <div className="px-4 py-5 sm:p-6">
              {activeLesson ? (
                <>
                  <h2 className="text-xl font-semibold text-gray-900">{activeLesson.title}</h2>
                  
                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{lessonProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${lessonProgress}%` }}
                ></div>
                    </div>
              </div>
              
                  {/* Description */}
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900">Description</h3>
                    <div className="mt-2 prose prose-sm max-w-none text-gray-500">
                      {activeLesson.description ? (
                        <p>{activeLesson.description}</p>
                      ) : (
                        <p className="italic">No description available for this lesson.</p>
                )}
              </div>
              </div>
              
                  {/* Completion status */}
                  {isVideoCompleted && (
                    <div className="mt-6 p-4 bg-green-50 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-green-800">
                            Lesson completed!
                          </p>
                        </div>
                      </div>
                </div>
              )}
                </>
              ) : (
                <p className="text-gray-500">Select a lesson to view its details</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseContent; 