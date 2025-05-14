import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourseStore } from '../store/courseStore';
import CourseCard from '../components/CourseCard';

const Home = () => {
  const { courses, fetchCourses, isLoading } = useCourseStore();
  const [featuredCourses, setFeaturedCourses] = useState([]);
  
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);
  
  useEffect(() => {
    // Get up to 3 published courses to feature on the home page
    if (courses && courses.length > 0) {
      setFeaturedCourses(
        courses
          .filter(course => course.is_published)
          .slice(0, 3)
      );
    }
  }, [courses]);

  return (
    <div className="font-poppins overflow-hidden">
      {/* Hero Section with Electric Circuit Background */}
      <section className="min-h-[90vh] relative overflow-hidden py-24 flex items-center bg-white electric-section">
        {/* Circuit background pattern */}
        <div className="absolute inset-0 circuit-pattern opacity-10"></div>
        
        {/* Animated connection elements */}
        <div className="absolute top-0 left-0 w-full h-full z-[1] overflow-hidden">
          {/* Connection nodes */}
          <div className="absolute top-[20%] right-[20%] h-4 w-4 rounded-full bg-[#00D2FF] animate-electric-pulse"></div>
          <div className="absolute top-[40%] left-[15%] h-4 w-4 rounded-full bg-[#5D3BE7] animate-electric-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-[30%] right-[25%] h-4 w-4 rounded-full bg-[#FF3366] animate-electric-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-[60%] right-[40%] h-4 w-4 rounded-full bg-[#00FFF0] animate-electric-pulse" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute top-[30%] left-[35%] h-4 w-4 rounded-full bg-[#5D3BE7] animate-electric-pulse" style={{animationDelay: '2s'}}></div>
          
          {/* Connection lines */}
          <div className="absolute top-[22%] right-[20%] w-[15%] h-0.5 bg-gradient-to-r from-[#00D2FF] to-[#5D3BE7] origin-left animate-connection" style={{animationDelay: '0.3s'}}></div>
          <div className="absolute top-[40%] left-[15%] w-[20%] h-0.5 bg-gradient-to-r from-[#5D3BE7] to-[#00FFF0] origin-left animate-connection" style={{animationDelay: '0.8s', transform: 'rotate(25deg)'}}></div>
          <div className="absolute bottom-[30%] right-[25%] w-[15%] h-0.5 bg-gradient-to-r from-[#FF3366] to-[#5D3BE7] origin-right animate-connection" style={{animationDelay: '1.3s', transform: 'rotate(-15deg)'}}></div>
          
          {/* Glowing effect elements */}
          <div className="absolute top-[5%] right-[10%] w-64 h-64 rounded-full bg-[#5D3BE7]/10 blur-[60px] animate-pulse"></div>
          <div className="absolute bottom-[10%] left-[5%] w-80 h-80 rounded-full bg-[#00D2FF]/10 blur-[70px] animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-[30%] left-[10%] w-60 h-60 rounded-full bg-[#00FFF0]/10 blur-[50px] animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
              <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight font-montserrat animate-slide-up">
                <span className="text-electric-gradient">Connect</span> to Your <br />
                <span className="bg-gradient-to-r from-[#FF3366] to-[#FF6B6B] bg-clip-text text-transparent">Learning Potential</span>
              </h1>
              <p className="text-xl mb-10 text-[#2C1952] animate-slide-up animate-delay-100 max-w-xl">
                Spark your professional growth with high-impact courses developed by leading industry experts.
              </p>
              <div className="flex flex-wrap gap-4 animate-slide-up animate-delay-200">
                <Link 
                  to="/courses" 
                  className="relative overflow-hidden group bg-electric-glow text-white px-8 py-3 rounded-full font-semibold transform transition-all hover:translate-y-[-5px] animate-electric-pulse"
                >
                  <span className="relative z-10">Browse Courses</span>
                </Link>
                <Link 
                  to="/register" 
                  className="relative overflow-hidden group border-2 border-[#5D3BE7] text-[#5D3BE7] px-8 py-3 rounded-full font-semibold transform transition-all hover:translate-y-[-5px] hover:text-white hover:bg-[#5D3BE7] hover:shadow-lg hover:shadow-[#5D3BE7]/30"
                >
                  <span className="relative z-10">Sign Up Now</span>
                </Link>
              </div>
            </div>
            
            {/* Animated Electric Circuit Network */}
            <div className="lg:w-1/2 relative h-[400px]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-72 h-72">
                  {/* Central hub */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-[#5D3BE7] animate-electric-pulse flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-[#00D2FF] animate-electric-flicker"></div>
                    </div>
                  </div>
                  
                  {/* Orbiting elements */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-lg bg-white shadow-xl rotate-45 animate-float" style={{animationDelay: '0s'}}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-sm bg-[#FF3366] animate-electric-flicker"></div>
                    </div>
                  </div>
                  
                  <div className="absolute top-1/2 right-0 transform translate-y-[-50%] w-14 h-14 rounded-full bg-white shadow-xl animate-float" style={{animationDelay: '0.5s'}}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-[#00FFF0] animate-electric-flicker"></div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-lg bg-white shadow-xl rotate-12 animate-float" style={{animationDelay: '1s'}}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-sm rotate-45 bg-[#5D3BE7] animate-electric-flicker"></div>
                    </div>
                  </div>
                  
                  <div className="absolute top-1/2 left-0 transform translate-y-[-50%] w-12 h-12 rounded-lg bg-white shadow-xl animate-float" style={{animationDelay: '1.5s'}}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-7 h-7 rounded-lg bg-[#FFD200] animate-electric-flicker"></div>
                    </div>
                  </div>
                  
                  {/* Connection lines */}
                  <div className="absolute top-1/2 left-0 w-[36%] h-0.5 bg-gradient-to-r from-[#FFD200] to-[#5D3BE7] origin-right animate-connection"></div>
                  <div className="absolute top-0 left-1/2 h-[36%] w-0.5 bg-gradient-to-b from-[#FF3366] to-[#5D3BE7] origin-bottom animate-connection" style={{animationDelay: '0.2s'}}></div>
                  <div className="absolute top-1/2 right-0 w-[36%] h-0.5 bg-gradient-to-l from-[#00FFF0] to-[#5D3BE7] origin-left animate-connection" style={{animationDelay: '0.4s'}}></div>
                  <div className="absolute bottom-0 left-1/2 h-[36%] w-0.5 bg-gradient-to-t from-[#5D3BE7] to-[#5D3BE7] origin-top animate-connection" style={{animationDelay: '0.6s'}}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating badges */}
          <div className="absolute bottom-10 left-10 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg animate-float">
            <div className="h-3 w-3 rounded-full bg-[#00D2FF] animate-electric-pulse"></div>
            <span className="text-[#2C1952] font-medium">Top-rated courses</span>
          </div>
          
          <div className="absolute bottom-10 right-10 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg animate-float" style={{animationDelay: '1s'}}>
            <div className="h-3 w-3 rounded-full bg-[#FF3366] animate-electric-pulse"></div>
            <span className="text-[#2C1952] font-medium">Live support</span>
          </div>
        </div>
      </section>
      
      {/* Curved Section Divider */}
      <div className="relative h-24 overflow-hidden">
        <svg className="absolute -top-1 left-0 w-full overflow-hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#FFFFFF" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,266.7C960,267,1056,245,1152,234.7C1248,224,1344,224,1392,224L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5F7FF] to-white"></div>
      </div>
      
      {/* Featured Courses - Electric Grid Layout */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Electric grid background */}
        <div className="absolute inset-0 electric-grid opacity-70"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 animate-fade-in">
            <div>
              <div className="inline-block bg-[#5D3BE7]/10 px-4 py-2 rounded-full text-[#5D3BE7] font-medium text-sm mb-4 animate-electric-pulse">FEATURED COURSES</div>
              <h2 className="text-5xl font-bold font-montserrat text-[#2C1952]">Power Up Your <span className="text-electric-gradient">Knowledge</span></h2>
            </div>
            <p className="text-lg text-[#8C8C9E] max-w-md mt-4 md:mt-0">
              Connect with industry leading courses to accelerate your career
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#5D3BE7] mb-4"></div>
                <p className="text-[#8C8C9E]">Loading courses...</p>
              </div>
            </div>
          ) : featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course, index) => (
                <div key={course.id} className={`animate-fade-in animate-delay-${index * 100} transform hover:translate-z-10 transition-all duration-300`}>
                  <div className="electric-card p-1">
                    <div className="bg-white rounded-xl overflow-hidden">
                      <CourseCard course={course} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100 animate-fade-in electric-card">
              <div className="w-24 h-24 bg-[#5D3BE7]/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-electric-pulse">
                <svg className="w-12 h-12 text-[#5D3BE7]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#2C1952] mb-3">No courses available yet</h3>
              <p className="text-[#8C8C9E] max-w-md mx-auto">We're working on adding new courses. Check back soon!</p>
            </div>
          )}
          
          <div className="text-center mt-12 animate-fade-in animate-delay-300">
            <Link 
              to="/courses" 
              className="inline-flex items-center text-[#5D3BE7] font-semibold hover:text-[#4A2EC0] transition-all duration-300 group"
            >
              <span className="relative">
                View All Courses
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5D3BE7] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </span>
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* How It Works - Connection Nodes */}
      <section className="py-20 bg-[#F5F7FF] relative overflow-hidden">
        <div className="absolute inset-0 electric-dots"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block bg-[#00D2FF]/10 px-4 py-2 rounded-full text-[#00D2FF] font-medium text-sm mb-4">HOW IT WORKS</div>
            <h2 className="text-4xl font-bold mb-4 font-montserrat text-[#2C1952]">Making Connections <span className="text-electric-gradient">Simple</span></h2>
            <p className="text-lg text-[#8C8C9E] max-w-2xl mx-auto">
              Our streamlined process connects you to the knowledge you need
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {/* Connection line */}
            <div className="absolute top-1/2 left-[16.67%] w-[66.66%] h-1 bg-gradient-to-r from-[#5D3BE7] via-[#00D2FF] to-[#00FFF0] hidden md:block" style={{transform: 'translateY(-50%)'}}></div>
            
            {/* Step 1 */}
            <div className="relative z-10 animate-slide-up">
              <div className="relative bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group overflow-hidden">
                {/* Connection node */}
                <div className="absolute -right-4 top-1/2 w-8 h-8 rounded-full bg-[#5D3BE7] transform -translate-y-1/2 z-20 animate-electric-pulse hidden md:block"></div>
                
                <div className="relative">
                  <div className="bg-[#5D3BE7]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#5D3BE7]/20 transition-colors duration-300 animate-electric-pulse">
                    <svg className="w-8 h-8 text-[#5D3BE7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-[#2C1952]">Find Courses</h3>
                  <p className="text-[#8C8C9E]">
                    Browse our catalog and find high-quality courses designed to help you learn new skills.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative z-10 animate-slide-up animate-delay-100">
              <div className="relative bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group overflow-hidden">
                {/* Connection nodes */}
                <div className="absolute -left-4 top-1/2 w-8 h-8 rounded-full bg-[#00D2FF] transform -translate-y-1/2 z-20 animate-electric-pulse hidden md:block"></div>
                <div className="absolute -right-4 top-1/2 w-8 h-8 rounded-full bg-[#00D2FF] transform -translate-y-1/2 z-20 animate-electric-pulse hidden md:block"></div>
                
                <div className="relative">
                  <div className="bg-[#00D2FF]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#00D2FF]/20 transition-colors duration-300 animate-electric-pulse">
                    <svg className="w-8 h-8 text-[#00D2FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-[#2C1952]">Make Payment</h3>
                  <p className="text-[#8C8C9E]">
                    Submit your payment details and wait for admin confirmation to gain access to the course.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="relative z-10 animate-slide-up animate-delay-200">
              <div className="relative bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group overflow-hidden">
                {/* Connection node */}
                <div className="absolute -left-4 top-1/2 w-8 h-8 rounded-full bg-[#00FFF0] transform -translate-y-1/2 z-20 animate-electric-pulse hidden md:block"></div>
                
                <div className="relative">
                  <div className="bg-[#00FFF0]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#00FFF0]/20 transition-colors duration-300 animate-electric-pulse">
                    <svg className="w-8 h-8 text-[#00FFF0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-[#2C1952]">Start Learning</h3>
                  <p className="text-[#8C8C9E]">
                    Once your payment is confirmed, access the course materials and start learning at your own pace.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section with Electric Gradient */}
      <section className="py-20 relative overflow-hidden bg-electric-glow">
        <div className="absolute inset-0 electric-dots opacity-20"></div>
        
        <div className="container mx-auto text-center px-4 relative z-10">
          <h2 className="text-4xl font-bold mb-6 font-montserrat text-white animate-fade-in">Ready to Energize Your Skills?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-white/90 animate-fade-in animate-delay-100">
            Join our platform today and get access to quality courses that will help you advance your career.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in animate-delay-200">
            <Link 
              to="/register" 
              className="bg-white text-[#5D3BE7] font-bold py-4 px-10 rounded-full hover:bg-opacity-90 transition duration-300 text-lg hover:shadow-xl hover:shadow-[#5D3BE7]/20 transform hover:-translate-y-1"
            >
              Sign Up Now
            </Link>
            <Link 
              to="/courses" 
              className="bg-transparent text-white font-bold py-4 px-10 rounded-full hover:bg-white/10 border border-white transition duration-300 text-lg"
            >
              Browse Courses
            </Link>
          </div>
          
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in animate-delay-200">
              <div className="text-4xl font-bold mb-2 text-white">500+</div>
              <div className="text-white/80">Happy Students</div>
            </div>
            <div className="animate-fade-in animate-delay-300">
              <div className="text-4xl font-bold mb-2 text-white">50+</div>
              <div className="text-white/80">Quality Courses</div>
            </div>
            <div className="animate-fade-in animate-delay-400">
              <div className="text-4xl font-bold mb-2 text-white">10+</div>
              <div className="text-white/80">Expert Instructors</div>
            </div>
            <div className="animate-fade-in animate-delay-500">
              <div className="text-4xl font-bold mb-2 text-white">24/7</div>
              <div className="text-white/80">Support Available</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 