import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCourseStore } from '../../store/courseStore';

const CourseList = () => {
  const navigate = useNavigate();
  
  // Get functions and state from course store
  const { 
    fetchCourses, 
    deleteCourse, 
    courses, 
    isLoading, 
    error 
  } = useCourseStore();
  
  // UI state
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingCourseId, setDeletingCourseId] = useState(null);

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Handle course deletion
  const handleDeleteCourse = async (courseId) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setIsDeleting(true);
      setDeletingCourseId(courseId);
      
      try {
        await deleteCourse(courseId);
      } catch (err) {
        console.error('Error deleting course:', err);
      } finally {
        setIsDeleting(false);
        setDeletingCourseId(null);
      }
    }
  };

  // Navigate to course form for editing
  const handleEditCourse = (courseId) => {
    navigate(`/admin/courses/${courseId}/edit`);
  };

  // Navigate to lessons page for a course
  const handleManageLessons = (courseId) => {
    navigate(`/admin/courses/${courseId}/lessons`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Courses</h1>
        <Link 
          to="/admin/courses/new" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add New Course
        </Link>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center p-8">Loading courses...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {courses && courses.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map(course => (
                  <tr key={course.id}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {course.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {course.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${course.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleManageLessons(course.id)}
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        Lessons
                      </button>
                      <button
                        onClick={() => handleEditCourse(course.id)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        disabled={isDeleting && deletingCourseId === course.id}
                        className="text-red-600 hover:text-red-900 disabled:text-gray-400"
                      >
                        {isDeleting && deletingCourseId === course.id 
                          ? 'Deleting...' 
                          : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No courses found.</p>
              <Link
                to="/admin/courses/new"
                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Your First Course
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseList; 