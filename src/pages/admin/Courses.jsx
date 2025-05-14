import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCourseStore } from '../../store/courseStore';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminCourses = () => {
  const { courses, fetchCourses, isLoading, deleteCourse } = useCourseStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredCourses = courses?.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const confirmDelete = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };
  
  const handleDelete = async () => {
    try {
      await deleteCourse(courseToDelete.id);
      setShowDeleteModal(false);
      setCourseToDelete(null);
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };
  
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCourseToDelete(null);
  };
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="container mx-auto px-4  py-52 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#2C1952] relative inline-block">
          Manage Courses
          <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#5D3BE7] to-[#FF6B6B] rounded-full"></span>
        </h1>
        <Link
          to="/admin/courses/new"
          className="bg-gradient-to-r from-[#5D3BE7] to-[#4A2EC0] text-white py-2 px-4 rounded-xl transition duration-300 hover:shadow-lg hover:shadow-[#5D3BE7]/20 flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add New Course
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 border border-gray-100 animate-slide-up">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-[#5D3BE7]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-[#8C8C9E] focus:outline-none focus:ring-[#5D3BE7] focus:border-[#5D3BE7] sm:text-sm"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-[#F5F7FF]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#5D3BE7] uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#5D3BE7] uppercase tracking-wider">
                  Level
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#5D3BE7] uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#5D3BE7] uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#5D3BE7] uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[#5D3BE7] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredCourses && filteredCourses.length > 0 ? (
                filteredCourses.map((course, index) => (
                  <tr key={course.id} className={`hover:bg-[#F5F7FF] transition-colors duration-150 animate-fade-in animate-delay-${index * 100 > 500 ? 500 : index * 100}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img className="h-10 w-10 rounded-lg object-cover shadow-sm" src={course.image_url || "/placeholder-course.jpg"} alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-[#2C1952]">{course.title}</div>
                          <div className="text-sm text-[#8C8C9E]">{course.lessons?.length || 0} lessons</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#2C1952]">{course.level || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#2C1952] font-medium">${course.price || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        course.is_published ? 'bg-[#00E5A0]/10 text-[#00E5A0]' : 'bg-[#FF6B6B]/10 text-[#FF6B6B]'
                      }`}>
                        {course.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8C8C9E]">
                      {course.created_at ? new Date(course.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/courses/${course.id}/lessons`}
                        className="text-[#5D3BE7] hover:text-[#4A2EC0] mr-4"
                      >
                        Lessons
                      </Link>
                      <Link
                        to={`/admin/courses/${course.id}/edit`}
                        className="text-[#5D3BE7] hover:text-[#4A2EC0] mr-4"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => confirmDelete(course)}
                        className="text-[#FF6B6B] hover:text-[#E94E4E]"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-sm text-[#8C8C9E]">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-[#5D3BE7]/20 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                      {searchTerm ? "No courses found matching your search." : "No courses available."}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl p-6 max-w-md mx-auto shadow-xl">
            <h3 className="text-lg font-medium text-[#2C1952] mb-4">Confirm Delete</h3>
            <p className="text-sm text-[#8C8C9E] mb-4">
              Are you sure you want to delete "{courseToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="bg-gray-100 text-[#2C1952] px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-[#FF6B6B] text-white px-4 py-2 rounded-lg hover:bg-[#E94E4E] transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses; 