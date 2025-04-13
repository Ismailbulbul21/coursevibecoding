import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCourseStore } from '../../store/courseStore';
import useLessonStore from '../../store/lessonStore';

const LessonList = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  // Get functions from stores
  const { getCourseById } = useCourseStore();
  const { 
    getLessonsByCourseId, 
    deleteLesson, 
    lessons, 
    isLoading, 
    error 
  } = useLessonStore();
  
  // Course state
  const [course, setCourse] = useState(null);
  
  // UI state
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingLessonId, setDeletingLessonId] = useState(null);

  // Load course and lessons data
  useEffect(() => {
    const loadData = async () => {
      if (courseId) {
        console.log('LessonList: Loading data for course ID:', courseId);
        
        try {
          // Load course data
          const courseData = await getCourseById(courseId);
          console.log('LessonList: Course data loaded:', courseData);
          setCourse(courseData);
          
          // Load lessons for this course
          console.log('LessonList: Fetching lessons...');
          const lessonsData = await getLessonsByCourseId(courseId);
          console.log('LessonList: Lessons fetched:', lessonsData);
        } catch (error) {
          console.error('LessonList: Error loading data:', error);
        }
      }
    };
    
    loadData();
  }, [courseId, getCourseById, getLessonsByCourseId]);

  // Handle lesson deletion
  const handleDeleteLesson = async (lessonId) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      setIsDeleting(true);
      setDeletingLessonId(lessonId);
      
      try {
        await deleteLesson(lessonId, courseId);
      } catch (err) {
        console.error('Error deleting lesson:', err);
      } finally {
        setIsDeleting(false);
        setDeletingLessonId(null);
      }
    }
  };

  // Navigate to lesson form for editing
  const handleEditLesson = (lessonId) => {
    navigate(`/admin/courses/${courseId}/lessons/${lessonId}`);
  };

  // Navigate to lesson form for creating a new lesson
  const handleAddLesson = () => {
    navigate(`/admin/courses/${courseId}/lessons/new`);
  };

  if (!course && !isLoading) {
    console.log('LessonList: Course not found, rendering empty state');
    return <div className="text-center p-8">Course not found</div>;
  }

  console.log('LessonList: Rendering with state:', { 
    course, 
    lessons: lessons || [], 
    isLoading, 
    error 
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Lessons</h1>
          {course && (
            <h2 className="text-lg text-gray-600">Course: {course.title}</h2>
          )}
        </div>
        
        <div className="flex space-x-4">
          <Link 
            to={`/admin/courses`}
            className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
          >
            Back to Courses
          </Link>
          
          <button
            onClick={handleAddLesson}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add New Lesson
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center p-8">Loading lessons...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {lessons && lessons.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Free?
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lessons
                  .sort((a, b) => a.order_index - b.order_index)
                  .map(lesson => (
                    <tr key={lesson.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {lesson.order_index}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {lesson.title}
                        </div>
                        {lesson.video_url && (
                          <div className="text-sm text-gray-500">
                            Has video
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {lesson.duration_minutes ? `${lesson.duration_minutes} min` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {lesson.is_free ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Yes
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditLesson(lesson.id)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(lesson.id)}
                          disabled={isDeleting && deletingLessonId === lesson.id}
                          className="text-red-600 hover:text-red-900 disabled:text-gray-400"
                        >
                          {isDeleting && deletingLessonId === lesson.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No lessons found for this course.</p>
              <button
                onClick={handleAddLesson}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Your First Lesson
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LessonList; 