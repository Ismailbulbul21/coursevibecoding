import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';
import { AnimatePresence, motion } from 'framer-motion';
import { useCourseStore } from '../../store/courseStore';
import useLessonStore from '../../store/lessonStore';
import LoadingSpinner from '../../components/LoadingSpinner';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

const Lessons = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Store state
  const { 
    getLessonsByCourseId, 
    lessons, 
    isLoading: lessonsLoading, 
    error: lessonsError,
    deleteLesson 
  } = useLessonStore();
  
  const { 
    getCourseById, 
    currentCourse, 
    isLoading: courseLoading 
  } = useCourseStore();

  // Fetch course and lessons
  useEffect(() => {
    if (courseId) {
      getCourseById(courseId);
      getLessonsByCourseId(courseId);
    }
  }, [courseId, getCourseById, getLessonsByCourseId]);

  // Handle delete confirmation
  const openDeleteConfirm = (lessonId) => {
    setActiveLessonId(lessonId);
    setConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setConfirmOpen(false);
    setActiveLessonId(null);
  };

  // Delete lesson
  const handleDeleteLesson = async () => {
    if (!activeLessonId) return;
    
    setIsDeleting(true);
    
    try {
      const success = await deleteLesson(activeLessonId, courseId);
      
      if (success) {
        toast.success('Lesson deleted successfully');
      } else {
        toast.error('Failed to delete lesson');
      }
    } catch (error) {
      console.error('Error in handleDeleteLesson:', error);
      toast.error('Error deleting lesson');
    } finally {
      setIsDeleting(false);
      closeDeleteConfirm();
    }
  };

  // Loading state
  const isLoading = courseLoading || lessonsLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if (lessonsError) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{lessonsError}</p>
        </div>
        <Link to="/admin/courses" className="text-blue-600 hover:underline">
          ← Back to Courses
        </Link>
      </div>
    );
  }

  // No course found
  if (!currentCourse) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
          <p className="text-yellow-700">Course not found</p>
        </div>
        <Link to="/admin/courses" className="text-blue-600 hover:underline">
          ← Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">{currentCourse.title} - Lessons</h1>
          <Link to="/admin/courses" className="text-blue-600 hover:underline">
            ← Back to Courses
          </Link>
        </div>
        <Link
          to={`/admin/courses/${courseId}/lessons/new`}
          className="btn-primary flex items-center gap-2"
        >
          <HiPlus className="text-lg" /> Add Lesson
        </Link>
      </div>

      {lessons.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center border border-gray-100">
          <p className="text-gray-600 mb-4">No lessons found for this course.</p>
          <p className="text-gray-500 mb-6">Create the first lesson to get started!</p>
          <Link
            to={`/admin/courses/${courseId}/lessons/new`}
            className="btn-primary inline-flex items-center gap-2"
          >
            <HiPlus className="text-lg" /> Add First Lesson
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lessons.map((lesson) => (
                <tr key={lesson.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lesson.order_index}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {lesson.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lesson.duration_minutes ? `${lesson.duration_minutes} min` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/admin/courses/${courseId}/lessons/${lesson.id}/edit`)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit lesson"
                      >
                        <HiPencil className="text-lg" />
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(lesson.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete lesson"
                      >
                        <HiTrash className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this lesson? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeDeleteConfirm}
                  className="btn-secondary"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteLesson}
                  className="btn-danger"
                  disabled={isDeleting}
                >
                  {isDeleting ? <LoadingSpinner size="sm" /> : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Lessons; 