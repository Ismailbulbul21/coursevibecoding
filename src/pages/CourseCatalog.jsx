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
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F7FF] to-white flex items-center justify-center">
        <div className="w-20 h-20 relative">
          <div className="absolute inset-0 rounded-full border-4 border-t-[#5D3BE7] border-r-[#00D2FF] border-b-[#00FFF0] border-l-[#FF3366] animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-t-[#00D2FF] border-r-[#00FFF0] border-b-[#FF3366] border-l-[#5D3BE7] animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="font-poppins overflow-hidden">
      {/* Hero Section with Electric Circuit Background */}
      <section className="relative py-20 overflow-hidden bg-white">
        {/* Electric background */}
        <div className="absolute inset-0 circuit-pattern opacity-30"></div>
        
        {/* Glowing gradients */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-0 w-1/3 h-2/3 bg-[#5D3BE7]/10 blur-[80px] rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[#00D2FF]/10 blur-[100px] rounded-full"></div>
        </div>
        
        {/* Animated connection elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {/* Connection nodes */}
          <div className="absolute top-[20%] right-[10%] h-4 w-4 rounded-full bg-[#5D3BE7] animate-electric-pulse"></div>
          <div className="absolute top-[70%] left-[20%] h-4 w-4 rounded-full bg-[#00D2FF] animate-electric-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-[40%] left-[15%] h-4 w-4 rounded-full bg-[#FF3366] animate-electric-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-[60%] right-[25%] h-4 w-4 rounded-full bg-[#00FFF0] animate-electric-pulse" style={{animationDelay: '1.5s'}}></div>
          
          {/* Connection lines */}
          <div className="absolute top-[20%] right-[10%] w-[20%] h-0.5 bg-gradient-to-l from-[#5D3BE7] to-[#00D2FF] origin-left animate-connection" style={{transform: 'rotate(-15deg)'}}></div>
          <div className="absolute top-[40%] left-[15%] w-[15%] h-0.5 bg-gradient-to-r from-[#FF3366] to-[#5D3BE7] origin-left animate-connection" style={{animationDelay: '1.3s', transform: 'rotate(30deg)'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-[#5D3BE7]/10 px-4 py-2 rounded-full text-[#5D3BE7] text-sm font-medium mb-6 animate-electric-pulse">DISCOVER YOUR NEXT SKILL</div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 font-montserrat leading-tight text-[#2C1952]">
              Connect with Your <span className="text-electric-gradient">Perfect Course</span>
            </h1>
            <p className="text-xl text-[#8C8C9E] max-w-2xl mx-auto mb-10">
              Browse our extensive catalog of high-quality courses designed to help you learn new skills and advance your career.
            </p>
            
            {/* Animated Filter Pills */}
            <div className="inline-flex flex-wrap justify-center rounded-xl shadow-xl bg-white p-2 border border-[#5D3BE7]/20 transition-all duration-500 hover:shadow-[#5D3BE7]/20 animate-electric-pulse">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-6 py-3 text-base font-medium rounded-lg transition-all duration-300 ${
                  filter === 'all'
                    ? 'bg-electric-glow text-white shadow-lg shadow-[#5D3BE7]/30 transform -translate-y-1'
                    : 'bg-[#5D3BE7]/5 text-[#2C1952] hover:bg-[#5D3BE7]/10'
                }`}
              >
                All Courses
              </button>
              <button
                type="button"
                onClick={() => setFilter('Beginner')}
                className={`px-6 py-3 text-base font-medium rounded-lg transition-all duration-300 ${
                  filter === 'Beginner'
                    ? 'bg-gradient-to-r from-[#00D2FF] to-[#00FFF0] text-white shadow-lg shadow-[#00D2FF]/30 transform -translate-y-1'
                    : 'bg-[#00D2FF]/5 text-[#2C1952] hover:bg-[#00D2FF]/10'
                }`}
              >
                Beginner
              </button>
              <button
                type="button"
                onClick={() => setFilter('Intermediate')}
                className={`px-6 py-3 text-base font-medium rounded-lg transition-all duration-300 ${
                  filter === 'Intermediate'
                    ? 'bg-gradient-to-r from-[#5D3BE7] to-[#00D2FF] text-white shadow-lg shadow-[#5D3BE7]/30 transform -translate-y-1'
                    : 'bg-[#5D3BE7]/5 text-[#2C1952] hover:bg-[#5D3BE7]/10'
                }`}
              >
                Intermediate
              </button>
              <button
                type="button"
                onClick={() => setFilter('Advanced')}
                className={`px-6 py-3 text-base font-medium rounded-lg transition-all duration-300 ${
                  filter === 'Advanced'
                    ? 'bg-gradient-to-r from-[#FF3366] to-[#FF6B6B] text-white shadow-lg shadow-[#FF3366]/30 transform -translate-y-1'
                    : 'bg-[#FF3366]/5 text-[#2C1952] hover:bg-[#FF3366]/10'
                }`}
              >
                Advanced
              </button>
            </div>
          </div>
        </div>
        
        {/* Circuit Lines Divider */}
        <div className="absolute bottom-0 left-0 w-full h-12 overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-[#5D3BE7]/20"></div>
          <div className="absolute bottom-0 left-[10%] h-12 w-0.5 bg-[#5D3BE7]/20"></div>
          <div className="absolute bottom-0 left-[30%] h-8 w-0.5 bg-[#5D3BE7]/20"></div>
          <div className="absolute bottom-0 left-[50%] h-12 w-0.5 bg-[#5D3BE7]/20"></div>
          <div className="absolute bottom-0 left-[70%] h-8 w-0.5 bg-[#5D3BE7]/20"></div>
          <div className="absolute bottom-0 left-[90%] h-12 w-0.5 bg-[#5D3BE7]/20"></div>
          
          {/* Animated connection points */}
          <div className="absolute bottom-0 left-[10%] w-3 h-3 rounded-full bg-[#5D3BE7] animate-electric-pulse"></div>
          <div className="absolute bottom-0 left-[30%] w-3 h-3 rounded-full bg-[#00D2FF] animate-electric-pulse" style={{animationDelay: '0.3s'}}></div>
          <div className="absolute bottom-0 left-[50%] w-3 h-3 rounded-full bg-[#5D3BE7] animate-electric-pulse" style={{animationDelay: '0.6s'}}></div>
          <div className="absolute bottom-0 left-[70%] w-3 h-3 rounded-full bg-[#00D2FF] animate-electric-pulse" style={{animationDelay: '0.9s'}}></div>
          <div className="absolute bottom-0 left-[90%] w-3 h-3 rounded-full bg-[#5D3BE7] animate-electric-pulse" style={{animationDelay: '1.2s'}}></div>
        </div>
      </section>
      
      {/* Courses Section */}
      <section className="py-16 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 electric-grid opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {filteredCourses.length > 0 ? (
            <>
              <div className="mb-12 flex items-end justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-[#2C1952] font-montserrat">
                    <span className="relative inline-block">
                      <span className="relative z-10">{filteredCourses.length} Courses Available</span>
                      <span className="absolute bottom-2 left-0 w-full h-3 bg-gradient-to-r from-[#00D2FF]/40 to-[#5D3BE7]/40 transform -rotate-2"></span>
                    </span>
                  </h2>
                </div>
                <div className="hidden md:block">
                  <div className="flex items-center gap-3">
                    <span className="text-[#8C8C9E]">Sort by:</span>
                    <select className="border border-[#5D3BE7]/20 rounded-lg px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5D3BE7]/50">
                      <option>Most Popular</option>
                      <option>Newest First</option>
                      <option>Price (Low to High)</option>
                      <option>Price (High to Low)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course, index) => (
                  <div 
                    key={course.id} 
                    className="animate-fade-in" 
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="electric-card p-1">
                      <div className="bg-white rounded-xl overflow-hidden">
                        <CourseCard course={course} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl shadow-lg border border-[#5D3BE7]/20 max-w-3xl mx-auto electric-card">
              <div className="w-24 h-24 bg-[#5D3BE7]/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-electric-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#5D3BE7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#2C1952] mb-3">No Courses Found</h3>
              <p className="text-[#8C8C9E] max-w-lg mx-auto mb-6">We couldn't find any courses that match your selected filter criteria.</p>
              <button
                onClick={() => setFilter('all')}
                className="bg-electric-glow text-white font-semibold px-8 py-3 rounded-full hover:shadow-xl hover:shadow-[#5D3BE7]/20 transform hover:-translate-y-1 transition-all duration-300"
              >
                View All Courses
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* Featured/Recommended Section with Connection Theme */}
      <section className="py-20 relative overflow-hidden bg-[#F5F7FF]">
        {/* Circuit pattern background */}
        <div className="absolute inset-0 circuit-pattern opacity-20"></div>
        
        {/* Moving electric dots */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[20%] left-[20%] h-3 w-3 rounded-full bg-[#5D3BE7] animate-float" style={{animationDuration: '8s'}}></div>
          <div className="absolute top-[60%] left-[60%] h-3 w-3 rounded-full bg-[#00D2FF] animate-float" style={{animationDuration: '10s', animationDelay: '1s'}}></div>
          <div className="absolute top-[80%] left-[30%] h-3 w-3 rounded-full bg-[#FF3366] animate-float" style={{animationDuration: '12s', animationDelay: '2s'}}></div>
          <div className="absolute top-[40%] left-[80%] h-3 w-3 rounded-full bg-[#00FFF0] animate-float" style={{animationDuration: '9s', animationDelay: '0.5s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 font-montserrat text-[#2C1952]">Why Choose Our <span className="text-electric-gradient">Courses</span></h2>
            <p className="text-lg text-[#8C8C9E] max-w-2xl mx-auto">
              Our courses are designed to provide you with the skills and knowledge you need to succeed in today's competitive market.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="relative bg-white rounded-xl p-8 overflow-hidden group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-[#5D3BE7]/10">
              <div className="absolute top-0 right-0 h-20 w-20">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#5D3BE7]/10">
                  <path fill="currentColor" d="M47.7,-57.2C59,-47.3,63.6,-29.7,68.3,-10.9C72.9,7.9,77.8,27.8,71.7,43.8C65.6,59.8,48.6,71.9,30.9,74.1C13.1,76.3,-5.4,68.6,-22.8,61.1C-40.2,53.7,-56.4,46.6,-64.5,33.7C-72.7,20.9,-72.7,2.3,-67.8,-14C-63,-30.2,-53.2,-44,-40.3,-54C-27.4,-64,-13.7,-70.1,2.1,-72.8C18,-75.5,36,-67.1,47.7,-57.2Z" transform="translate(100 100)" />
                </svg>
              </div>
              
              <div className="mb-6 relative">
                <div className="w-16 h-16 bg-[#5D3BE7]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 animate-electric-pulse">
                  <svg className="w-8 h-8 text-[#5D3BE7]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                  </svg>
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-[#2C1952]">Customizable Learning</h3>
              <p className="text-[#8C8C9E]">
                Learn at your own pace with flexible schedules and personalized learning paths.
              </p>
              
              {/* Connection visual */}
              <div className="absolute bottom-4 right-4 flex items-center space-x-1 opacity-40 group-hover:opacity-100 transition-opacity">
                <div className="h-1.5 w-1.5 rounded-full bg-[#5D3BE7]"></div>
                <div className="h-1 w-8 bg-[#5D3BE7]"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-[#5D3BE7]"></div>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="relative bg-white rounded-xl p-8 overflow-hidden group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-[#00D2FF]/10">
              <div className="absolute top-0 right-0 h-20 w-20">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#00D2FF]/10">
                  <path fill="currentColor" d="M47.7,-57.2C59,-47.3,63.6,-29.7,68.3,-10.9C72.9,7.9,77.8,27.8,71.7,43.8C65.6,59.8,48.6,71.9,30.9,74.1C13.1,76.3,-5.4,68.6,-22.8,61.1C-40.2,53.7,-56.4,46.6,-64.5,33.7C-72.7,20.9,-72.7,2.3,-67.8,-14C-63,-30.2,-53.2,-44,-40.3,-54C-27.4,-64,-13.7,-70.1,2.1,-72.8C18,-75.5,36,-67.1,47.7,-57.2Z" transform="translate(100 100)" />
                </svg>
              </div>
              
              <div className="mb-6 relative">
                <div className="w-16 h-16 bg-[#00D2FF]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 animate-electric-pulse">
                  <svg className="w-8 h-8 text-[#00D2FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-[#2C1952]">Expert Instructors</h3>
              <p className="text-[#8C8C9E]">
                Learn from industry professionals with years of experience in their respective fields.
              </p>
              
              {/* Connection visual */}
              <div className="absolute bottom-4 right-4 flex items-center space-x-1 opacity-40 group-hover:opacity-100 transition-opacity">
                <div className="h-1.5 w-1.5 rounded-full bg-[#00D2FF]"></div>
                <div className="h-1 w-8 bg-[#00D2FF]"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-[#00D2FF]"></div>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="relative bg-white rounded-xl p-8 overflow-hidden group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-[#00FFF0]/10">
              <div className="absolute top-0 right-0 h-20 w-20">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#00FFF0]/10">
                  <path fill="currentColor" d="M47.7,-57.2C59,-47.3,63.6,-29.7,68.3,-10.9C72.9,7.9,77.8,27.8,71.7,43.8C65.6,59.8,48.6,71.9,30.9,74.1C13.1,76.3,-5.4,68.6,-22.8,61.1C-40.2,53.7,-56.4,46.6,-64.5,33.7C-72.7,20.9,-72.7,2.3,-67.8,-14C-63,-30.2,-53.2,-44,-40.3,-54C-27.4,-64,-13.7,-70.1,2.1,-72.8C18,-75.5,36,-67.1,47.7,-57.2Z" transform="translate(100 100)" />
                </svg>
              </div>
              
              <div className="mb-6 relative">
                <div className="w-16 h-16 bg-[#00FFF0]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 animate-electric-pulse">
                  <svg className="w-8 h-8 text-[#00FFF0]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-[#2C1952]">Real-world Skills</h3>
              <p className="text-[#8C8C9E]">
                Gain practical skills and knowledge that you can apply immediately in your professional life.
              </p>
              
              {/* Connection visual */}
              <div className="absolute bottom-4 right-4 flex items-center space-x-1 opacity-40 group-hover:opacity-100 transition-opacity">
                <div className="h-1.5 w-1.5 rounded-full bg-[#00FFF0]"></div>
                <div className="h-1 w-8 bg-[#00FFF0]"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-[#00FFF0]"></div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link 
              to="/register" 
              className="inline-flex items-center bg-electric-glow text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 group hover:shadow-xl hover:shadow-[#5D3BE7]/20 transform hover:-translate-y-1"
            >
              <span>Start Learning Today</span>
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseCatalog; 