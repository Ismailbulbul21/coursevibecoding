import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourseStore } from '../store/courseStore';
import LoadingSpinner from '../components/LoadingSpinner';
import CourseCard from '../components/CourseCard';

const CourseCatalog = () => {
  const { courses, fetchCourses, isLoading } = useCourseStore();
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);
  
  useEffect(() => {
    if (courses) {
      if (filter === 'all') {
        setFilteredCourses(courses.filter(course => course.is_published));
      } else {
        setFilteredCourses(
          courses.filter(course => course.is_published && course.level === filter)
        );
      }
    }
  }, [courses, filter]);
  
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="container mx-auto px-4 py-12 bg-[#F7F9FB]">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-[#1D3946]">Koorsooyinkeena</h1>
        <p className="text-[#7A8994] text-lg">Ka dooro koorsooyinka ugu wanaagsan ee aanu khibrad u leenahay. Waxbarasho tayo sare leh oo qiimo jaban.</p>
      </div>
      
      <div className="mb-10 flex justify-center">
        <div className="inline-flex rounded-lg shadow-sm bg-white p-1">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-5 py-2.5 text-sm font-medium rounded-md ${
              filter === 'all'
                ? 'bg-[#346B7E] text-white shadow-sm'
                : 'bg-white text-[#7A8994] hover:text-[#1D3946] hover:bg-gray-50'
            } transition-all duration-200`}
          >
            Dhamaan
          </button>
          <button
            type="button"
            onClick={() => setFilter('Beginner')}
            className={`px-5 py-2.5 text-sm font-medium ${
              filter === 'Beginner'
                ? 'bg-[#346B7E] text-white shadow-sm'
                : 'bg-white text-[#7A8994] hover:text-[#1D3946] hover:bg-gray-50'
            } transition-all duration-200`}
          >
            Bilowga
          </button>
          <button
            type="button"
            onClick={() => setFilter('Intermediate')}
            className={`px-5 py-2.5 text-sm font-medium ${
              filter === 'Intermediate'
                ? 'bg-[#346B7E] text-white shadow-sm'
                : 'bg-white text-[#7A8994] hover:text-[#1D3946] hover:bg-gray-50'
            } transition-all duration-200`}
          >
            Dhexe
          </button>
          <button
            type="button"
            onClick={() => setFilter('Advanced')}
            className={`px-5 py-2.5 text-sm font-medium ${
              filter === 'Advanced'
                ? 'bg-[#346B7E] text-white shadow-sm'
                : 'bg-white text-[#7A8994] hover:text-[#1D3946] hover:bg-gray-50'
            } transition-all duration-200`}
          >
            Sare
          </button>
        </div>
      </div>
      
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-[#346B7E] opacity-50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 13.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-[#7A8994] text-lg mb-4">Raali noqo, wax koorso ah oo leh doorashadaan lama helin.</p>
          <button
            onClick={() => setFilter('all')}
            className="btn-primary"
          >
            Dhamaan Koorsooyinka Muuji
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseCatalog; 